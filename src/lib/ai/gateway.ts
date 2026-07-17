import type { ClassificationResult, ClassifierProvider, LlmGateway } from "./contracts";
import { getLlmConfig, type LlmConfig } from "./config";

export type GatewayFactories = Partial<Record<ClassifierProvider, (config: LlmConfig) => LlmGateway>>;

class UnavailableGateway implements LlmGateway {
  async classifyEvent(): Promise<ClassificationResult> {
    return { kind: "clarification", reason: "unavailable" };
  }
}

/** Selects the configured provider without leaking adapter or vendor types to routes or UI. */
export function createLlmGateway(config: LlmConfig = getLlmConfig(), factories: GatewayFactories = {}): LlmGateway {
  return factories[config.provider]?.(config) ?? new UnavailableGateway();
}
