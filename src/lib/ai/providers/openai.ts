import OpenAI from "openai";
import { EventClassificationSchema, type ClassificationCandidate, type ClassificationResult, type ClassifyEventInput, type LlmGateway } from "../contracts";
import type { LlmConfig } from "../config";

const MAX_CANDIDATES = 16;
const MAX_FACTS_PER_CANDIDATE = 16;
const MAX_HINTS_PER_CANDIDATE = 4;
const MAX_METADATA_TEXT = 160;

export type OpenAiGatewayDependencies = {
  /** Injected only by the server composition root; this module never reads process.env. */
  apiKey?: string;
  fetch?: typeof fetch;
  client?: Pick<OpenAI, "responses">;
};

function boundedText(value: string): string {
  return value.slice(0, MAX_METADATA_TEXT);
}

function boundedCandidates(candidates: readonly ClassificationCandidate[]) {
  return candidates.slice(0, MAX_CANDIDATES).map((candidate) => ({
    id: boundedText(candidate.id),
    label: boundedText(candidate.label),
    recognitionHints: candidate.recognitionHints.slice(0, MAX_HINTS_PER_CANDIDATE).map(boundedText),
    facts: candidate.facts.slice(0, MAX_FACTS_PER_CANDIDATE).map((fact) => ({ id: boundedText(fact.id), valueType: fact.valueType }))
  }));
}

function classificationSchema(candidates: readonly ClassificationCandidate[]): Record<string, unknown> {
  const eventIds = candidates.map((candidate) => candidate.id);
  const factIds = [...new Set(candidates.flatMap((candidate) => candidate.facts.map((fact) => fact.id)))];
  return {
    type: "object",
    additionalProperties: false,
    required: ["eventId", "facts"],
    properties: {
      eventId: { type: ["string", "null"], enum: [...eventIds, null] },
      facts: {
        type: "array",
        maxItems: 24,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["factId", "value"],
          properties: {
            factId: { type: "string", enum: factIds },
            value: { anyOf: [{ type: "string" }, { type: "number" }, { type: "boolean" }] }
          }
        }
      }
    }
  };
}

function instructions(candidates: ReturnType<typeof boundedCandidates>): string {
  return [
    "/no_think",
    "Classify the user's stated life event using only the supplied candidate event IDs and fact IDs.",
    "Extract only directly stated fact values. Unknown facts must be omitted.",
    "Do not provide advice, tasks, sources, rules, timing, or eligibility conclusions.",
    "Return null eventId when no supplied event is supported.",
    `Candidates: ${JSON.stringify(candidates)}`
  ].join("\n");
}

function isTransient(status: number | undefined): boolean {
  return status === 408 || status === 429 || (status !== undefined && status >= 500);
}

function retryAfterSeconds(headers: Headers | undefined): number | undefined {
  const value = headers?.get("retry-after");
  const seconds = Number(value);
  return Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds) : undefined;
}

function valueMatchesType(value: string | number | boolean, type: "string" | "number" | "boolean"): boolean {
  return typeof value === type && (type !== "number" || Number.isFinite(value));
}

function validateClassification(payload: unknown, candidates: readonly ClassificationCandidate[]): ClassificationResult {
  const parsed = EventClassificationSchema.safeParse(payload);
  if (!parsed.success) return { kind: "clarification", reason: "invalid_output" };
  if (parsed.data.eventId === null) return { kind: "clarification", reason: "unsupported" };
  const candidate = candidates.find((item) => item.id === parsed.data.eventId);
  if (!candidate) return { kind: "clarification", reason: "unsupported" };
  for (const fact of parsed.data.facts) {
    const definition = candidate.facts.find((item) => item.id === fact.factId);
    if (!definition || !valueMatchesType(fact.value, definition.valueType)) return { kind: "clarification", reason: "invalid_output" };
  }
  return { kind: "classified", classification: parsed.data };
}

/**
 * Server-side OpenAI Responses API adapter. It only returns allowlisted event
 * interpretations; the deterministic catalog/compiler remains authoritative.
 */
export function createOpenAiGateway(config: LlmConfig, dependencies: OpenAiGatewayDependencies): LlmGateway {
  const client = dependencies.client ?? (dependencies.apiKey ? new OpenAI({ apiKey: dependencies.apiKey, fetch: dependencies.fetch, maxRetries: 0, timeout: config.timeoutMs }) : undefined);

  return {
    async classifyEvent(input: ClassifyEventInput): Promise<ClassificationResult> {
      if (!client || input.candidates.length === 0) return { kind: "clarification", reason: "unavailable" };

      const candidates = boundedCandidates(input.candidates);
      const body = {
        model: config.model,
        temperature: 0,
        max_output_tokens: config.maxOutputTokens,
        input: `${instructions(candidates)}\nUser statement: ${input.text.slice(0, config.maxInputChars)}`,
        text: { format: { type: "json_schema" as const, name: "life_navigator_event_classification", strict: true, schema: classificationSchema(candidates) } }
      };

      let lastReason: ClassificationResult | undefined;
      for (let attempt = 0; attempt <= config.maxRetries; attempt += 1) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), config.timeoutMs);
        try {
          const response = await client.responses.create(body, { signal: controller.signal });
          const text = response.output_text;
          if (!text) return { kind: "clarification", reason: "invalid_output" };
          try {
            return validateClassification(JSON.parse(text) as unknown, candidates);
          } catch {
            return { kind: "clarification", reason: "invalid_output" };
          }
        } catch (error) {
          const apiError = error instanceof OpenAI.APIError ? error : undefined;
          const status = apiError?.status;
          const cause = error instanceof Error && "cause" in error ? error.cause : undefined;
          const wasTimeout = controller.signal.aborted || error instanceof OpenAI.APIConnectionTimeoutError || (error instanceof DOMException && error.name === "AbortError") || (cause instanceof DOMException && cause.name === "AbortError");
          lastReason = { kind: "clarification", reason: wasTimeout ? "timeout" : status === 429 ? "rate_limited" : status && status >= 500 ? "provider_error" : "provider_error", ...(status === 429 ? { retryAfterSeconds: retryAfterSeconds(apiError?.headers) } : {}) };
          if (attempt < config.maxRetries && (wasTimeout || isTransient(status))) continue;
          return lastReason;
        } finally {
          clearTimeout(timeout);
        }
      }
      return lastReason ?? { kind: "clarification", reason: "unavailable" };
    }
  };
}
