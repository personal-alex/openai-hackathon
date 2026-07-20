import type { LlmConfig } from "../config";
import { type ClassificationCandidate, type ClassificationResult, type ClassifyEventInput, type LlmGateway, validateEventClassification } from "../contracts";

const MAX_CANDIDATES = 16;
const MAX_FACTS = 16;
const unsupportedEventId = "unsupported";

export type GeminiGatewayDependencies = { apiKey?: string; fetch?: typeof fetch; endpoint?: string };

function schema(candidates: readonly ClassificationCandidate[]): Record<string, unknown> {
  const eventIds = candidates.map((candidate) => candidate.id);
  return {
    type: "object",
    additionalProperties: false,
    required: ["eventId", "statedFacts"],
    properties: {
      eventId: { type: "string", enum: [...eventIds, unsupportedEventId] },
      statedFacts: {
        type: "array",
        maxItems: 24,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["factId", "value"],
          properties: {
            /** Gemini rejects the dynamic multi-pack enum/union combination; the shared runtime validator filters both fields after parsing. */
            factId: { type: "string" },
            value: { type: "string" }
          }
        }
      }
    }
  };
}

function prompt(input: ClassifyEventInput): string {
  return ["/no_think", "Classify only among the supplied event IDs. A recognition hint is a supported ordinary expression even when punctuation or a contraction differs.", `Extract only facts directly stated by the user. Never infer, assume, guess, or fill a default; omit absent facts from statedFacts. You may normalize direct wording to a supplied canonical option value. If no supported event is clearly stated, return eventId: \"${unsupportedEventId}\". Never provide tasks, sources, rules, timing, eligibility, advice, or prose.`, `Candidates: ${JSON.stringify(input.candidates.slice(0, MAX_CANDIDATES).map((candidate) => ({ id: candidate.id, label: candidate.label, recognitionHints: candidate.recognitionHints.slice(0, 4), facts: candidate.facts.slice(0, MAX_FACTS) })))}`, `User statement: ${input.text.slice(0, 2_000)}`].join("\n");
}

function validate(payload: unknown, candidates: readonly ClassificationCandidate[]): ClassificationResult {
  if (typeof payload === "object" && payload !== null && !Array.isArray(payload) && (payload as Record<string, unknown>).eventId === unsupportedEventId) return { kind: "clarification", reason: "unsupported" };
  return validateEventClassification(payload, candidates);
}

/** Gemini is a classification-only fallback and is invoked only by the server composition root. */
export function createGeminiGateway(config: LlmConfig, dependencies: GeminiGatewayDependencies): LlmGateway {
  const fetchImpl = dependencies.fetch ?? fetch;
  return {
    async classifyEvent(input: ClassifyEventInput): Promise<ClassificationResult> {
      if (!dependencies.apiKey || input.candidates.length === 0) return { kind: "clarification", reason: "unavailable" };
      const endpoint = dependencies.endpoint ?? `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(config.geminiClassifierModel)}:generateContent?key=${encodeURIComponent(dependencies.apiKey)}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), config.timeoutMs);
      try {
        const response = await fetchImpl(endpoint, { method: "POST", signal: controller.signal, headers: { "content-type": "application/json" }, body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt(input) }] }], generationConfig: { temperature: 0, maxOutputTokens: config.maxOutputTokens, responseMimeType: "application/json", responseJsonSchema: schema(input.candidates) } }) });
        if (!response.ok) return { kind: "clarification", reason: response.status === 429 ? "rate_limited" : response.status >= 500 ? "provider_error" : "unavailable" };
        const payload = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: unknown }> } }> };
        const text = payload.candidates?.[0]?.content?.parts?.find((part) => typeof part.text === "string")?.text;
        if (typeof text !== "string") return { kind: "clarification", reason: "invalid_output" };
        try { return validate(JSON.parse(text) as unknown, input.candidates); } catch { return { kind: "clarification", reason: "invalid_output" }; }
      } catch (error) {
        return { kind: "clarification", reason: controller.signal.aborted || (error instanceof DOMException && error.name === "AbortError") ? "timeout" : "provider_error" };
      } finally { clearTimeout(timeout); }
    }
  };
}
