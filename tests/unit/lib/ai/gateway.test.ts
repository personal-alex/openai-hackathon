import { describe, expect, it } from "vitest";
import { createLlmGateway, getLlmConfig, type LlmGateway } from "@/lib/ai";

describe("provider-neutral classification gateway contract", () => {
  it("defaults local classification to qwen3.5:9b through Ollama", () => {
    expect(getLlmConfig({}).provider).toBe("ollama");
    expect(getLlmConfig({}).model).toBe("qwen3.5:9b");
  });

  it("selects the configured adapter without exposing provider failures", async () => {
    const gateway: LlmGateway = { classifyEvent: async () => ({ kind: "classified", classification: { eventId: "job_loss", facts: [] } }) };
    const result = await createLlmGateway(getLlmConfig({ LLM_PROVIDER: "openai" }), { openai: () => gateway }).classifyEvent({ text: "I lost my job", requestId: "request", candidates: [] });
    expect(result).toEqual({ kind: "classified", classification: { eventId: "job_loss", facts: [] } });
  });

  it("returns a typed clarification when no configured adapter is available", async () => {
    await expect(createLlmGateway(getLlmConfig({ LLM_PROVIDER: "gemini" })).classifyEvent({ text: "test", requestId: "request", candidates: [] })).resolves.toEqual({ kind: "clarification", reason: "unavailable" });
  });
});
