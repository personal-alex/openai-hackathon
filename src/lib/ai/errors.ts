export type ProviderErrorCode = "unavailable" | "rate_limited" | "timeout" | "server_error" | "invalid_output";

/** Normalized provider failure; raw SDK/fetch errors never cross the gateway boundary. */
export class LlmProviderError extends Error {
  constructor(readonly code: ProviderErrorCode, message: string, readonly retryAfterSeconds?: number) {
    super(message);
    this.name = "LlmProviderError";
  }
}

export function toClarificationReason(code: ProviderErrorCode): "unavailable" | "rate_limited" | "timeout" | "provider_error" | "invalid_output" {
  if (code === "server_error") return "provider_error";
  return code;
}
