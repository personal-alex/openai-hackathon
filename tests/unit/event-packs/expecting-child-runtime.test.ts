import { describe, expect, it } from "vitest";
import { validateApprovedEventPack } from "@/event-packs/review";
import { activeEventPacks, activeSourceCards, getActiveEventPack } from "@/event-packs/registry";
import { compileRoadmap } from "@/roadmap-compiler";

const pack = getActiveEventPack("expecting_child")!;
const taskIds = (facts: Record<string, string>) => compileRoadmap(pack, { facts }).steps.map((task) => task.id);

describe("approved expecting-child runtime catalog", () => {
  it("registers only the validated active pack and five approved first-party source cards", () => {
    expect(validateApprovedEventPack(pack).success).toBe(true);
    expect(activeEventPacks).toHaveLength(1);
    expect(activeEventPacks.every((entry) => !entry.testOnly)).toBe(true);
    expect(activeSourceCards.map((source) => source.id)).toEqual([
      "ec_piba_birth_registry_procedure",
      "ec_piba_newborn_name",
      "ec_piba_birth_certificate",
      "ec_moh_birth_certificate_parents",
      "ec_piba_birth_abroad_registration"
    ]);
    expect(activeSourceCards.every((source) => source.disposition === "approved" && source.canonicalUrl.startsWith("https://"))).toBe(true);
  });

  it("keeps every task source reference in the active catalog and never embeds a URL in task copy", () => {
    const sourceIds = new Set(activeSourceCards.map((source) => source.id));
    for (const task of pack.tasks) {
      expect(task.sourceIds.every((sourceId) => sourceIds.has(sourceId))).toBe(true);
      expect(`${task.title} ${task.actionSummary}`).not.toMatch(/https?:\/\//);
    }
  });

  it("requires an explicit birth transition before post-birth content can appear", () => {
    expect(taskIds({})).toEqual(["ec_confirm_birth_status"]);
    expect(() => compileRoadmap(pack, { facts: { due_date: "2026-12-01" } })).toThrow("unknown fact ID: due_date");
    expect(taskIds({ event_stage: "not_yet" })).toEqual(["ec_confirm_birth_status"]);
  });

  it("compiles the approved routine path, conditional naming route, and optional certificate only for confirmed facts", () => {
    const routineFacts = { event_stage: "birth_occurred", birth_location: "israel", birth_setting: "hospital", family_path: "routine_birth", first_name_in_hospital_notice: "yes" };
    expect(taskIds(routineFacts)).toEqual(["ec_register_newborn_population_registry", "ec_obtain_birth_certificate_optional"]);
    expect(taskIds({ ...routineFacts, first_name_in_hospital_notice: "no" })).toEqual([
      "ec_register_newborn_population_registry",
      "ec_register_missing_newborn_first_name",
      "ec_obtain_birth_certificate_optional"
    ]);
    expect(taskIds(routineFacts)).not.toContain("ec_register_missing_newborn_first_name");
  });

  it("replaces, rather than augments, the routine path for outside-Israel, non-hospital, and special family situations", () => {
    expect(taskIds({ event_stage: "birth_occurred", birth_location: "outside_israel" })).toEqual(["ec_verify_birth_abroad_registration"]);
    expect(taskIds({ event_stage: "birth_occurred", birth_location: "israel", birth_setting: "home_or_other" })).toEqual(["ec_verify_non_hospital_birth_path"]);
    for (const family_path of ["adoption", "surrogacy", "parentage_needs_verification"]) {
      expect(taskIds({ event_stage: "birth_occurred", birth_location: "israel", birth_setting: "hospital", family_path })).toEqual(["ec_verify_special_family_path"]);
    }
  });

  it("keeps unknown facts and deferred special-case claims out of the routine content", () => {
    expect(taskIds({ event_stage: "birth_occurred", birth_location: "unknown" })).toEqual(["ec_verify_unconfirmed_route"]);
    expect(taskIds({ event_stage: "birth_occurred", birth_location: "israel", birth_setting: "unknown" })).toEqual(["ec_verify_unconfirmed_route"]);
    const activeText = JSON.stringify(pack);
    expect(activeText).not.toMatch(/late registration|correction consent|household|family-status|law-office|embassy|document checklist|benefit|payment/i);
  });
});
