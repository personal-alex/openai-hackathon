import { z } from "zod";
import { EventIdSchema, FactDefinitionSchema, FactValueSchema, type EventId, type QuestionDefinition as CatalogQuestionDefinition, type UserContext } from "@/domain-contracts";

export type FactDefinition = z.infer<typeof FactDefinitionSchema>;
/** The model receives only allowlist metadata, never catalog presentation copy. */
export type QuestionDefinition = Pick<CatalogQuestionDefinition, "id" | "factId" | "rationaleKey">;

/** The structured-output enum is derived from the same approved event ID contract as the catalog. */
const LIVE_EVENT_IDS = EventIdSchema.options;
const LiveEventIdSchema = z.enum(LIVE_EVENT_IDS);
const ExtractOutputSchema = z.object({
  eventId: LiveEventIdSchema.nullable(),
  facts: z.array(z.object({ factId: z.string(), value: FactValueSchema }).strict())
}).strict();
const SelectQuestionOutputSchema = z.object({ questionId: z.string() }).strict();
const DraftExplanationOutputSchema = z.object({ message: z.string().trim().min(1).max(1_200) }).strict();

export type AiOperation = "extract" | "select_question" | "explain";
export type EventCandidate = { id: EventId; facts: readonly FactDefinition[] };
export type ExplanationCandidate = { taskId: string; rationaleKey: string; changeMessageKey?: string };
export type StructuredOutputRequest = {
  operation: AiOperation;
  instructions: string;
  input: Record<string, unknown>;
  schema: Record<string, unknown>;
  maxOutputTokens: number;
  repair?: boolean;
};
export type StructuredOutputTransport = { generate(request: StructuredOutputRequest): Promise<unknown> };
export type AiTelemetry = { record(event: RedactedTelemetryEvent): void };
export type RedactedTelemetryEvent = {
  requestId: string;
  operation: AiOperation;
  eventId?: EventId;
  outcome: "live" | "fallback";
  reason?: AiFallbackReason;
  latencyMs: number;
  outputTokenCap: number;
};
export type AiFallbackReason = "seeded_demo" | "catalog_unavailable" | "rate_limited" | "unavailable" | "invalid_output";
export type AiResult<T> = { kind: "live"; data: T } | { kind: "fallback"; data: T; reason: AiFallbackReason; retryAfterSeconds?: number };

export const AI_LIMITS = {
  sessionAll: { tenMinutes: 15, hour: 40 }, ipAll: { tenMinutes: 100, hour: 250 },
  sessionExtract: { tenMinutes: 3, hour: 6 }, sessionQuestion: { tenMinutes: 8, hour: 20 }, sessionExplanation: { tenMinutes: 6, hour: 16 },
  ipOperation: { tenMinutes: 60, hour: 150 }
} as const;

export type GuardInput = { sessionId: string; clientIp?: string; operation: AiOperation };
export type GuardDecision = { allowed: true } | { allowed: false; retryAfterSeconds: number };
export interface AiRateGuard { consume(input: GuardInput): GuardDecision | Promise<GuardDecision>; }

/** Deployment adapters must supply a shared implementation; this module never substitutes product data storage. */
export interface SharedAiRateGuard extends AiRateGuard { readonly mode: "shared"; }

