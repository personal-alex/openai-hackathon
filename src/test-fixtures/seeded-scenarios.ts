import type { EventId, EventPack, FactValue, QuestionDefinition, UserContext } from "@/domain-contracts";
import { expectingChildPack } from "@/event-packs/expecting-child";
import { jobLossPack } from "@/event-packs/job-loss";

export type SeededValue = FactValue;

export type SeededQuestion = QuestionDefinition & {
  isApplicable?: (facts: UserContext["facts"]) => boolean;
};

export type SeededScenario = {
  id: "expecting_child" | "job_loss";
  label: string;
  examplePrompt: string;
  /** Test/demo-only matching hints; shared presentation code contains no event-specific matcher. */
  statementHints: string[];
  confirmationCopy: string;
  explanation: string;
  catalogKind: "approved" | "synthetic";
  rationaleByKey?: Record<string, string>;
  preBirthPreview?: { lead: string; detail: string };
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
      { id: "fixture_anchor_question", factId: anchorFact, promptKey: "question.fixture_anchor", rationaleKey: "rationale.fixture_anchor", answerType: "string", allowSkip: true, presentation: { prompt: "Is there a key date you want this demonstration plan to consider?", rationale: "A date changes the fixture timing and adds a timeline task.", options: [{ label: "Yes, use a planning date", value: "fixture_anchor" }, { label: "I’m not sure yet" }] } },
      { id: "fixture_checklist_question", factId: "wants_checklist", promptKey: "question.fixture_checklist", rationaleKey: "rationale.fixture_checklist", answerType: "boolean", allowSkip: true, presentation: { prompt: "Would a simple planning checklist help in this demonstration?", rationale: "This answer decides whether the fixture checklist task appears.", options: [{ label: "Yes, add a checklist", value: true }, { label: "Not for now", value: false }, { label: "Skip for now" }] } },
      { id: "fixture_support_question", factId: "wants_support", promptKey: "question.fixture_support", rationaleKey: "rationale.fixture_support", answerType: "boolean", allowSkip: true, presentation: { prompt: "Would you like to see a support-review step in this demonstration?", rationale: "This answer determines whether the fixture support task is included.", options: [{ label: "Yes, include it", value: true }, { label: "No, leave it out", value: false }, { label: "I don’t know yet" }] } }
    ],
    sourceCards: [{
      id: "fixture_source",
      title: "Synthetic fixture source",
      publisher: "Seeded demonstration fixture",
      canonicalUrl: "https://example.invalid/life-navigator-fixture",
      jurisdiction: "IL",
      reviewedOn: "2026-07-16",
      reviewer: "Fixture-only review",
      disposition: "approved",
      scope: "Synthetic UI demonstration only — not policy content.",
      supportedClaimSummary: "No real-world claim, eligibility conclusion, or source guidance.",
      limitations: "This source is synthetic and cannot support a real-world action.",
      verificationWording: "Use a reviewed official source before acting.",
      safetyClassification: "verification_required"
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
    statementHints: ["expect", "pregnan", "child", "baby"],
    confirmationCopy: "A reviewed Israel event pack will build a source-aware, deterministic roadmap from the facts you choose to share.",
    explanation: "This roadmap is compiled only from the reviewed, validated Israel catalog. It provides educational planning support, not an official determination.",
    catalogKind: "approved",
    preBirthPreview: {
      lead: "Don’t worry, we’ve got you. Here’s what may be relevant after the birth. We’ll guide you through the details when you’re ready.",
      detail: "These are planning previews, not current required actions. This roadmap will adapt after you explicitly confirm a birth. Verify current information through the linked official sources before acting."
    },
    rationaleByKey: {
      "expecting_child.rationale.confirm_birth_status": "No post-birth route is shown until you explicitly confirm that the child has been born.",
      "expecting_child.rationale.routine_hospital_registration": "You confirmed a routine birth in Israel in a hospital. The reviewed routine hospital path can now be shown, subject to the source’s eligibility limits.",
      "expecting_child.rationale.missing_first_name": "You said the first name was not included in the hospital notice, so the approved conditional naming route was added.",
      "expecting_child.rationale.optional_birth_certificate": "You confirmed the reviewed routine hospital path. The certificate is an optional follow-up, never a registration prerequisite.",
      "expecting_child.rationale.birth_abroad": "You said the birth was outside Israel, so the routine Israeli-hospital path was removed and the separate official route was shown.",
      "expecting_child.rationale.non_hospital_birth": "You said the birth was not in an Israeli hospital. The routine hospital-notice path cannot be assumed.",
      "expecting_child.rationale.special_family_path": "You identified a family situation that requires verification, so the routine hospital path was removed.",
      "expecting_child.rationale.unconfirmed_route": "A fact needed for the routine hospital path is unknown or incompatible, so this plan keeps to a verification-required boundary.",
      "expecting_child.preview.routine_registration": "After a birth in an Israeli hospital and where applicable, this roadmap can guide you through the official registration process.",
      "expecting_child.preview.optional_certificate": "After the birth, an optional certificate follow-up may be relevant. It is never a registration prerequisite.",
      "expecting_child.preview.birth_abroad": "You shared a fact that rules out the routine Israeli-hospital path, so this preview keeps to the separate official route.",
      "expecting_child.preview.non_hospital": "You shared a non-hospital setting, so this preview does not assume the routine hospital-notice path.",
      "expecting_child.preview.special_family": "You shared a family situation that needs verification, so this preview does not apply the routine path."
    },
    context: { facts: {} },
    pack: expectingChildPack,
    questions: [
      expectingChildPack.questions[0],
      { ...expectingChildPack.questions[1], isApplicable: (facts) => facts.event_stage === "birth_occurred" },
      { ...expectingChildPack.questions[2], isApplicable: (facts) => facts.event_stage === "birth_occurred" && facts.birth_location === "israel" },
      { ...expectingChildPack.questions[3], isApplicable: (facts) => facts.event_stage === "birth_occurred" && facts.birth_location === "israel" && facts.birth_setting === "hospital" },
      { ...expectingChildPack.questions[4], isApplicable: (facts) => facts.event_stage === "birth_occurred" && facts.birth_location === "israel" && facts.birth_setting === "hospital" && facts.family_path === "routine_birth" }
    ]
  },
  {
    id: "job_loss",
    label: "Job loss",
    examplePrompt: "I lost my job",
    statementHints: ["job", "lost", "laid off", "layoff"],
    confirmationCopy: "A reviewed Israel event pack can help you review official routes and practical next steps from the facts you choose to share.",
    explanation: "This roadmap is compiled only from the approved Hackathon-scope catalog. It provides educational planning support, not an eligibility, legal, tax, pension, or payment determination.",
    catalogKind: "approved",
    rationaleByKey: {
      "job_loss.rationale.registration_not_registered": "You explicitly said employment ended, that your work was salaried, and that you had not registered. This raises an official-route review, not an eligibility conclusion.",
      "job_loss.rationale.salaried_claim_route": "You explicitly described a salaried arrangement after employment ended, so the roadmap includes a review of the official claim route without predicting an outcome.",
      "job_loss.rationale.registration_confirmed": "You said you had registered, so the initial registration review was replaced with a prompt to check current official instructions.",
      "job_loss.rationale.nonstandard_arrangement": "Your work arrangement is not confirmed as salaried, so the standard salaried route is not shown. Only a bounded verification task appears.",
      "job_loss.rationale.prepare_information": "The official source supports keeping employment and pay information available, but does not establish a complete checklist or sufficient documents.",
      "job_loss.rationale.missing_end_confirmation": "You said confirmation is missing or uncertain, so this records task stays verification-oriented rather than treating any document as required or sufficient.",
      "job_loss.rationale.information_uncertain": "You said the available information is missing or uncertain, so the roadmap directs you to verify current official requirements rather than assume a checklist is complete.",
      "job_loss.rationale.practical_momentum": "This is practical planning guidance, not an official benefits or rights claim."
    },
    context: { facts: {} },
    pack: jobLossPack,
    questions: [
      jobLossPack.questions[0],
      { ...jobLossPack.questions[1], isApplicable: (facts) => facts.employment_stage === "ended" },
      { ...jobLossPack.questions[2], isApplicable: (facts) => facts.employment_stage === "ended" },
      { ...jobLossPack.questions[3], isApplicable: (facts) => facts.employment_stage === "ended" && facts.work_arrangement === "salaried" },
      { ...jobLossPack.questions[4], isApplicable: (facts) => facts.employment_stage === "ended" },
      { ...jobLossPack.questions[5], isApplicable: (facts) => facts.employment_stage === "ended" && facts.work_arrangement === "salaried" },
      { ...jobLossPack.questions[6], isApplicable: (facts) => facts.employment_stage === "ended" || facts.employment_stage === "notice_given" },
      { ...jobLossPack.questions[7], isApplicable: (facts) => facts.employment_stage === "ended" && facts.work_arrangement === "salaried" }
    ]
  }
];

export function findSeededScenario(id: EventId): SeededScenario | undefined {
  return seededScenarios.find((scenario) => scenario.id === id);
}
