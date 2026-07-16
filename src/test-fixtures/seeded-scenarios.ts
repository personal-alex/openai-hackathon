import type { EventId, EventPack, FactValueSchema, UserContext } from "@/domain-contracts";

export type SeededValue = typeof FactValueSchema._output;

export type SeededQuestion = {
  id: string;
  factId: string;
  prompt: string;
  why: string;
  options: Array<{ label: string; value?: SeededValue }>;
};

export type SeededScenario = {
  id: "expecting_child" | "job_loss";
  label: string;
  examplePrompt: string;
  confirmationCopy: string;
  explanation: string;
  questions: SeededQuestion[];
  context: UserContext;
  pack: EventPack;
};

function fixturePack(id: "expecting_child" | "job_loss"): EventPack {
  const anchorFact = id === "expecting_child" ? "due_date" : "event_date";
  const timelineTiming = id === "expecting_child"
    ? { kind: "planned" as const, anchor: "due_date" as const, window: "before" as const, labelKey: "timing.fixture_before_anchor" }
    : { kind: "event_relative" as const, anchor: "event_date" as const, window: "immediate" as const, labelKey: "timing.fixture_from_anchor" };

  return {
    id,
    version: "seeded-v2",
    jurisdiction: "IL",
    metadata: { title: "Synthetic fixture only" },
    facts: [
      { id: anchorFact, valueType: "string", labelKey: `fact.${anchorFact}`, sensitive: false },
      { id: "wants_checklist", valueType: "boolean", labelKey: "fact.wants_checklist", sensitive: false },
      { id: "wants_support", valueType: "boolean", labelKey: "fact.wants_support", sensitive: false }
    ],
    questions: [
      { id: "fixture_anchor_question", factId: anchorFact, promptKey: "question.fixture_anchor", rationaleKey: "rationale.fixture_anchor", answerType: "string", allowSkip: true },
      { id: "fixture_checklist_question", factId: "wants_checklist", promptKey: "question.fixture_checklist", rationaleKey: "rationale.fixture_checklist", answerType: "boolean", allowSkip: true },
      { id: "fixture_support_question", factId: "wants_support", promptKey: "question.fixture_support", rationaleKey: "rationale.fixture_support", answerType: "boolean", allowSkip: true }
    ],
    sourceCards: [{
      id: "fixture_source",
      publisher: "Seeded demonstration fixture",
      canonicalUrl: "https://example.invalid/life-navigator-fixture",
      reviewedOn: "2026-07-16",
      reviewer: "Fixture-only review",
      disposition: "approved",
      scope: "Synthetic UI demonstration only — not policy content.",
      supportedClaimSummary: "No real-world claim, eligibility conclusion, or source guidance."
    }],
    tasks: [
      {
        id: "fixture_orientation",
        title: "Orient your planning view",
        actionSummary: "Synthetic task for demonstrating an explainable roadmap; verify current information before acting.",
        priority: 2,
        timing: { kind: "general", labelKey: "timing.fixture_general" },
        rationaleKey: "rationale.fixture_base",
        sourceIds: ["fixture_source"],
        verificationLabel: "Verification required",
        dependsOn: []
      },
      {
        id: "fixture_timeline",
        title: "Shape a planning timeline",
        actionSummary: "Synthetic task shown only when the seeded scenario has a planning anchor.",
        priority: 1,
        timing: timelineTiming,
        rationaleKey: "rationale.fixture_anchor",
        sourceIds: ["fixture_source"],
        verificationLabel: "Verification required",
        dependsOn: ["fixture_orientation"]
      },
      {
        id: "fixture_checklist",
        title: "Gather a simple planning checklist",
        actionSummary: "Synthetic task shown when a fixture answer requests a checklist view.",
        priority: 3,
        timing: { kind: "general", labelKey: "timing.fixture_general" },
        rationaleKey: "rationale.fixture_checklist",
        sourceIds: ["fixture_source"],
        verificationLabel: "Verification required",
        dependsOn: ["fixture_orientation"]
      },
      {
        id: "fixture_support",
        title: "Set aside time to review support options",
        actionSummary: "Synthetic task shown when the fixture answer requests a support-oriented view.",
        priority: 4,
        timing: { kind: "general", labelKey: "timing.fixture_general" },
        rationaleKey: "rationale.fixture_support",
        sourceIds: ["fixture_source"],
        verificationLabel: "Verification required",
        dependsOn: ["fixture_orientation"]
      }
    ],
    baseTaskIds: ["fixture_orientation"],
    rules: [
      { id: "fixture_anchor_rule", priority: 10, when: { fact: anchorFact, exists: true }, effect: { includeTaskIds: ["fixture_timeline"], overrides: [{ taskId: "fixture_orientation", timing: timelineTiming, rationaleKey: "rationale.fixture_anchor" }] } },
      { id: "fixture_checklist_rule", priority: 10, when: { fact: "wants_checklist", equals: true }, effect: { includeTaskIds: ["fixture_checklist"] } },
      { id: "fixture_support_rule", priority: 10, when: { fact: "wants_support", equals: true }, effect: { includeTaskIds: ["fixture_support"] } }
    ],
    safety: { disclaimerKey: "seeded.disclaimer", externalLinkNoticeKey: "seeded.external" },
    demoScenarios: []
  };
}

