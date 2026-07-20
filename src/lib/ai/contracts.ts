import { z } from "zod";
import { FactValueSchema, type EventPack, type FactValue } from "@/domain-contracts";

export const ClassifierProviderSchema = z.enum(["ollama", "openai", "gemini"]);
export type ClassifierProvider = z.infer<typeof ClassifierProviderSchema>;

export const ClassificationFactSchema = z.object({ factId: z.string().min(1), value: FactValueSchema }).strict();
/** Provider output is re-validated against the runtime event/fact allowlist before it reaches application state. */
export const EventClassificationSchema = z.object({ eventId: z.string().min(1).nullable(), statedFacts: z.array(ClassificationFactSchema).max(24) }).strict();
export type EventClassification = z.infer<typeof EventClassificationSchema>;

export type ClassificationCandidate = {
  id: string;
  label: string;
  recognitionHints: readonly string[];
  /** Values come only from pack-authored answer options; an empty list keeps a typed free-form fact bounded by the prompt. */
  facts: readonly { id: string; valueType: "string" | "number" | "boolean"; allowedValues: readonly FactValue[] }[];
};

export type ClassifyEventInput = {
  text: string;
  candidates: readonly ClassificationCandidate[];
  requestId: string;
  /** Opaque browser-local value; never sent to a provider or telemetry sink. */
  sessionId?: string;
  /** Trusted deployment-derived IP only; never sent to a provider or telemetry sink. */
  clientIp?: string;
};

export type ClassificationTelemetry = {
  requestId: string;
  operation: "classify_event";
  provider: ClassifierProvider;
  model: string;
  latencyMs: number;
  inputTokens?: number;
  outputTokens?: number;
  validationOutcome: "success" | "invalid" | "fallback";
  fallbackReason?: "unavailable" | "rate_limited" | "timeout" | "provider_error" | "invalid_output" | "unsupported";
  retryCount: number;
  estimatedCostUsd?: number;
  deploymentVersion?: string;
};

export type ClassificationResult =
  | { kind: "classified"; classification: EventClassification }
  | { kind: "clarification"; reason: "unavailable" | "rate_limited" | "timeout" | "provider_error" | "invalid_output" | "unsupported"; retryAfterSeconds?: number };

function valueMatchesType(value: FactValue, type: "string" | "number" | "boolean"): boolean {
  return typeof value === type && (type !== "number" || Number.isFinite(value));
}

/** Derives the model allowlist from validated catalog facts and their approved answer options. */
export function classificationCandidateFromPack(pack: EventPack): ClassificationCandidate {
  return {
    id: pack.id,
    label: pack.metadata.title,
    recognitionHints: pack.metadata.recognitionHints ?? [],
    facts: pack.facts.map((fact) => ({
      id: fact.id,
      valueType: fact.valueType,
      allowedValues: pack.questions
        .filter((question) => question.factId === fact.id)
        .flatMap((question) => question.presentation.options ?? [])
        .flatMap((option) => option.value === undefined ? [] : [option.value])
    }))
  };
}

/**
 * Removes rather than forwards a model-proposed fact that is not declared by
 * the classified pack, has the wrong type, is not an approved option value, or
 * duplicates an earlier proposal. The classifier never becomes an authority.
 */
export function sanitizeStatedFacts(statedFacts: readonly z.infer<typeof ClassificationFactSchema>[], candidate: ClassificationCandidate) {
  const definitions = new Map(candidate.facts.map((fact) => [fact.id, fact]));
  const seen = new Set<string>();
  return statedFacts.flatMap((fact) => {
    const definition = definitions.get(fact.factId);
    if (!definition || seen.has(fact.factId) || !valueMatchesType(fact.value, definition.valueType)) return [];
    if (definition.allowedValues.length > 0 && !definition.allowedValues.some((value) => Object.is(value, fact.value))) return [];
    seen.add(fact.factId);
    return [fact];
  });
}

/** Validates provider output, then applies the event-scoped fact allowlist before returning it to application state. */
export function validateEventClassification(payload: unknown, candidates: readonly ClassificationCandidate[]): ClassificationResult {
  const parsed = EventClassificationSchema.safeParse(payload);
  if (!parsed.success) return { kind: "clarification", reason: "invalid_output" };
  if (parsed.data.eventId === null) return { kind: "clarification", reason: "unsupported" };
  const candidate = candidates.find((item) => item.id === parsed.data.eventId);
  if (!candidate) return { kind: "clarification", reason: "unsupported" };
  return { kind: "classified", classification: { eventId: candidate.id, statedFacts: sanitizeStatedFacts(parsed.data.statedFacts, candidate) } };
}

/** Server-only boundary. Adapters return only validated, non-authoritative event interpretation data. */
export interface LlmGateway {
  classifyEvent(input: ClassifyEventInput): Promise<ClassificationResult>;
}
