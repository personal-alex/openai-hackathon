import { describe, expect, it, vi } from "vitest";
import { getLlmConfig } from "@/lib/ai";
import { createGeminiGateway } from "@/lib/ai/providers/gemini";

const input = { text: "I lost my job", requestId: "request", candidates: [{ id: "job_loss", label: "Job loss", recognitionHints: ["lost my job"], facts: [] }] };

describe("Gemini classification fallback adapter", () => {
  it("uses JSON output constraints and validates the allowlisted result", async () => {
    const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify({ eventId: "job_loss", facts: [] }) }] } }] }), { status: 200 }));
    const result = await createGeminiGateway(getLlmConfig({ LLM_PROVIDER: "openai" }), { apiKey: "test", fetch }).classifyEvent(input);
    expect(result).toEqual({ kind: "classified", classification: { eventId: "job_loss", facts: [] } });
    const request = JSON.parse(String(fetch.mock.calls[0]?.[1]?.body));
    expect(request.generationConfig.responseMimeType).toBe("application/json");
    expect(request.generationConfig.responseJsonSchema.properties.eventId).toEqual({ type: "string", enum: ["job_loss", "unsupported"] });
    expect(request.generationConfig.responseJsonSchema.properties.facts).toEqual({ type: "array", maxItems: 0 });
  });

  it("maps Gemini's internal unsupported sentinel to the neutral clarification", async () => {
    const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify({ eventId: "unsupported", facts: [] }) }] } }] }), { status: 200 }));
    await expect(createGeminiGateway(getLlmConfig({}), { apiKey: "test", fetch }).classifyEvent(input)).resolves.toEqual({ kind: "clarification", reason: "unsupported" });
  });

  it("does not turn malformed output into a second semantic guess", async () => {
    const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: "not-json" }] } }] }), { status: 200 }));
    await expect(createGeminiGateway(getLlmConfig({}), { apiKey: "test", fetch }).classifyEvent(input)).resolves.toEqual({ kind: "clarification", reason: "invalid_output" });
  });
});
