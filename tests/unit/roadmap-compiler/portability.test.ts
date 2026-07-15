import { describe, expect, it } from "vitest";
import { validateApprovedEventPack } from "@/event-packs/review";
import { validateEventPack } from "@/domain-contracts";
import { compileRoadmap } from "@/roadmap-compiler";
import { ilContractFixture, incompleteJurisdictionTemplate } from "../../fixtures/portability";

describe("jurisdiction portability contract proof", () => {
  it("compiles the IL fixture through the shared contracts and compiler", () => {
    const validation = validateApprovedEventPack(ilContractFixture);
    expect(validation.success).toBe(true);
    if (validation.success) expect(compileRoadmap(validation.data, { facts: {} }).steps.map((task) => task.id)).toEqual(["fixture_task"]);
  });

  it("rejects an incomplete, non-production jurisdiction template safely", () => {
    const validation = validateEventPack(incompleteJurisdictionTemplate);
    expect(validation.success).toBe(false);
    if (!validation.success) expect(validation.errors.length).toBeGreaterThan(0);
  });
});
