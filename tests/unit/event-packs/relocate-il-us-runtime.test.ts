import { describe, expect, it } from "vitest";
import { validateEventPack } from "@/domain-contracts";
import { relocateIlUsPack } from "@/event-packs/relocate-il-us";
import { validateApprovedEventPack } from "@/event-packs/review";
import { compileRoadmap } from "@/roadmap-compiler";

const taskIds = (facts: Record<string, string>) => compileRoadmap(relocateIlUsPack, { facts }).steps.map((task) => task.id);

describe("reviewed hackathon IL→US relocation catalog", () => {
  it("validates as an approved hackathon pack with a verified, cross-border source ledger", () => {
    expect(validateEventPack(relocateIlUsPack).success).toBe(true);
    expect(validateApprovedEventPack(relocateIlUsPack).success).toBe(true);
    expect(relocateIlUsPack.jurisdiction).toBe("IL_US");
    expect(relocateIlUsPack.sourceCards.every((source) => source.disposition === "approved_for_hackathon" && source.reviewedOn === "2026-07-18" && source.supportedClaimSummary.length > 0)).toBe(true);
    expect(relocateIlUsPack.metadata.recognitionHints).toEqual(expect.arrayContaining(["relocating from Israel to the US", "moving to America for my job", "I got a job offer from a company in the USA"]));
  });

  it("selects the bounded employment, departure, residency, and tax reviews for a long-term move with an offer", () => {
    expect(taskIds({ relocation_purpose: "employment", us_job_offer_status: "has_offer", time_abroad_expected: "over_2_years" })).toEqual([
      "relocate_notify_nii_of_departure",
      "relocate_review_us_visa_category_options",
      "relocate_review_nii_residency_termination",
      "relocate_review_tax_residency_status"
    ]);
  });

  it("selects the family/marriage route only from stated relationship purpose", () => {
    expect(taskIds({ relocation_purpose: "family_or_marriage", marital_status_for_relocation: "married_to_us_person" })).toEqual([
      "relocate_review_family_or_marriage_based_path"
    ]);
  });

  it("adds a verification-only family-unit review when a spouse or child remains in Israel", () => {
    expect(taskIds({ relocation_purpose: "employment", family_unit_departure_status: "spouse_or_child_remaining_in_israel", time_abroad_expected: "over_2_years" })).toEqual([
      "relocate_notify_nii_of_departure",
      "relocate_review_us_visa_category_options",
      "relocate_flag_family_unit_review",
      "relocate_review_nii_residency_termination",
      "relocate_review_tax_residency_status"
    ]);
  });

  it("keeps a short trip bounded to entry-category review and preserves unknown answers as unknown", () => {
    expect(taskIds({ relocation_purpose: "other_or_unsure", time_abroad_expected: "under_3_months" })).toEqual([
      "relocate_review_us_visa_category_options",
      "relocate_review_tax_residency_status"
    ]);
    expect(taskIds({})).toEqual([]);
    expect(taskIds({ relocation_purpose: "employment" })).not.toContain("relocate_notify_nii_of_departure");
    expect(taskIds({ relocation_purpose: "employment" })).not.toContain("relocate_review_tax_residency_status");
  });

  it("uses an optional declared departure date only to express timing for already-selected reviews", () => {
    const roadmap = compileRoadmap(relocateIlUsPack, { facts: { time_abroad_expected: "over_2_years", departure_date: "2026-10-01" } });
    expect(roadmap.steps.find((task) => task.id === "relocate_notify_nii_of_departure")?.timing).toMatchObject({ kind: "planned", anchor: "departure_date", window: "before" });
    expect(roadmap.steps.find((task) => task.id === "relocate_review_nii_residency_termination")?.timing).toMatchObject({ kind: "planned", anchor: "departure_date", window: "after" });
    expect(taskIds({ departure_date: "2026-10-01" })).toEqual([]);
  });

  it("keeps ESTA, immigration, residency, and tax outcomes outside catalog claims", () => {
    const taskCopy = relocateIlUsPack.tasks.map((task) => `${task.title} ${task.actionSummary} ${task.verificationLabel}`).join(" ");
    expect(taskCopy).not.toMatch(/eligible for|will qualify|will receive|guaranteed|approval likelihood|tax obligation/i);
  });
});
