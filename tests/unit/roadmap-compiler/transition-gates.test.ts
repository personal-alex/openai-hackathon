import { describe, expect, it } from "vitest";
import { EventPackSchema, validateEventPack } from "@/domain-contracts";
import { validateApprovedEventPack } from "@/event-packs/review";
import { compileRoadmap } from "@/roadmap-compiler";
import { expectingChildTransitionFixture } from "../../fixtures/expecting-child-transition";

const taskIds = (facts: Record<string, string | boolean | number>) =>
  compileRoadmap(expectingChildTransitionFixture, { facts }).steps.map((task) => task.id);

describe("confirmed-transition routine-hospital registration fixture", () => {
  it("accepts the explicitly marked non-production fixture as a valid pack", () => {
    expect(validateEventPack(expectingChildTransitionFixture).success).toBe(true);
  });

  it("selects the routine Israeli-hospital route only after an explicit confirmed transition", () => {
    expect(taskIds({ event_stage: "birth_occurred", birth_in_israeli_hospital: true, newborn_first_name_in_hospital_notice: true }))
      .toEqual(["future_planning_item", "routine_hospital_registration"]);
    expect(taskIds({ due_date: "2026-11-01", birth_in_israeli_hospital: true }))
      .toEqual(["future_planning_item"]);
  });

  it("selects the conditional name action only when the hospital notice is explicitly missing a first name", () => {
    expect(taskIds({ event_stage: "birth_occurred", birth_in_israeli_hospital: true, newborn_first_name_in_hospital_notice: false }))
      .toEqual(["future_planning_item", "routine_hospital_registration", "conditional_first_name_registration"]);
    expect(taskIds({ event_stage: "birth_occurred", birth_in_israeli_hospital: true, newborn_first_name_in_hospital_notice: true }))
      .not.toContain("conditional_first_name_registration");
  });

  it.each([
    ["non-hospital", { event_stage: "birth_occurred", birth_in_israeli_hospital: false }],
    ["unknown", { event_stage: "birth_occurred" }]
  ])("routes a %s birth location to verification required without the routine claim", (_description, facts) => {
    expect(taskIds(facts)).toEqual(["future_planning_item", "special_registration_verification"]);
  });

  it("keeps future planning distinct and excludes unsupported correction or household-status claims", () => {
    expect(taskIds({ due_date: "2026-11-01" })).toEqual(["future_planning_item"]);
    const fixtureText = JSON.stringify(expectingChildTransitionFixture);
    expect(fixtureText).not.toMatch(/correction|consent|household|family status|adoption|surrogacy/i);
  });

  it("rejects malformed or unsafe confirmed-transition applicability definitions", () => {
    expect(EventPackSchema.safeParse({
      ...expectingChildTransitionFixture,
      tasks: expectingChildTransitionFixture.tasks.map((task) => task.id === "routine_hospital_registration"
        ? { ...task, applicability: { kind: "confirmed_transition", requiredFacts: [] } }
        : task)
    }).success).toBe(false);

    const unknownFact = validateEventPack({
      ...expectingChildTransitionFixture,
      tasks: expectingChildTransitionFixture.tasks.map((task) => task.id === "routine_hospital_registration"
        ? { ...task, applicability: { kind: "confirmed_transition", requiredFacts: [{ factId: "unknown_fact", equals: "birth_occurred" }] } }
        : task)
    });
    expect(unknownFact).toMatchObject({ success: false, errors: ["unknown task transition fact ID: unknown_fact"] });

    const timingFact = validateEventPack({
      ...expectingChildTransitionFixture,
      tasks: expectingChildTransitionFixture.tasks.map((task) => task.id === "routine_hospital_registration"
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
