import { describe, expect, it } from "vitest";
import { EventPackSchema, validateEventPack } from "@/domain-contracts";
import { validateApprovedEventPack } from "@/event-packs/review";
import { compileRoadmap } from "@/roadmap-compiler";
import { expectingChildTransitionFixture } from "../../fixtures/expecting-child-transition";

describe("confirmed-transition task applicability", () => {
  it("accepts the explicitly marked non-production fixture as a valid pack", () => {
    expect(validateEventPack(expectingChildTransitionFixture).success).toBe(true);
  });

  it.each([
    ["a known date without a confirmed transition", { facts: { due_date: "2026-11-01" } }, ["future_planning_item"]],
    ["an explicitly non-confirmed transition value", { facts: { due_date: "2026-11-01", event_stage: "planned" } }, ["future_planning_item"]],
    ["a confirmed transition without timing data", { facts: { event_stage: "birth_occurred" } }, ["future_planning_item", "post_transition_operational_item"]]
  ])("selects only applicable tasks for %s", (_description, context, expectedTaskIds) => {
    const roadmap = compileRoadmap(expectingChildTransitionFixture, context);
    expect(roadmap.steps.map((task) => task.id)).toEqual(expectedTaskIds);
  });

  it("keeps explicitly authored planning work distinguishable from actionable post-transition work", () => {
    const [planningTask] = compileRoadmap(expectingChildTransitionFixture, { facts: { due_date: "2026-11-01" } }).steps;
    expect(planningTask).toMatchObject({
      id: "future_planning_item",
      verificationLabel: "Planning only — future work"
    });
  });

  it("rejects malformed or unsafe confirmed-transition applicability definitions", () => {
    expect(EventPackSchema.safeParse({
      ...expectingChildTransitionFixture,
      tasks: expectingChildTransitionFixture.tasks.map((task) => task.id === "post_transition_operational_item"
        ? { ...task, applicability: { kind: "confirmed_transition", requiredFacts: [] } }
        : task)
    }).success).toBe(false);

    const unknownFact = validateEventPack({
      ...expectingChildTransitionFixture,
      tasks: expectingChildTransitionFixture.tasks.map((task) => task.id === "post_transition_operational_item"
        ? { ...task, applicability: { kind: "confirmed_transition", requiredFacts: [{ factId: "unknown_fact", equals: "birth_occurred" }] } }
        : task)
    });
    expect(unknownFact).toMatchObject({ success: false, errors: ["unknown task transition fact ID: unknown_fact"] });

    const timingFact = validateEventPack({
      ...expectingChildTransitionFixture,
      tasks: expectingChildTransitionFixture.tasks.map((task) => task.id === "post_transition_operational_item"
        ? { ...task, applicability: { kind: "confirmed_transition", requiredFacts: [{ factId: "due_date", equals: "2026-11-01" }] } }
        : task)
    });
    expect(timingFact).toMatchObject({ success: false, errors: ["task transition fact ID is not confirmed_transition: due_date"] });
  });

  it("rejects the test-only fixture at the approved runtime gate", () => {
    const result = validateApprovedEventPack(expectingChildTransitionFixture);
    expect(result).toMatchObject({ success: false, errors: ["test-only event packs cannot be approved runtime content"] });
  });
});
