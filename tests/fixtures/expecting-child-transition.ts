import type { EventPack } from "@/domain-contracts";

/**
 * Non-production contract fixture only. It has no source or policy claim and
 * must never be registered or used as approved runtime content.
 */
export const expectingChildTransitionFixture = {
  id: "expecting_child",
  version: "test-only-transition-gate-v1",
  jurisdiction: "IL",
  metadata: { title: "Test-only transition gate fixture" },
  facts: [
    { id: "due_date", valueType: "string", labelKey: "fixture.due_date", sensitive: false, factRole: "context" },
    { id: "event_stage", valueType: "string", labelKey: "fixture.event_stage", sensitive: false, factRole: "confirmed_transition" }
  ],
  questions: [],
  sourceCards: [{
    id: "test_only_source",
    publisher: "Test fixture",
    canonicalUrl: "https://example.invalid/test-only-transition-fixture",
    reviewedOn: "2026-07-17",
    reviewer: "Test fixture",
    disposition: "approved",
    scope: "Non-production contract fixture only; no source claim.",
    supportedClaimSummary: "No real-world claim."
  }],
  tasks: [
    {
      id: "future_planning_item",
      title: "Future planning item",
      actionSummary: "Synthetic planning-only fixture task; it is not currently actionable.",
      priority: 1,
      timing: { kind: "planned", anchor: "due_date", window: "before", labelKey: "fixture.before_date" },
      rationaleKey: "fixture.future_planning",
      sourceIds: ["test_only_source"],
      verificationLabel: "Planning only — future work",
      dependsOn: [],
      applicability: { kind: "always" }
    },
    {
      id: "post_transition_operational_item",
      title: "Post-transition operational item",
      actionSummary: "Synthetic operational fixture task that requires a confirmed transition.",
      priority: 2,
      timing: { kind: "planned", anchor: "due_date", window: "after", labelKey: "fixture.after_date" },
      rationaleKey: "fixture.post_transition",
      sourceIds: ["test_only_source"],
      verificationLabel: "Currently actionable after confirmed transition",
      dependsOn: [],
      applicability: {
        kind: "confirmed_transition",
        requiredFacts: [{ factId: "event_stage", equals: "birth_occurred" }]
      }
    }
  ],
  baseTaskIds: ["future_planning_item", "post_transition_operational_item"],
  rules: [],
  safety: { disclaimerKey: "fixture.disclaimer", externalLinkNoticeKey: "fixture.external" },
  demoScenarios: [],
  testOnly: true
} satisfies EventPack;
