/** Non-production contract fixture: no real source, advice, or policy claim. */
export const ilContractFixture = {
  id: "expecting_child" as const,
  version: "portability-fixture-1",
  jurisdiction: "IL" as const,
  metadata: { title: "Contract fixture only" },
  facts: [{ id: "anchor_known", valueType: "boolean" as const, labelKey: "fixture.anchor", sensitive: false }],
  questions: [],
  sourceCards: [{ id: "fixture_source", title: "Fixture source", publisher: "Fixture publisher", canonicalUrl: "https://example.invalid/fixture", jurisdiction: "IL", reviewedOn: "2026-07-15", reviewer: "Fixture reviewer", disposition: "approved" as const, scope: "Schema proof only", supportedClaimSummary: "No real claim.", limitations: "Synthetic fixture only.", verificationWording: "Verify with an official source.", safetyClassification: "verification_required" as const }],
  tasks: [{ id: "fixture_task", title: "Fixture task", actionSummary: "Contract-only fixture.", priority: 1, timing: { kind: "general" as const, labelKey: "fixture.general" }, rationaleKey: "fixture.rationale", sourceIds: ["fixture_source"], verificationLabel: "Verify", dependsOn: [] }],
  baseTaskIds: ["fixture_task"], rules: [],
  safety: { disclaimerKey: "fixture.disclaimer", externalLinkNoticeKey: "fixture.external" }, demoScenarios: []
};

/** Intentionally incomplete and never user-selectable; it proves safe rejection. */
export const incompleteJurisdictionTemplate = {
  id: "expecting_child",
  version: "template-only",
  jurisdiction: "IL",
  metadata: { title: "Incomplete jurisdiction template" },
  facts: [], questions: [], sourceCards: [], tasks: [], baseTaskIds: [], rules: []
};
