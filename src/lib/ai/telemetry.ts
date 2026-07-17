import type { ClassifierProvider } from "./contracts";

/**
 * The complete, deliberately small metadata record permitted for classifier
 * telemetry. It has no fields for user input, prompts, model output, IP
 * addresses, session IDs, API keys, or event context.
 */
export type ClassificationTelemetryEvent = Readonly<{
  requestId: string;
  timestamp: string;
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
}>;

/** A server-side sink accepts approved metadata only; logging transport is injected by the host. */
export interface ClassificationTelemetrySink {
  record(event: ClassificationTelemetryEvent): void;
}

/** Useful for local development and tests. It intentionally does not write to console. */
export class InMemoryClassificationTelemetry implements ClassificationTelemetrySink {
  private readonly records: ClassificationTelemetryEvent[] = [];

  record(event: ClassificationTelemetryEvent): void {
    this.records.push(approvedMetadata(event));
  }

  entries(): readonly ClassificationTelemetryEvent[] {
    return this.records.map((event) => ({ ...event }));
  }
}

/** Strips unexpected runtime properties before a sink can retain or forward an event. */
function approvedMetadata(event: ClassificationTelemetryEvent): ClassificationTelemetryEvent {
  return {
    requestId: event.requestId,
    timestamp: event.timestamp,
    operation: event.operation,
    provider: event.provider,
    model: event.model,
    latencyMs: event.latencyMs,
    ...(event.inputTokens === undefined ? {} : { inputTokens: event.inputTokens }),
    ...(event.outputTokens === undefined ? {} : { outputTokens: event.outputTokens }),
    validationOutcome: event.validationOutcome,
    ...(event.fallbackReason === undefined ? {} : { fallbackReason: event.fallbackReason }),
    retryCount: event.retryCount,
    ...(event.estimatedCostUsd === undefined ? {} : { estimatedCostUsd: event.estimatedCostUsd }),
    ...(event.deploymentVersion === undefined ? {} : { deploymentVersion: event.deploymentVersion })
  };
}

export const NoopClassificationTelemetry: ClassificationTelemetrySink = {
  record: () => undefined
};
