import { describe, expect, it } from "vitest";
import {
  CompiledRoadmapSchema,
  EventIdSchema,
  EventPackSchema,
  TaskDiffSchema,
  UserContextSchema,
  validateContextForPack,
  validateEventPack
} from "@/domain-contracts";
import { validateApprovedEventPack } from "@/event-packs/review";

const validPack = {
  id: "expecting_child",
  version: "test-1",
  jurisdiction: "IL",
  metadata: { title: "Contract fixture" },
  facts: [{ id: "has_anchor", valueType: "boolean", labelKey: "fact.has_anchor", sensitive: false }],
  questions: [{ id: "ask_anchor", factId: "has_anchor", promptKey: "question.anchor", rationaleKey: "why.anchor", answerType: "boolean", allowSkip: true }],
  sourceCards: [{ id: "fixture_source", publisher: "Fixture publisher", canonicalUrl: "https://example.invalid/source", reviewedOn: "2026-07-15", reviewer: "Fixture reviewer", disposition: "approved", scope: "Schema fixture only", supportedClaimSummary: "No policy claim." }],
  tasks: [{ id: "fixture_task", title: "Fixture task", actionSummary: "Validate contracts.", priority: 1, timing: { kind: "general", labelKey: "timing.general" }, rationaleKey: "task.fixture", sourceIds: ["fixture_source"], verificationLabel: "Verify", dependsOn: [] }],
  baseTaskIds: ["fixture_task"],
  rules: [],
  safety: { disclaimerKey: "safety.disclaimer", externalLinkNoticeKey: "safety.external" },
  demoScenarios: []
};

describe("domain contracts", () => {
  it("accepts exactly the canonical event IDs", () => {
    expect(EventIdSchema.options).toEqual(["expecting_child", "job_loss", "move_home"]);
    expect(EventIdSchema.safeParse("marriage").success).toBe(false);
  });

  it("validates an event pack with task, source, and safety anatomy", () => {
    expect(EventPackSchema.safeParse(validPack).success).toBe(true);
    expect(validateEventPack(validPack)).toEqual({ success: true, data: validPack });
  });

  it("rejects malformed pack metadata and invalid cross references", () => {
    expect(EventPackSchema.safeParse({ ...validPack, safety: { disclaimerKey: "safety.disclaimer" } }).success).toBe(false);
    expect(EventPackSchema.safeParse({ ...validPack, sourceCards: [{ ...validPack.sourceCards[0], reviewer: "" }] }).success).toBe(false);
    const result = validateEventPack({ ...validPack, baseTaskIds: ["missing_task"] });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.errors).toContain("unknown base task ID: missing_task");
  });

  it("blocks non-approved source cards from product packs", () => {
    const result = validateApprovedEventPack({
      ...validPack,
      sourceCards: [{ ...validPack.sourceCards[0], disposition: "needs_review" }]
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.errors[0]).toContain("approved disposition");
  });

  it("rejects unknown or invalid context facts while preserving unknown facts as absent", () => {
    expect(UserContextSchema.safeParse({ facts: {} }).success).toBe(true);
    expect(validateContextForPack(validPack, { facts: { has_anchor: true } }).success).toBe(true);
    expect(validateContextForPack(validPack, { facts: { has_anchor: "yes" } }).success).toBe(false);
    expect(validateContextForPack(validPack, { facts: { unknown_fact: true } }).success).toBe(false);
  });

  it("rejects invalid immutable roadmaps and task diffs", () => {
    expect(CompiledRoadmapSchema.safeParse({ schemaVersion: 1, eventId: "expecting_child", jurisdiction: "IL", packVersion: "test-1", contextCompleteness: 1, steps: [] }).success).toBe(true);
    expect(CompiledRoadmapSchema.safeParse({ schemaVersion: 2 }).success).toBe(false);
    expect(TaskDiffSchema.safeParse({ toRoadmapVersion: "test-2", changes: [{ taskId: "fixture_task", kind: "added", reason: { type: "rule_match", messageKey: "diff.added" } }] }).success).toBe(true);
    expect(TaskDiffSchema.safeParse({ toRoadmapVersion: "test-2", changes: [{ taskId: "fixture_task", kind: "added" }] }).success).toBe(false);
  });
});
