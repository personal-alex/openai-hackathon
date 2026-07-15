import { describe, expect, it } from "vitest";
import { compileRoadmap, diffRoadmaps } from "@/roadmap-compiler";

const pack = {
  id: "job_loss" as const, version: "fixture-1", jurisdiction: "IL" as const, metadata: { title: "Fixture" },
  facts: [{ id: "event_date", valueType: "string" as const, labelKey: "fact.event_date", sensitive: false }, { id: "eligible", valueType: "boolean" as const, labelKey: "fact.eligible", sensitive: false }],
  questions: [], sourceCards: [{ id: "source_fixture", publisher: "Fixture", canonicalUrl: "https://example.invalid/source", reviewedOn: "2026-07-15", reviewer: "Fixture reviewer", disposition: "approved" as const, scope: "Fixture", supportedClaimSummary: "No policy claim." }],
  tasks: [
    { id: "base_task", title: "Base", actionSummary: "Fixture", priority: 2, timing: { kind: "event_relative" as const, anchor: "event_date" as const, window: "immediate" as const, labelKey: "timing.immediate" }, rationaleKey: "task.base", sourceIds: ["source_fixture"], verificationLabel: "Verify", dependsOn: [] },
    { id: "included_task", title: "Included", actionSummary: "Fixture", priority: 1, timing: { kind: "general" as const, labelKey: "timing.general" }, rationaleKey: "task.included", sourceIds: ["source_fixture"], verificationLabel: "Verify", dependsOn: [] }
  ], baseTaskIds: ["base_task"],
  rules: [{ id: "include_when_eligible", priority: 1, when: { fact: "eligible", equals: true }, effect: { includeTaskIds: ["included_task"], overrides: [{ taskId: "base_task", priority: 0 }] } }],
  safety: { disclaimerKey: "safety.disclaimer", externalLinkNoticeKey: "safety.external" }, demoScenarios: []
};

describe("deterministic roadmap compiler", () => {
  it("applies base, inclusion, override, and stable sorting deterministically", () => {
    const context = { facts: { event_date: "2026-07-15", eligible: true } };
    expect(compileRoadmap(pack, context)).toEqual(compileRoadmap(pack, context));
    expect(compileRoadmap(pack, context).steps.map((task) => task.id)).toEqual(["base_task", "included_task"]);
    expect(compileRoadmap(pack, context).steps[0].priority).toBe(0);
  });

  it("keeps unknown timing anchors general and unknown facts non-matching", () => {
    const roadmap = compileRoadmap(pack, { facts: {} });
    expect(roadmap.steps.map((task) => task.id)).toEqual(["base_task"]);
    expect(roadmap.steps[0].timing.kind).toBe("general");
  });

  it("evaluates empty groups and missing facts with approved semantics", () => {
    const expressionPack = { ...pack, rules: [
      { id: "empty_all", priority: 1, when: { all: [] }, effect: { includeTaskIds: ["included_task"] } },
      { id: "missing_is_false", priority: 2, when: { fact: "eligible", exists: false }, effect: { excludeTaskIds: ["base_task"] } },
      { id: "empty_any", priority: 3, when: { any: [] }, effect: { includeTaskIds: ["base_task"] } }
    ] };
    expect(compileRoadmap(expressionPack, { facts: {} }).steps.map((task) => task.id)).toEqual(["included_task"]);
  });

  it("produces deterministic added, changed, and removed diffs", () => {
    const before = compileRoadmap(pack, { facts: {} });
    const after = compileRoadmap(pack, { facts: { event_date: "2026-07-15", eligible: true } });
    expect(diffRoadmaps(before, after).changes.map((change) => change.kind)).toEqual(["changed", "added"]);
    expect(diffRoadmaps(after, before).changes.map((change) => change.kind)).toEqual(["changed", "removed"]);
  });
});
