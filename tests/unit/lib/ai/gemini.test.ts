import { describe, expect, it, vi } from "vitest";
import { getLlmConfig } from "@/lib/ai";
import { createGeminiGateway } from "@/lib/ai/providers/gemini";

const input = { text: "I lost my job", requestId: "request", candidates: [{ id: "job_loss", label: "Job loss", recognitionHints: ["lost my job"], facts: [{ id: "employment_stage", valueType: "string" as const, allowedValues: ["ended"] }] }] };

describe("Gemini classification fallback adapter", () => {
  it("uses JSON output constraints and validates the allowlisted result", async () => {
    const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify({ eventId: "job_loss", statedFacts: [] }) }] } }] }), { status: 200 }));
    const result = await createGeminiGateway(getLlmConfig({ LLM_PROVIDER: "openai" }), { apiKey: "test", fetch }).classifyEvent(input);
    expect(result).toEqual({ kind: "classified", classification: { eventId: "job_loss", statedFacts: [] } });
    const request = JSON.parse(String(fetch.mock.calls[0]?.[1]?.body));
    expect(request.generationConfig.responseMimeType).toBe("application/json");
    expect(request.generationConfig.responseJsonSchema.properties.eventId).toEqual({ type: "string", enum: ["job_loss", "unsupported"] });
    expect(request.generationConfig.responseJsonSchema.properties.statedFacts).toMatchObject({ type: "array", maxItems: 24 });
    expect(request.generationConfig.responseJsonSchema.properties.statedFacts.items.properties).toMatchObject({ factId: { type: "string" }, value: { type: "string" } });
  });

  it("accepts a string-valued stated fact and leaves pack-scoped filtering to the shared validator", async () => {
    const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify({ eventId: "job_loss", statedFacts: [{ factId: "employment_stage", value: "ended" }] }) }] } }] }), { status: 200 }));
    await expect(createGeminiGateway(getLlmConfig({ LLM_PROVIDER: "gemini" }), { apiKey: "test", fetch }).classifyEvent(input)).resolves.toEqual({
      kind: "classified",
      classification: { eventId: "job_loss", statedFacts: [{ factId: "employment_stage", value: "ended" }] }
    });
  });

  it("maps Gemini's internal unsupported sentinel to the neutral clarification", async () => {
    const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify({ eventId: "unsupported", statedFacts: [] }) }] } }] }), { status: 200 }));
    await expect(createGeminiGateway(getLlmConfig({}), { apiKey: "test", fetch }).classifyEvent(input)).resolves.toEqual({ kind: "clarification", reason: "unsupported" });
  });

  it("does not turn malformed output into a second semantic guess", async () => {
    const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: "not-json" }] } }] }), { status: 200 }));
    await expect(createGeminiGateway(getLlmConfig({}), { apiKey: "test", fetch }).classifyEvent(input)).resolves.toEqual({ kind: "clarification", reason: "invalid_output" });
  });
});
