import type { EventPack, UserContext } from "@/domain-contracts";

function fixturePack(id: "expecting_child" | "job_loss"): EventPack {
  const taskId = id === "expecting_child" ? "fixture_prepare" : "fixture_next_step";
  return {
    id, version: "seeded-v1", jurisdiction: "IL", metadata: { title: "Synthetic fixture" },
    facts: [], questions: [],
    sourceCards: [{ id: "fixture_source", publisher: "Fixture publisher", canonicalUrl: "https://example.invalid/fixture", reviewedOn: "2026-07-15", reviewer: "Fixture reviewer", disposition: "approved", scope: "Test-only", supportedClaimSummary: "No real claim." }],
    tasks: [{ id: taskId, title: id === "expecting_child" ? "Prepare for what is ahead" : "Map your next steps", actionSummary: "Synthetic seeded-demo task; verify current information before acting.", priority: 1, timing: { kind: "general", labelKey: "timing.general" }, rationaleKey: "seeded.task", sourceIds: ["fixture_source"], verificationLabel: "Verification required", dependsOn: [] }],
    baseTaskIds: [taskId], rules: [], safety: { disclaimerKey: "seeded.disclaimer", externalLinkNoticeKey: "seeded.external" }, demoScenarios: []
  };
}

export const seededScenarios: Array<{ id: "expecting_child" | "job_loss"; label: string; context: UserContext; pack: EventPack; explanation: string }> = [
  { id: "expecting_child", label: "Expecting a child", context: { facts: {} }, pack: fixturePack("expecting_child"), explanation: "This seeded roadmap is a deterministic fixture. It demonstrates the plan experience without policy content." },
  { id: "job_loss", label: "Job loss", context: { facts: {} }, pack: fixturePack("job_loss"), explanation: "This seeded roadmap is a deterministic fixture. It demonstrates a separate event through the same engine." }
];