export const seededScenarios: SeededScenario[] = [
  {
    id: "expecting_child",
    label: "Expecting a child",
    examplePrompt: "I’m expecting a child",
    confirmationCopy: "A synthetic seeded scenario for demonstrating the shared planning experience.",
    explanation: "This roadmap uses validated, synthetic fixture data and the deterministic compiler. It is not reviewed event content.",
    context: { facts: {} },
    pack: fixturePack("expecting_child"),
    questions: [
      { id: "fixture_anchor_question", factId: "due_date", prompt: "Is there a date you want this demonstration plan to consider?", why: "A date changes the fixture timing and adds a timeline task.", options: [{ label: "Yes, use a planning date", value: "fixture_anchor" }, { label: "I’m not sure yet" }] },
      { id: "fixture_checklist_question", factId: "wants_checklist", prompt: "Would a simple planning checklist help in this demonstration?", why: "This answer decides whether the fixture checklist task appears.", options: [{ label: "Yes, add a checklist", value: true }, { label: "Not for now", value: false }, { label: "Skip for now" }] },
      { id: "fixture_support_question", factId: "wants_support", prompt: "Would you like to see a support-review step in this demonstration?", why: "This answer determines whether the fixture support task is included.", options: [{ label: "Yes, include it", value: true }, { label: "No, leave it out", value: false }, { label: "I don’t know yet" }] }
    ]
  },
  {
    id: "job_loss",
    label: "Job loss",
    examplePrompt: "I lost my job",
    confirmationCopy: "A synthetic seeded scenario for demonstrating the shared planning experience.",
    explanation: "This roadmap uses validated, synthetic fixture data and the deterministic compiler. It is not reviewed event content.",
    context: { facts: {} },
    pack: fixturePack("job_loss"),
    questions: [
      { id: "fixture_anchor_question", factId: "event_date", prompt: "Is there a key date you want this demonstration plan to consider?", why: "A date changes the fixture timing and adds a timeline task.", options: [{ label: "Yes, use a planning date", value: "fixture_anchor" }, { label: "I’m not sure yet" }] },
      { id: "fixture_checklist_question", factId: "wants_checklist", prompt: "Would a simple planning checklist help in this demonstration?", why: "This answer decides whether the fixture checklist task appears.", options: [{ label: "Yes, add a checklist", value: true }, { label: "Not for now", value: false }, { label: "Skip for now" }] },
      { id: "fixture_support_question", factId: "wants_support", prompt: "Would you like to see a support-review step in this demonstration?", why: "This answer determines whether the fixture support task is included.", options: [{ label: "Yes, include it", value: true }, { label: "No, leave it out", value: false }, { label: "I don’t know yet" }] }
    ]
  }
];

export function findSeededScenario(id: EventId): SeededScenario | undefined {
  return seededScenarios.find((scenario) => scenario.id === id);
}