/** Calls a trusted deployment-owned guard endpoint with opaque session/IP keys and operation metadata only. */
export function createHttpSharedAiRateGuard(url: string, token: string, fetchImpl: typeof fetch = fetch): SharedAiRateGuard {
  return {
    mode: "shared",
    async consume(input) {
      try {
        const response = await fetchImpl(url, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${token}` }, body: JSON.stringify({ ...input, limits: AI_LIMITS }) });
        const parsed = await response.json() as unknown;
        const decision = z.union([z.object({ allowed: z.literal(true) }).strict(), z.object({ allowed: z.literal(false), retryAfterSeconds: z.number().int().positive() }).strict()]).safeParse(parsed);
        return decision.success ? decision.data : { allowed: false, retryAfterSeconds: 60 };
      } catch {
        return { allowed: false, retryAfterSeconds: 60 };
      }
    }
  };
}

/** Development-only fallback. Preview/production must provide shared guard storage before live calls are enabled. */
export class InMemoryAiRateGuard implements AiRateGuard {
  private readonly attempts = new Map<string, number[]>();
  constructor(private readonly now: () => number = Date.now) {}

  consume(input: GuardInput): GuardDecision {
    const now = this.now();
    const policies: Array<[string, number, number]> = [
      [`session:${input.sessionId}:all`, AI_LIMITS.sessionAll.tenMinutes, 600_000], [`session:${input.sessionId}:all`, AI_LIMITS.sessionAll.hour, 3_600_000],
      [`session:${input.sessionId}:${input.operation}`, operationLimit(input.operation, "tenMinutes"), 600_000],
      [`session:${input.sessionId}:${input.operation}`, operationLimit(input.operation, "hour"), 3_600_000]
    ];
    if (input.clientIp) policies.push(
      [`ip:${input.clientIp}:all`, AI_LIMITS.ipAll.tenMinutes, 600_000], [`ip:${input.clientIp}:all`, AI_LIMITS.ipAll.hour, 3_600_000],
      [`ip:${input.clientIp}:${input.operation}`, AI_LIMITS.ipOperation.tenMinutes, 600_000], [`ip:${input.clientIp}:${input.operation}`, AI_LIMITS.ipOperation.hour, 3_600_000]
    );
    const rejected = policies.flatMap(([key, limit, window]) => {
      const history = (this.attempts.get(key) ?? []).filter((at) => at > now - window);
      this.attempts.set(key, history);
      return history.length >= limit ? [Math.max(1, Math.ceil((history[0] + window - now) / 1000))] : [];
    });
    if (rejected.length) return { allowed: false, retryAfterSeconds: Math.max(...rejected) };
    for (const key of new Set(policies.map(([key]) => key))) this.attempts.set(key, [...(this.attempts.get(key) ?? []), now]);
    return { allowed: true };
  }
}

export const NoopTelemetry: AiTelemetry = { record() {} };
export type AiHealthSummary = { totalRequests: number; liveRequests: number; fallbackRequests: number; byOperation: Record<AiOperation, number>; lastRequestAt?: string };

/** Bounded, development-only telemetry. It stores metadata only and never receives prompt or model text. */
export class InMemoryRedactedTelemetry implements AiTelemetry {
  private readonly events: RedactedTelemetryEvent[] = [];
  constructor(private readonly maxEvents = 100, private readonly now: () => Date = () => new Date()) {}

  record(event: RedactedTelemetryEvent): void {
    this.events.push(event);
    if (this.events.length > this.maxEvents) this.events.shift();
  }

  healthSummary(): AiHealthSummary {
    const byOperation: Record<AiOperation, number> = { extract: 0, select_question: 0, explain: 0 };
    for (const event of this.events) byOperation[event.operation] += 1;
    return { totalRequests: this.events.length, liveRequests: this.events.filter((event) => event.outcome === "live").length, fallbackRequests: this.events.filter((event) => event.outcome === "fallback").length, byOperation, ...(this.events.length ? { lastRequestAt: this.now().toISOString() } : {}) };
  }
}
const extractSchema = {
  type: "object", additionalProperties: false, required: ["eventId", "facts"],
  properties: { eventId: { type: ["string", "null"], enum: [...LIVE_EVENT_IDS, null] }, facts: { type: "array", items: { type: "object", additionalProperties: false, required: ["factId", "value"], properties: { factId: { type: "string" }, value: {} } } } }
};
const selectQuestionSchema = { type: "object", additionalProperties: false, required: ["questionId"], properties: { questionId: { type: "string" } } };
const draftExplanationSchema = { type: "object", additionalProperties: false, required: ["message"], properties: { message: { type: "string", minLength: 1, maxLength: 1_200 } } };

function operationLimit(operation: AiOperation, window: "tenMinutes" | "hour"): number {
  if (operation === "extract") return AI_LIMITS.sessionExtract[window];
  if (operation === "select_question") return AI_LIMITS.sessionQuestion[window];
  return AI_LIMITS.sessionExplanation[window];
}

function isCorrectValueType(value: unknown, definition: FactDefinition): boolean {
  return typeof value === definition.valueType && (definition.valueType !== "number" || Number.isFinite(value));
}

function fallback<T>(data: T, reason: AiFallbackReason, retryAfterSeconds?: number): AiResult<T> {
  return { kind: "fallback", data, reason, ...(retryAfterSeconds ? { retryAfterSeconds } : {}) };
}

export class LifeNavigatorAi {
  constructor(private readonly transport: StructuredOutputTransport | undefined, private readonly guard: AiRateGuard, private readonly telemetry: AiTelemetry = NoopTelemetry) {}

  async extractEvent(input: { story: string; candidates: readonly EventCandidate[]; sessionId: string; clientIp?: string; seededDemo?: boolean }): Promise<AiResult<{ eventId: EventId | null; facts: Record<string, string | boolean | number> }>> {
    const started = Date.now();
    const empty = { eventId: null, facts: {} };
    if (input.seededDemo) return this.finish("extract", undefined, started, fallback(empty, "seeded_demo"));
    if (!this.transport || input.candidates.length === 0) return this.finish("extract", undefined, started, fallback(empty, "catalog_unavailable"));
    const guard = await this.guard.consume({ sessionId: input.sessionId, clientIp: input.clientIp, operation: "extract" });
    if (!guard.allowed) return this.finish("extract", undefined, started, fallback(empty, "rate_limited", guard.retryAfterSeconds));
    try {
      const output = ExtractOutputSchema.safeParse(await this.generateWithOneRepair({
        operation: "extract", maxOutputTokens: 300, schema: extractSchema,
        instructions: "Classify only among the supplied event IDs and extract only explicitly stated facts using supplied fact IDs. Never produce tasks, sources, rules, timings, eligibility, advice, or prose.",
        input: { story: input.story, events: input.candidates.map((candidate) => ({ eventId: candidate.id, facts: candidate.facts.map((fact) => ({ factId: fact.id, valueType: fact.valueType })) })) }
      }, ExtractOutputSchema));
      if (!output.success) return this.finish("extract", undefined, started, fallback(empty, "invalid_output"));
      if (output.data.eventId === null) return this.finish("extract", undefined, started, { kind: "live", data: empty });
      const candidate = input.candidates.find(({ id }) => id === output.data.eventId);
      if (!candidate) return this.finish("extract", undefined, started, fallback(empty, "invalid_output"));
      const definitions = new Map(candidate.facts.map((fact) => [fact.id, fact]));
      const facts: Record<string, string | boolean | number> = {};
      for (const item of output.data.facts) {
        const definition = definitions.get(item.factId);
        if (!definition) continue;
        if (!isCorrectValueType(item.value, definition)) return this.finish("extract", candidate.id, started, fallback(empty, "invalid_output"));
        facts[item.factId] = item.value;
      }
      return this.finish("extract", candidate.id, started, { kind: "live", data: { eventId: candidate.id, facts } });
    } catch {
      return this.finish("extract", undefined, started, fallback(empty, "unavailable"));
    }
  }

  async selectNextQuestion(input: { eventId: EventId; questions: readonly QuestionDefinition[]; context: UserContext; sessionId: string; clientIp?: string; seededDemo?: boolean }): Promise<AiResult<{ questionId: string | null }>> {
    const started = Date.now();
    const deterministic = { questionId: input.questions.find((question) => !(question.factId in input.context.facts))?.id ?? null };
    if (input.seededDemo) return this.finish("select_question", input.eventId, started, fallback(deterministic, "seeded_demo"));
    if (!this.transport) return this.finish("select_question", input.eventId, started, fallback(deterministic, "catalog_unavailable"));
    const guard = await this.guard.consume({ sessionId: input.sessionId, clientIp: input.clientIp, operation: "select_question" });
    if (!guard.allowed) return this.finish("select_question", input.eventId, started, fallback(deterministic, "rate_limited", guard.retryAfterSeconds));
    try {
      const output = SelectQuestionOutputSchema.safeParse(await this.generateWithOneRepair({
        operation: "select_question", maxOutputTokens: 100, schema: selectQuestionSchema,
        instructions: "Choose exactly one supplied, unanswered question ID. Do not produce questions, tasks, sources, rules, timings, eligibility, advice, or prose.",
        input: { eventId: input.eventId, answeredFactIds: Object.keys(input.context.facts), questions: input.questions.filter((question) => !(question.factId in input.context.facts)).map((question) => ({ questionId: question.id, factId: question.factId, rationaleKey: question.rationaleKey })) }
      }, SelectQuestionOutputSchema));
      const allowed = new Set(input.questions.filter((question) => !(question.factId in input.context.facts)).map((question) => question.id));
      if (!output.success || !allowed.has(output.data.questionId)) return this.finish("select_question", input.eventId, started, fallback(deterministic, "invalid_output"));
      return this.finish("select_question", input.eventId, started, { kind: "live", data: { questionId: output.data.questionId } });
    } catch {
      return this.finish("select_question", input.eventId, started, fallback(deterministic, "unavailable"));
    }
  }

  async draftExplanation(input: { eventId: EventId; taskId: string; candidates: readonly ExplanationCandidate[]; sessionId: string; clientIp?: string; seededDemo?: boolean }): Promise<AiResult<{ message: string | null }>> {
    const started = Date.now();
    const deterministic = { message: null };
    if (input.seededDemo) return this.finish("explain", input.eventId, started, fallback(deterministic, "seeded_demo"));
    if (!this.transport || input.candidates.length === 0) return this.finish("explain", input.eventId, started, fallback(deterministic, "catalog_unavailable"));
    const candidate = input.candidates.find((item) => item.taskId === input.taskId);
    if (!candidate) return this.finish("explain", input.eventId, started, fallback(deterministic, "invalid_output"));
    const guard = await this.guard.consume({ sessionId: input.sessionId, clientIp: input.clientIp, operation: "explain" });
    if (!guard.allowed) return this.finish("explain", input.eventId, started, fallback(deterministic, "rate_limited", guard.retryAfterSeconds));
    try {
      const output = DraftExplanationOutputSchema.safeParse(await this.generateWithOneRepair({
        operation: "explain", maxOutputTokens: 180, schema: draftExplanationSchema,
        instructions: "Draft a short supplemental explanation from supplied catalog message keys only. It is non-authoritative and must not define or alter a task, source, rule, timing, label, eligibility outcome, advice, or deadline.",
        input: { eventId: input.eventId, taskId: candidate.taskId, rationaleKey: candidate.rationaleKey, ...(candidate.changeMessageKey ? { changeMessageKey: candidate.changeMessageKey } : {}) }
      }, DraftExplanationOutputSchema));
      if (!output.success) return this.finish("explain", input.eventId, started, fallback(deterministic, "invalid_output"));
      return this.finish("explain", input.eventId, started, { kind: "live", data: output.data });
    } catch {
      return this.finish("explain", input.eventId, started, fallback(deterministic, "unavailable"));
    }
  }

  private finish<T>(operation: AiOperation, eventId: EventId | undefined, started: number, result: AiResult<T>): AiResult<T> {
    this.telemetry.record({ requestId: crypto.randomUUID(), operation, ...(eventId ? { eventId } : {}), outcome: result.kind, ...(result.kind === "fallback" ? { reason: result.reason } : {}), latencyMs: Date.now() - started, outputTokenCap: operation === "extract" ? 300 : operation === "select_question" ? 100 : 180 });
    return result;
  }

  private async generateWithOneRepair(request: StructuredOutputRequest, schema: z.ZodType<unknown>): Promise<unknown> {
    const first = await this.transport?.generate(request);
    if (schema.safeParse(first).success) return first;
    return this.transport?.generate({ ...request, repair: true, instructions: `${request.instructions} Return only an object that exactly matches the supplied JSON schema.` });
  }
}

export function createResponsesApiTransport(apiKey: string, model = "gpt-5.6", fetchImpl: typeof fetch = fetch): StructuredOutputTransport {
  return { async generate(request) {
    let lastError: Error | undefined;
    const deadline = Date.now() + 10_000;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const remaining = deadline - Date.now();
        if (remaining <= 0) throw new Error("OpenAI request timed out");
        const response = await fetchImpl("https://api.openai.com/v1/responses", {
          method: "POST", signal: AbortSignal.timeout(remaining), headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({ model, max_output_tokens: request.maxOutputTokens, input: [{ role: "developer", content: request.instructions }, { role: "user", content: JSON.stringify(request.input) }], text: { format: { type: "json_schema", name: `life_navigator_${request.operation}`, strict: true, schema: request.schema } } })
        });
        if (!response.ok) {
          const retryDelay = Math.floor(100 + Math.random() * 200);
          if (attempt === 0 && (response.status === 408 || response.status === 429 || response.status >= 500) && Date.now() + retryDelay < deadline) { await new Promise((resolve) => setTimeout(resolve, retryDelay)); continue; }
          throw new Error(`OpenAI response ${response.status}`);
        }
        const payload = await response.json() as { output_text?: unknown };
        if (typeof payload.output_text !== "string") throw new Error("OpenAI response lacks structured text");
        return JSON.parse(payload.output_text) as unknown;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error("OpenAI request failed");
        const retryDelay = Math.floor(100 + Math.random() * 200);
        if (attempt === 0 && Date.now() + retryDelay < deadline) { await new Promise((resolve) => setTimeout(resolve, retryDelay)); continue; }
      }
    }
    throw lastError ?? new Error("OpenAI request failed");
  } };
}

export function isOpaqueSessionId(value: string | null): value is string {
  return value !== null && /^[A-Za-z0-9_-]{24,128}$/.test(value);
}

export function parseEventId(value: unknown): EventId | undefined {
  return EventIdSchema.safeParse(value).data;
}
