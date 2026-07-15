import { describe, expect, it } from "vitest";
import { InMemoryAiRateGuard, LifeNavigatorAi, type FactDefinition, type QuestionDefinition, type StructuredOutputRequest } from "@/ai-orchestrator";

const facts: FactDefinition[] = [{ id: "has_date", valueType: "boolean", labelKey: "fixture.has_date" }];
const questions: QuestionDefinition[] = [{ id: "ask_date", factId: "has_date", promptKey: "fixture.ask", rationaleKey: "fixture.why", answerType: "boolean", allowSkip: true }];
const sessionId = "a".repeat(24);

function service(output: unknown, seen?: StructuredOutputRequest[]) {
  return new LifeNavigatorAi({ generate: async (request) => { seen?.push(request); return output; } }, new InMemoryAiRateGuard());
}

describe("LifeNavigatorAi", () => {
  it("accepts only allowlisted event/facts and omits unknown facts", async () => {
    const seen: StructuredOutputRequest[] = [];
    const result = await service({ eventId: "expecting_child", facts: [{ factId: "has_date", value: true }, { factId: "unknown", value: "ignored" }] }, seen).extractEvent({ story: "A stated fixture", sessionId, candidates: [{ id: "expecting_child", facts }] });
    expect(result).toEqual({ kind: "live", data: { eventId: "expecting_child", facts: { has_date: true } } });
    expect(seen[0]?.input).toEqual({ story: "A stated fixture", events: [{ eventId: "expecting_child", facts: [{ factId: "has_date", valueType: "boolean" }] }] });
    expect(seen[0]?.maxOutputTokens).toBe(300);
  });

  it("rejects invalid fact values and never lets output define roadmap content", async () => {
    const result = await service({ eventId: "expecting_child", facts: [{ factId: "has_date", value: "true" }], taskId: "injected" }).extractEvent({ story: "Fixture", sessionId, candidates: [{ id: "expecting_child", facts }] });
    expect(result).toMatchObject({ kind: "fallback", reason: "invalid_output", data: { eventId: null, facts: {} } });
  });

  it("selects only an unanswered allowlisted question and safely falls back", async () => {
    const result = await service({ questionId: "unknown_question" }).selectNextQuestion({ eventId: "job_loss", questions, context: { facts: {} }, sessionId });
    expect(result).toEqual({ kind: "fallback", reason: "invalid_output", data: { questionId: "ask_date" } });
  });

  it("never calls the model in seeded mode", async () => {
    let calls = 0;
    const ai = new LifeNavigatorAi({ generate: async () => { calls += 1; return {}; } }, new InMemoryAiRateGuard());
    const result = await ai.selectNextQuestion({ eventId: "job_loss", questions, context: { facts: {} }, sessionId, seededDemo: true });
    expect(result).toMatchObject({ kind: "fallback", reason: "seeded_demo" });
    expect(calls).toBe(0);
  });

  it("emits redacted telemetry without the raw story, prompt, or model output", async () => {
    const events: unknown[] = [];
    const ai = new LifeNavigatorAi({ generate: async () => ({ eventId: null, facts: [] }) }, new InMemoryAiRateGuard(), { record: (event) => events.push(event) });
    await ai.extractEvent({ story: "A private fixture story", sessionId, candidates: [{ id: "expecting_child", facts }] });
    expect(events).toHaveLength(1);
    expect(JSON.stringify(events[0])).not.toContain("private fixture story");
    expect(events[0]).toMatchObject({ operation: "extract", outcome: "live" });
  });

  it("enforces the session extraction cap before calling a live transport", async () => {
    let now = 0;
    let calls = 0;
    const ai = new LifeNavigatorAi({ generate: async () => { calls += 1; return { eventId: null, facts: [] }; } }, new InMemoryAiRateGuard(() => now));
    for (let index = 0; index < 3; index += 1) await ai.extractEvent({ story: "Fixture", sessionId, candidates: [{ id: "expecting_child", facts }] });
    const limited = await ai.extractEvent({ story: "Fixture", sessionId, candidates: [{ id: "expecting_child", facts }] });
    expect(limited).toMatchObject({ kind: "fallback", reason: "rate_limited" });
    expect(calls).toBe(3);
    now += 600_001;
  });
});
