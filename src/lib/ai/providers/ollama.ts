import type { LlmConfig } from "../config";
import { EventClassificationSchema, type ClassificationCandidate, type ClassificationResult, type ClassifyEventInput, type LlmGateway } from "../contracts";

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

type OllamaGatewayOptions = {
  fetch?: FetchLike;
  isVercel?: boolean;
};

type ClarificationReason = Extract<ClassificationResult, { kind: "clarification" }>["reason"];

const loopbackHosts = new Set(["localhost", "127.0.0.1", "::1"]);

function isLocalOllamaUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (url.protocol === "http:" || url.protocol === "https:") && loopbackHosts.has(url.hostname);
  } catch {
    return false;
  }
}

function jsonSchemaFor(input: ClassifyEventInput): Record<string, unknown> {
  const eventIds = input.candidates.map((candidate) => candidate.id);
  const factIds = input.candidates.flatMap((candidate) => candidate.facts.map((fact) => fact.id));

  return {
    type: "object",
    additionalProperties: false,
    required: ["eventId", "facts"],
    properties: {
      eventId: {
        anyOf: [
          { type: "string", enum: eventIds },
          { type: "null" }
        ]
      },
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

function systemPrompt(input: ClassifyEventInput): string {
  const candidates = input.candidates.map((candidate) => ({
    id: candidate.id,
    label: candidate.label,
    recognitionHints: candidate.recognitionHints,
    facts: candidate.facts
  }));

  return [
    "/no_think",
    "You classify an explicitly stated life event into the supplied allowlist.",
    "Return JSON matching the provided schema only. Do not infer facts, eligibility, tasks, sources, timing, or advice.",
    "Use null for eventId when no supported event is clearly stated. Omit facts that are not explicitly stated.",
    `Allowed candidates: ${JSON.stringify(candidates)}`
  ].join("\n");
}

function failureReason(error: unknown): ClarificationReason {
  if (error instanceof DOMException && error.name === "AbortError") return "timeout";
  return "unavailable";
}

function validateClassification(payload: unknown, candidates: readonly ClassificationCandidate[]): ClassificationResult {
  const parsed = EventClassificationSchema.safeParse(payload);
  if (!parsed.success) return { kind: "clarification", reason: "invalid_output" };
  if (parsed.data.eventId === null) return { kind: "clarification", reason: "unsupported" };
  const candidate = candidates.find((item) => item.id === parsed.data.eventId);
  if (!candidate) return { kind: "clarification", reason: "unsupported" };
  for (const fact of parsed.data.facts) {
    const definition = candidate.facts.find((item) => item.id === fact.factId);
    if (!definition || typeof fact.value !== definition.valueType || (definition.valueType === "number" && !Number.isFinite(fact.value))) return { kind: "clarification", reason: "invalid_output" };
  }
  return { kind: "classified", classification: parsed.data };
}

/**
 * Native Ollama adapter. It is deliberately localhost-only: a browser or Vercel
 * deployment must not attempt to reach a developer workstation's model daemon.
 */
export class OllamaGateway implements LlmGateway {
  private readonly fetcher: FetchLike;
  private readonly available: boolean;

  constructor(private readonly config: LlmConfig, options: OllamaGatewayOptions = {}) {
    this.fetcher = options.fetch ?? fetch;
    this.available = !options.isVercel && !process.env.VERCEL && isLocalOllamaUrl(config.ollamaBaseUrl);
  }

  async classifyEvent(input: ClassifyEventInput): Promise<ClassificationResult> {
    if (!this.available) return { kind: "clarification", reason: "unavailable" };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try {
      const response = await this.fetcher(new URL("/api/chat", this.config.ollamaBaseUrl), {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.config.model,
          stream: false,
          think: false,
          format: jsonSchemaFor(input),
          options: { num_predict: this.config.maxOutputTokens },
          messages: [
            { role: "system", content: systemPrompt(input) },
            { role: "user", content: input.text }
          ]
        })
      });

      if (response.status === 429) return { kind: "clarification", reason: "rate_limited" };
      if (!response.ok) return { kind: "clarification", reason: response.status >= 500 ? "provider_error" : "invalid_output" };

      const payload = await response.json().catch(() => undefined) as { message?: { content?: unknown } } | undefined;
      if (typeof payload?.message?.content !== "string") return { kind: "clarification", reason: "invalid_output" };

      const parsedJson: unknown = (() => {
        try {
          return JSON.parse(payload.message.content);
        } catch {
          return undefined;
        }
      })();
      return validateClassification(parsedJson, input.candidates);
    } catch (error) {
      return { kind: "clarification", reason: failureReason(error) };
    } finally {
      clearTimeout(timeout);
    }
  }
}

export function createOllamaGateway(config: LlmConfig, options?: OllamaGatewayOptions): LlmGateway {
  return new OllamaGateway(config, options);
}
