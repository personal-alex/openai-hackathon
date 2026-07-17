import { describe, expect, it } from "vitest";
import { PracticalGuidanceVerificationLabel, validateEventPack } from "@/domain-contracts";
import { jobLossPack } from "@/event-packs/job-loss";
import { getActiveEventPack } from "@/event-packs/registry";
import { validateApprovedEventPack } from "@/event-packs/review";
import { compileRoadmap, diffRoadmaps } from "@/roadmap-compiler";

const pack = getActiveEventPack("job_loss")!;
const taskIds = (facts: Record<string, string>) => compileRoadmap(pack, { facts }).steps.map((task) => task.id);

describe("approved Hackathon job-loss runtime catalog", () => {
  it("registers the complete approved-for-hackathon official route source cards", () => {
    expect(validateEventPack(jobLossPack).success).toBe(true);
    expect(validateApprovedEventPack(pack).success).toBe(true);
    expect(pack.sourceCards.map((source) => source.id)).toEqual([
      "jl_nii_employment_service_registration_reporting",
      "jl_nii_submit_unemployment_claim",
      "jl_nii_unemployment_conditions",
      "jl_nii_claim_documents_form100",
      "jl_gov_employment_service_registration",
      "jl_gov_unemployment_benefits_service",
      "jl_employment_service_home"
    ]);
    expect(pack.sourceCards.every((source) => source.disposition === "approved_for_hackathon" && source.canonicalUrl.startsWith("https://") && source.supportedClaimSummary.length > 0)).toBe(true);
  });

  it("rejects source-backed runtime content with a non-approved card or missing required source-card fields", () => {
    const needsReview = { ...jobLossPack, sourceCards: jobLossPack.sourceCards.map((source) => source.id === "jl_nii_submit_unemployment_claim" ? { ...source, disposition: "needs_review" as const } : source) };
    expect(validateApprovedEventPack(needsReview).success).toBe(false);
    const missingUrl = { ...jobLossPack, sourceCards: jobLossPack.sourceCards.map((source) => source.id === "jl_nii_submit_unemployment_claim" ? { ...source, canonicalUrl: "" } : source) };
    expect(validateEventPack(missingUrl).success).toBe(false);
    const missingClaim = { ...jobLossPack, sourceCards: jobLossPack.sourceCards.map((source) => source.id === "jl_nii_submit_unemployment_claim" ? { ...source, supportedClaimSummary: "" } : source) };
    expect(validateEventPack(missingClaim).success).toBe(false);
    const missingPublisher = { ...jobLossPack, sourceCards: jobLossPack.sourceCards.map((source) => source.id === "jl_nii_submit_unemployment_claim" ? { ...source, publisher: "" } : source) };
    expect(validateEventPack(missingPublisher).success).toBe(false);
    const missingReviewDate = { ...jobLossPack, sourceCards: jobLossPack.sourceCards.map((source) => source.id === "jl_nii_submit_unemployment_claim" ? { ...source, reviewedOn: "" } : source) };
    expect(validateEventPack(missingReviewDate).success).toBe(false);
    const missingScope = { ...jobLossPack, sourceCards: jobLossPack.sourceCards.map((source) => source.id === "jl_nii_submit_unemployment_claim" ? { ...source, scope: "" } : source) };
    expect(validateEventPack(missingScope).success).toBe(false);
  });

  it("permits source-free practical guidance only with the explicit safety label", () => {
    expect(pack.tasks.filter((task) => task.guidanceType === "practical_guidance").every((task) => task.sourceIds.length === 0 && task.verificationLabel === PracticalGuidanceVerificationLabel)).toBe(true);
    const invalidLabel = { ...jobLossPack, tasks: jobLossPack.tasks.map((task) => task.id === "jl_update_resume" ? { ...task, verificationLabel: "Verify" } : task) };
    expect(validateEventPack(invalidLabel).success).toBe(false);
  });

  it("selects the active salaried registration and claim-route reviews only after an explicit employment end", () => {
    expect(taskIds({ employment_stage: "ended", event_date: "2026-07-17", work_arrangement: "salaried", employment_service_registration: "not_registered" })).toEqual(expect.arrayContaining([
      "jl_register_employment_service",
      "jl_review_unemployment_claim_route",
      "jl_prepare_claim_route_information",
      "jl_update_resume"
    ]));
    expect(taskIds({ employment_stage: "notice_given" })).not.toContain("jl_register_employment_service");
    expect(taskIds({ employment_stage: "notice_given" })).not.toContain("jl_review_unemployment_claim_route");
  });

  it("replaces initial registration and de-emphasizes a submitted claim without inferring an outcome", () => {
    const registered = taskIds({ employment_stage: "ended", work_arrangement: "salaried", employment_service_registration: "registered" });
    expect(registered).toContain("jl_follow_employment_service_instructions");
    expect(registered).not.toContain("jl_register_employment_service");
    const submitted = taskIds({ employment_stage: "ended", work_arrangement: "salaried", unemployment_claim_status: "submitted" });
    expect(submitted).not.toContain("jl_review_unemployment_claim_route");
    expect(JSON.stringify(pack.tasks)).not.toMatch(/qualifies|benefit amount|payment prediction|eligible for/i);
  });

  it("keeps self-employed, mixed, and unknown arrangements out of the standard salaried route", () => {
    for (const work_arrangement of ["self_employed", "both"] as const) {
      const tasks = taskIds({ employment_stage: "ended", work_arrangement });
      expect(tasks).toContain("jl_verify_nonstandard_benefit_route");
      expect(tasks).not.toContain("jl_review_unemployment_claim_route");
    }
    const unknown = taskIds({ employment_stage: "ended" });
    expect(unknown).toContain("jl_verify_nonstandard_benefit_route");
    expect(unknown).not.toContain("jl_review_unemployment_claim_route");
  });

  it("changes records rationale and emits explainable diffs without surfacing excluded candidate cards", () => {
    const before = compileRoadmap(pack, { facts: { employment_stage: "ended", work_arrangement: "salaried" } });
    const after = compileRoadmap(pack, { facts: { employment_stage: "ended", work_arrangement: "salaried", employment_end_confirmation: "does_not_have" } });
    expect(after.steps.find((task) => task.id === "jl_prepare_claim_route_information")?.rationale).toBe("job_loss.rationale.missing_end_confirmation");
    expect(diffRoadmaps(before, after).changes).toEqual(expect.arrayContaining([expect.objectContaining({ taskId: "jl_prepare_claim_route_information", kind: "changed" })]));
    expect(JSON.stringify(pack)).toMatch(/jl_gov_employment_service_registration|jl_gov_unemployment_benefits_service|jl_employment_service_home/);
    expect(JSON.stringify(pack)).not.toMatch(/jl_kolzchut_|jl_gov_between_jobs|jl_gov_advance_notice|jl_gov_severance|jl_gov_disciplinary_hearing/);
  });
});
