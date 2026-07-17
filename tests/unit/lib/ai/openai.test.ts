import { describe, expect, it, vi } from "vitest";
import { getLlmConfig, type ClassificationCandidate } from "@/lib/ai";
import { createOpenAiGateway } from "@/lib/ai/providers/openai";

const candidates: readonly ClassificationCandidate[] = [{
  id: "job_loss", label: "Job loss", recognitionHints: ["lost my job"],
  facts: [{ id: "event_stage", valueType: "string" }, { id: "has_notice", valueType: "boolean" }]
}];

const input = { text: "I lost my job and got notice", requestId: "request-123", candidates };
const config = getLlmConfig({ LLM_PROVIDER: "openai", LLM_TIMEOUT_MS: "20" });

function response(payload: unknown, status = 200, headers?: Record<string, string>): Response {
  return new Response(JSON.stringify(payload), { status, headers: { "content-type": "application/json", ...headers } });
}

describe("OpenAI classification adapter", () => {
  it("uses strict structured output and returns an allowlisted classification", async () => {
    const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(response({ output_text: JSON.stringify({ eventId: "job_loss", facts: [{ factId: "has_notice", value: true }] }) }));
    const result = await createOpenAiGateway(config, { apiKey: "test-key", fetch }).classifyEvent(input);
    expect(result).toEqual({ kind: "classified", classification: { eventId: "job_loss", facts: [{ factId: "has_notice", value: true }] } });
    const request = JSON.parse(String(fetch.mock.calls[0]?.[1]?.body)) as Record<string, unknown>;
    expect(request.temperature).toBe(0);
    expect(request.text).toMatchObject({ format: { type: "json_schema", strict: true } });
    expect(JSON.stringify(request.input)).toContain("/no_think");
    expect(fetch.mock.calls[0]?.[1]?.headers).toMatchObject({ authorization: "Bearer test-key" });
  });

  it("rejects schema-invalid output without leaking the provider response", async () => {
    const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(response({ output_text: JSON.stringify({ eventId: "job_loss", extra: true }) }));
    await expect(createOpenAiGateway(config, { apiKey: "test-key", fetch }).classifyEvent(input)).resolves.toEqual({ kind: "clarification", reason: "invalid_output" });
  });

  it("retries a timeout once before returning a neutral timeout clarification", async () => {
    const fetch = vi.fn<typeof globalThis.fetch>().mockRejectedValue(new DOMException("aborted", "AbortError"));
    await expect(createOpenAiGateway(config, { apiKey: "test-key", fetch }).classifyEvent(input)).resolves.toEqual({ kind: "clarification", reason: "timeout" });
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("retries a 429 once and retains its retry hint", async () => {
    const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(response({ error: "slow down" }, 429, { "retry-after": "12" }));
    await expect(createOpenAiGateway(config, { apiKey: "test-key", fetch }).classifyEvent(input)).resolves.toEqual({ kind: "clarification", reason: "rate_limited", retryAfterSeconds: 12 });
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("retries 5xx once before returning a neutral provider clarification", async () => {
    const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(response({ error: "unavailable" }, 503));
    await expect(createOpenAiGateway(config, { apiKey: "test-key", fetch }).classifyEvent(input)).resolves.toEqual({ kind: "clarification", reason: "provider_error" });
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("uses a neutral clarification for unsupported events and invalid candidate facts", async () => {
    const fetch = vi.fn<typeof globalThis.fetch>()
      .mockResolvedValueOnce(response({ output_text: JSON.stringify({ eventId: null, facts: [] }) }))
      .mockResolvedValueOnce(response({ output_text: JSON.stringify({ eventId: "job_loss", facts: [{ factId: "unknown", value: true }] }) }));
    const gateway = createOpenAiGateway(config, { apiKey: "test-key", fetch });
    await expect(gateway.classifyEvent(input)).resolves.toEqual({ kind: "clarification", reason: "unsupported" });
    await expect(gateway.classifyEvent(input)).resolves.toEqual({ kind: "clarification", reason: "invalid_output" });
  });
});
