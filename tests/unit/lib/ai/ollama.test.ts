import { describe, expect, it, vi } from "vitest";
import { getLlmConfig } from "@/lib/ai/config";
import { createOllamaGateway } from "@/lib/ai/providers/ollama";

const candidates = [{
  id: "expecting_child",
  label: "Expecting a child",
  recognitionHints: ["having a baby"],
  facts: [{ id: "event_stage", valueType: "string" as const, allowedValues: ["not_yet_born"] }]
}];

const input = { text: "We're having a baby.", requestId: "test-request", candidates };

describe("Ollama classification adapter", () => {
  it("uses native structured JSON with no-think mode", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      message: { content: JSON.stringify({ eventId: "expecting_child", statedFacts: [{ factId: "event_stage", value: "not_yet_born" }] }) }
    }), { status: 200, headers: { "content-type": "application/json" } }));
    const config = getLlmConfig({ OLLAMA_BASE_URL: "http://127.0.0.1:11434" });

    await expect(createOllamaGateway(config, { fetch: fetcher, isVercel: false }).classifyEvent(input)).resolves.toEqual({
      kind: "classified",
      classification: { eventId: "expecting_child", statedFacts: [{ factId: "event_stage", value: "not_yet_born" }] }
    });

    const [url, request] = fetcher.mock.calls[0] as [URL, RequestInit];
    expect(url.toString()).toBe("http://127.0.0.1:11434/api/chat");
    const body = JSON.parse(String(request.body));
    expect(body.model).toBe("qwen3.5:9b");
    expect(body.think).toBe(false);
    expect(body.options.temperature).toBe(0);
    expect(body.format.type).toBe("object");
    expect(body.messages[0].content).toContain("/no_think");
    expect(body.messages[0].content).toContain("having a baby");
    expect(body.messages[0].content).toContain("punctuation or a contraction differs");
    expect(body.messages[0].content).toContain("Extract only facts directly stated by the user");
  });

  it("returns typed unavailable without fetch for Vercel or non-local URLs", async () => {
    const fetcher = vi.fn();
    const remote = getLlmConfig({ OLLAMA_BASE_URL: "https://models.example.com" });
    await expect(createOllamaGateway(remote, { fetch: fetcher, isVercel: false }).classifyEvent(input)).resolves.toEqual({ kind: "clarification", reason: "unavailable" });
    await expect(createOllamaGateway(getLlmConfig({}), { fetch: fetcher, isVercel: true }).classifyEvent(input)).resolves.toEqual({ kind: "clarification", reason: "unavailable" });
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("maps a missing local daemon to a typed unavailable clarification", async () => {
    const fetcher = vi.fn().mockRejectedValue(new TypeError("fetch failed"));
    await expect(createOllamaGateway(getLlmConfig({}), { fetch: fetcher, isVercel: false }).classifyEvent(input)).resolves.toEqual({ kind: "clarification", reason: "unavailable" });
  });

  it("rejects malformed provider output", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: { content: "not json" } }), { status: 200 }));
    await expect(createOllamaGateway(getLlmConfig({}), { fetch: fetcher, isVercel: false }).classifyEvent(input)).resolves.toEqual({ kind: "clarification", reason: "invalid_output" });
  });
});
