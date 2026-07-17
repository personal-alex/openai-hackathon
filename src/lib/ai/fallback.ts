import type { ClassificationResult, LlmGateway } from "./contracts";

export function isTransientClassificationFailure(result: ClassificationResult): boolean {
  return result.kind === "clarification" && ["unavailable", "rate_limited", "timeout", "provider_error"].includes(result.reason);
}

/** Uses the fallback only for infrastructure failures, never semantic/validation outcomes. */
export function withTransientFallback(primary: LlmGateway, fallback: LlmGateway | undefined): LlmGateway {
  return {
    async classifyEvent(input) {
      const result = await primary.classifyEvent(input);
      return fallback && isTransientClassificationFailure(result) ? fallback.classifyEvent(input) : result;
    }
  };
}
