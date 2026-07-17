import { z } from "zod";

export const ClassifierProviderSchema = z.enum(["ollama", "openai", "gemini"]);
export type ClassifierProvider = z.infer<typeof ClassifierProviderSchema>;

export const ClassificationFactSchema = z.object({ factId: z.string().min(1), value: z.union([z.string(), z.number().finite(), z.boolean()]) }).strict();
/** Provider output is re-validated against the runtime event/fact allowlist before it reaches application state. */
export const EventClassificationSchema = z.object({ eventId: z.string().min(1).nullable(), facts: z.array(ClassificationFactSchema).max(24) }).strict();
export type EventClassification = z.infer<typeof EventClassificationSchema>;

export type ClassificationCandidate = {
  id: string;
  label: string;
  recognitionHints: readonly string[];
  facts: readonly { id: string; valueType: "string" | "number" | "boolean" }[];
};

export type ClassifyEventInput = {
  text: string;
  candidates: readonly ClassificationCandidate[];
  requestId: string;
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

/** Server-only boundary. Adapters return only validated, non-authoritative event interpretation data. */
export interface LlmGateway {
  classifyEvent(input: ClassifyEventInput): Promise<ClassificationResult>;
}
