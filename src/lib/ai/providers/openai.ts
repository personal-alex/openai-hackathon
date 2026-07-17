import { EventClassificationSchema, type ClassificationCandidate, type ClassificationResult, type ClassifyEventInput, type LlmGateway } from "../contracts";
import type { LlmConfig } from "../config";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const MAX_CANDIDATES = 16;
const MAX_FACTS_PER_CANDIDATE = 16;
const MAX_HINTS_PER_CANDIDATE = 4;
const MAX_METADATA_TEXT = 160;

export type OpenAiGatewayDependencies = {
  /** Injected only by the server composition root; this module never reads process.env. */
  apiKey?: string;
  fetch?: typeof fetch;
  endpoint?: string;
};

type OpenAiResponse = { output_text?: unknown; output?: unknown };

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

function outputText(payload: OpenAiResponse): string | undefined {
  if (typeof payload.output_text === "string") return payload.output_text;
  if (!Array.isArray(payload.output)) return undefined;
  for (const item of payload.output) {
    if (!item || typeof item !== "object" || !("content" in item) || !Array.isArray(item.content)) continue;
    for (const part of item.content) {
      if (part && typeof part === "object" && "text" in part && typeof part.text === "string") return part.text;
    }
  }
  return undefined;
}

function retryAfterSeconds(value: string | null): number | undefined {
  if (!value) return undefined;
  const seconds = Number(value);
  return Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds) : undefined;
}

function isTransient(status: number): boolean {
  return status === 408 || status === 429 || status >= 500;
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
  const fetchImpl = dependencies.fetch ?? fetch;
  const endpoint = dependencies.endpoint ?? OPENAI_RESPONSES_URL;

  return {
    async classifyEvent(input: ClassifyEventInput): Promise<ClassificationResult> {
      if (!dependencies.apiKey || input.candidates.length === 0) return { kind: "clarification", reason: "unavailable" };

      const candidates = boundedCandidates(input.candidates);
      const body = JSON.stringify({
        model: config.model,
        temperature: 0,
        max_output_tokens: config.maxOutputTokens,
        input: [
          { role: "developer", content: instructions(candidates) },
          { role: "user", content: input.text.slice(0, config.maxInputChars) }
        ],
        text: { format: { type: "json_schema", name: "life_navigator_event_classification", strict: true, schema: classificationSchema(candidates) } }
      });

      let lastReason: ClassificationResult | undefined;
      for (let attempt = 0; attempt <= config.maxRetries; attempt += 1) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), config.timeoutMs);
        try {
          const response = await fetchImpl(endpoint, {
            method: "POST",
            signal: controller.signal,
            headers: { "content-type": "application/json", authorization: `Bearer ${dependencies.apiKey}` },
            body
          });
          if (!response.ok) {
            lastReason = response.status === 429
              ? { kind: "clarification", reason: "rate_limited", retryAfterSeconds: retryAfterSeconds(response.headers.get("retry-after")) }
              : { kind: "clarification", reason: response.status >= 500 ? "provider_error" : "unavailable" };
            if (attempt < config.maxRetries && isTransient(response.status)) continue;
            return lastReason;
          }
          const parsed = await response.json() as OpenAiResponse;
          const text = outputText(parsed);
          if (!text) return { kind: "clarification", reason: "invalid_output" };
          try {
            return validateClassification(JSON.parse(text) as unknown, candidates);
          } catch {
            return { kind: "clarification", reason: "invalid_output" };
          }
        } catch (error) {
          const wasTimeout = controller.signal.aborted || (error instanceof DOMException && error.name === "AbortError");
          lastReason = { kind: "clarification", reason: wasTimeout ? "timeout" : "provider_error" };
          if (attempt < config.maxRetries) continue;
          return lastReason;
        } finally {
          clearTimeout(timeout);
        }
      }
      return lastReason ?? { kind: "clarification", reason: "unavailable" };
    }
  };
}
