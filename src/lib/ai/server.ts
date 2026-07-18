import "server-only";
import { activeEventPacks } from "@/event-packs/registry";
import { getLlmConfig, type LlmConfig } from "./config";
import type { ClassificationCandidate, ClassificationResult, ClassifyEventInput, LlmGateway } from "./contracts";
import { createOpenAiGateway } from "./providers/openai";
import { createOllamaGateway } from "./providers/ollama";
import { createGeminiGateway } from "./providers/gemini";
import { isTransientClassificationFailure } from "./fallback";
import { InMemoryClassificationControls, runWithClassificationControls } from "./rate-limit";
import { InMemoryClassificationTelemetry, type ClassificationTelemetrySink } from "./telemetry";

const telemetry = new InMemoryClassificationTelemetry();
const controlsByConfig = new Map<string, InMemoryClassificationControls>();

/** The only classification candidates offered to a provider come from validated active packs. */
export function getClassificationCandidates(): readonly ClassificationCandidate[] {
  return activeEventPacks.map((pack) => ({
    id: pack.id,
    label: pack.metadata.title,
    recognitionHints: pack.metadata.recognitionHints ?? [],
    facts: pack.facts.map((fact) => ({ id: fact.id, valueType: fact.valueType }))
  }));
}

/** Provider wiring is completed by provider adapter issues; no route imports a vendor adapter directly. */
export function getClassificationGateway(config = getLlmConfig(), telemetrySink: ClassificationTelemetrySink = telemetry): LlmGateway {
  const primary = providerGateway(config, config.provider);
  const fallback = config.provider === "openai" && config.fallbackProvider === "gemini" ? providerGateway(config, "gemini") : undefined;
  const controlKey = `${config.maxInputChars}:${config.sessionClassificationCap}:${config.sessionClassificationHourlyCap}:${config.sessionTotalCap}:${config.sessionTotalHourlyCap}:${config.ipClassificationCap}:${config.ipClassificationHourlyCap}:${config.ipTotalCap}:${config.ipTotalHourlyCap}`;
  const controls = controlsByConfig.get(controlKey) ?? new InMemoryClassificationControls({
    maxInputChars: config.maxInputChars,
    sessionClassificationCap: config.sessionClassificationCap,
    sessionClassificationHourlyCap: config.sessionClassificationHourlyCap,
    sessionTotalCap: config.sessionTotalCap,
    sessionTotalHourlyCap: config.sessionTotalHourlyCap,
    ipClassificationCap: config.ipClassificationCap,
    ipClassificationHourlyCap: config.ipClassificationHourlyCap,
    ipTotalCap: config.ipTotalCap,
    ipTotalHourlyCap: config.ipTotalHourlyCap
  });
  controlsByConfig.set(controlKey, controls);
  return {
    async classifyEvent(input: ClassifyEventInput): Promise<ClassificationResult> {
      const started = Date.now();
      const controlled = await runWithClassificationControls(controls, { identity: { sessionId: input.sessionId ?? input.requestId, ...(input.clientIp ? { ip: input.clientIp } : {}) }, inputLength: input.text.length }, () => primary.classifyEvent(input));
      let result = controlled.kind === "blocked" ? { kind: "clarification", reason: "rate_limited", ...(controlled.decision.retryAfterSeconds ? { retryAfterSeconds: controlled.decision.retryAfterSeconds } : {}) } as const : controlled.value;
      let provider = config.provider;
      const fallbackReason = result.kind === "clarification" ? result.reason : undefined;
      if (fallback && isTransientClassificationFailure(result)) {
        result = await fallback.classifyEvent(input);
        provider = "gemini";
      }
      telemetrySink.record({
        requestId: input.requestId,
        timestamp: new Date().toISOString(),
        operation: "classify_event",
        provider,
        model: provider === "gemini" ? config.geminiClassifierModel : config.model,
        latencyMs: Date.now() - started,
        validationOutcome: result.kind === "classified" ? "success" : result.reason === "invalid_output" ? "invalid" : "fallback",
        ...(fallbackReason ? { fallbackReason } : result.kind === "clarification" ? { fallbackReason: result.reason } : {}),
        retryCount: 0,
        ...(process.env.VERCEL_GIT_COMMIT_SHA ? { deploymentVersion: process.env.VERCEL_GIT_COMMIT_SHA } : {})
      });
      return result;
    }
  };
}

function providerGateway(config: LlmConfig, provider: LlmConfig["provider"]): LlmGateway {
  if (provider === "ollama") return createOllamaGateway(config, { isVercel: Boolean(process.env.VERCEL_ENV) });
  if (provider === "openai") return createOpenAiGateway(config, { apiKey: process.env.OPENAI_API_KEY });
  if (provider === "gemini") return createGeminiGateway(config, { apiKey: process.env.GEMINI_API_KEY });
  return { classifyEvent: async () => ({ kind: "clarification", reason: "unavailable" }) };
}
