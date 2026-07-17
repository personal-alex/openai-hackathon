import type { EventPack } from "@/domain-contracts";

/**
 * Non-production contract fixture only. It proves deterministic routing for a
 * reviewed candidate scope and is testOnly, unregistered, and rejected by the
 * approved-runtime gate. It must never become a runtime event pack.
 */
export const expectingChildTransitionFixture = {
  id: "expecting_child",
  version: "test-only-routine-hospital-registration-v1",
  jurisdiction: "IL",
  metadata: { title: "Test-only routine-hospital registration fixture" },
  facts: [
    { id: "due_date", valueType: "string", labelKey: "fixture.due_date", sensitive: false, factRole: "context" },
    { id: "event_stage", valueType: "string", labelKey: "fixture.event_stage", sensitive: false, factRole: "confirmed_transition" },
    { id: "birth_in_israeli_hospital", valueType: "boolean", labelKey: "fixture.birth_in_israeli_hospital", sensitive: false, factRole: "context" },
    { id: "newborn_first_name_in_hospital_notice", valueType: "boolean", labelKey: "fixture.newborn_first_name_in_hospital_notice", sensitive: false, factRole: "context" }
  ],
  questions: [],
  sourceCards: [
    {
      id: "test_only_piba_birth_registry_procedure",
      publisher: "Population and Immigration Authority — test-only fixture",
      canonicalUrl: "https://www.gov.il/BlobFolder/policy/birth_registry_in_israel_procedure/he/2.2.0001.pdf",
      reviewedOn: "2026-07-17",
      reviewer: "Test fixture",
      disposition: "approved",
      scope: "Test-only proof of the reviewed routine Israeli-hospital candidate route; not runtime content.",
      supportedClaimSummary: "The fixture exercises only the candidate distinction between hospital notice and Authority registry entry."
    },
    {
      id: "test_only_piba_newborn_name",
      publisher: "Population and Immigration Authority — test-only fixture",
      canonicalUrl: "https://www.gov.il/he/service/naming_baby",
      reviewedOn: "2026-07-17",
      reviewer: "Test fixture",
      disposition: "approved",
      scope: "Test-only proof of a conditional first-name action; not runtime content.",
      supportedClaimSummary: "The fixture exercises selection only when a first name was not included in a hospital notice."
    }
  ],
  tasks: [
    {
      id: "future_planning_item",
      title: "Future planning item",
      actionSummary: "Synthetic planning-only fixture task; it is not currently actionable.",
      priority: 1,
      timing: { kind: "planned", anchor: "due_date", window: "before", labelKey: "fixture.before_date" },
      rationaleKey: "fixture.future_planning",
      sourceIds: ["test_only_piba_birth_registry_procedure"],
      verificationLabel: "Planning only — future work",
      dependsOn: [],
      applicability: { kind: "always" }
    },
    {
      id: "routine_hospital_registration",
      title: "Register the newborn — Population and Immigration Authority",
      actionSummary: "Usually system-led after a hospital birth in Israel. The hospital submits the birth notice and the Population and Immigration Authority completes the Population Registry entry.",
      priority: 2,
      timing: { kind: "event_relative", anchor: "event_date", window: "immediate", labelKey: "fixture.immediately_after_birth" },
      rationaleKey: "fixture.routine_hospital_registration",
      sourceIds: ["test_only_piba_birth_registry_procedure"],
      verificationLabel: "Verify the current process on the official source.",
      dependsOn: [],
      applicability: { kind: "confirmed_transition", requiredFacts: [{ factId: "event_stage", equals: "birth_occurred" }] }
    },
    {
      id: "conditional_first_name_registration",
      title: "Register the newborn’s first name",
      actionSummary: "If the child’s first name was not included in the hospital notice, register it through the official service.",
      priority: 3,
      timing: { kind: "general", labelKey: "fixture.conditional_name" },
      rationaleKey: "fixture.conditional_first_name_registration",
      sourceIds: ["test_only_piba_newborn_name"],
      verificationLabel: "Verify the current process on the official source.",
      dependsOn: ["routine_hospital_registration"],
      applicability: { kind: "confirmed_transition", requiredFacts: [{ factId: "event_stage", equals: "birth_occurred" }] }
    },
    {
      id: "special_registration_verification",
      title: "Verify the appropriate registration path",
      actionSummary: "Verification required: use the official Authority source to identify the appropriate registration path for the stated situation.",
      priority: 2,
      timing: { kind: "general", labelKey: "fixture.special_registration" },
      rationaleKey: "fixture.special_registration_verification",
      sourceIds: ["test_only_piba_birth_registry_procedure"],
      verificationLabel: "Verify the current process on the official source.",
      dependsOn: [],
      applicability: { kind: "confirmed_transition", requiredFacts: [{ factId: "event_stage", equals: "birth_occurred" }] }
    }
  ],
  baseTaskIds: ["future_planning_item"],
  rules: [
    {
      id: "include_routine_hospital_registration",
      priority: 1,
      when: { all: [{ fact: "event_stage", equals: "birth_occurred" }, { fact: "birth_in_israeli_hospital", equals: true }] },
      effect: { includeTaskIds: ["routine_hospital_registration"] }
    },
    {
      id: "include_conditional_first_name_registration",
      priority: 1,
      when: { all: [{ fact: "event_stage", equals: "birth_occurred" }, { fact: "birth_in_israeli_hospital", equals: true }, { fact: "newborn_first_name_in_hospital_notice", equals: false }] },
      effect: { includeTaskIds: ["conditional_first_name_registration"] }
    },
    {
      id: "include_special_registration_for_non_hospital_birth",
      priority: 1,
      when: { all: [{ fact: "event_stage", equals: "birth_occurred" }, { fact: "birth_in_israeli_hospital", equals: false }] },
      effect: { includeTaskIds: ["special_registration_verification"] }
    },
    {
      id: "include_special_registration_for_unknown_birth_location",
      priority: 1,
      when: { all: [{ fact: "event_stage", equals: "birth_occurred" }, { fact: "birth_in_israeli_hospital", exists: false }] },
      effect: { includeTaskIds: ["special_registration_verification"] }
    }
  ],
  safety: { disclaimerKey: "fixture.disclaimer", externalLinkNoticeKey: "fixture.external" },
  demoScenarios: [],
  testOnly: true
} satisfies EventPack;
