import type { EventPack } from "@/domain-contracts";

/**
 * Reviewed IL catalog content. It intentionally covers only the approved
 * post-birth routing boundary; unknown and special situations never inherit
 * the routine Israeli-hospital statement.
 */
export const expectingChildPack = {
  id: "expecting_child",
  version: "il-expecting-child-v1",
  jurisdiction: "IL",
  metadata: { title: "Expecting a child — Israel" },
  facts: [
    { id: "event_stage", valueType: "string", labelKey: "expecting_child.fact.event_stage", sensitive: false, factRole: "confirmed_transition" },
    { id: "birth_location", valueType: "string", labelKey: "expecting_child.fact.birth_location", sensitive: false },
    { id: "birth_setting", valueType: "string", labelKey: "expecting_child.fact.birth_setting", sensitive: false },
    { id: "first_name_in_hospital_notice", valueType: "string", labelKey: "expecting_child.fact.first_name_in_hospital_notice", sensitive: false },
    { id: "family_path", valueType: "string", labelKey: "expecting_child.fact.family_path", sensitive: false }
  ],
  questions: [
    { id: "ec_has_child_been_born", factId: "event_stage", promptKey: "expecting_child.question.has_child_been_born", rationaleKey: "expecting_child.why.birth_stage", answerType: "string", allowSkip: true },
    { id: "ec_birth_location", factId: "birth_location", promptKey: "expecting_child.question.birth_location", rationaleKey: "expecting_child.why.birth_location", answerType: "string", allowSkip: true },
    { id: "ec_birth_setting", factId: "birth_setting", promptKey: "expecting_child.question.birth_setting", rationaleKey: "expecting_child.why.birth_setting", answerType: "string", allowSkip: true },
    { id: "ec_family_path", factId: "family_path", promptKey: "expecting_child.question.family_path", rationaleKey: "expecting_child.why.family_path", answerType: "string", allowSkip: true },
    { id: "ec_first_name_in_hospital_notice", factId: "first_name_in_hospital_notice", promptKey: "expecting_child.question.first_name_in_hospital_notice", rationaleKey: "expecting_child.why.first_name", answerType: "string", allowSkip: true }
  ],
  sourceCards: [
    {
      id: "ec_piba_birth_registry_procedure",
      title: "Procedure for registering a birth in Israel (Procedure 2.2.0001)",
      publisher: "Population and Immigration Authority, State of Israel",
      canonicalUrl: "https://www.gov.il/BlobFolder/policy/birth_registry_in_israel_procedure/he/2.2.0001.pdf",
      jurisdiction: "IL",
      reviewedOn: "2026-07-17",
      reviewer: "Project owner (explicit promotion approval)",
      disposition: "approved",
      scope: "Routine birth in an Israeli hospital, only where the newborn is eligible for Population Registry entry.",
      supportedClaimSummary: "For the reviewed routine scope, the hospital submits the live-birth notice and the Population and Immigration Authority completes the Population Registry entry.",
      limitations: "The hospital notice is not itself a registry entry. This does not establish eligibility, parentage, citizenship, residency, documents, service availability, outcome, or automatic Israeli ID receipt.",
      verificationWording: "Verify the current process on the official source.",
      safetyClassification: "verification_required"
    },
    {
      id: "ec_piba_newborn_name",
      title: "Register the newborn’s name, child born in Israel (free)",
      publisher: "Population and Immigration Authority, State of Israel",
      canonicalUrl: "https://www.gov.il/he/service/naming_baby",
      jurisdiction: "IL",
      reviewedOn: "2026-07-17",
      reviewer: "Project owner (explicit promotion approval)",
      disposition: "approved",
      scope: "Conditional first-name action after a routine Israeli-hospital notice when the name was not included.",
      supportedClaimSummary: "The Authority provides an official naming route when a first name was not registered in the hospital notice.",
      limitations: "This does not establish parentage, personal access, documentation, online-route availability, registration outcome, or a general birth-registration process.",
      verificationWording: "Verify the current process on the official source.",
      safetyClassification: "verification_required"
    },
    {
      id: "ec_piba_birth_certificate",
      title: "Issue a birth certificate for people born in Israel (free)",
      publisher: "Population and Immigration Authority, State of Israel",
      canonicalUrl: "https://www.gov.il/he/service/birth_certificate",
      jurisdiction: "IL",
      reviewedOn: "2026-07-17",
      reviewer: "Project owner (explicit promotion approval)",
      disposition: "approved",
      scope: "Optional certificate follow-up after the hospital notice is received.",
      supportedClaimSummary: "After notice receipt, parents may obtain a free birth certificate through the official service.",
      limitations: "This is optional and not a prerequisite to registry entry. It does not establish identity, eligibility, access, processing time, delivery method, or use of a certificate.",
      verificationWording: "Verify the current process on the official source.",
      safetyClassification: "verification_required"
    },
    {
      id: "ec_moh_birth_certificate_parents",
      title: "Birth certificate: what parents need to know",
      publisher: "Ministry of Health, State of Israel",
      canonicalUrl: "https://me.health.gov.il/parenting/raising-children/after-childbirth/leaving-the-hospital/birth-certificate-parents/",
      jurisdiction: "IL",
      reviewedOn: "2026-07-17",
      reviewer: "Project owner (explicit promotion approval)",
      disposition: "approved",
      scope: "Supplementary official context for the optional certificate follow-up after hospital notice receipt.",
      supportedClaimSummary: "The Ministry page provides supplementary official context for obtaining a birth certificate after the hospital notice is received.",
      limitations: "This does not establish registry entry, eligibility, personal access, timing, or a requirement to obtain a certificate.",
      verificationWording: "Verify the current process on the official source.",
      safetyClassification: "informational"
    },
    {
      id: "ec_piba_birth_abroad_registration",
      title: "Registration of a child who was born abroad",
      publisher: "Population and Immigration Authority, State of Israel",
      canonicalUrl: "https://www.gov.il/en/service/registration_of_a_child_who_was_born_abroad",
      jurisdiction: "IL",
      reviewedOn: "2026-07-17",
      reviewer: "Project owner (explicit promotion approval)",
      disposition: "approved",
      scope: "Verification-only handoff for a birth outside Israel.",
      supportedClaimSummary: "A child born outside Israel follows a separate official registration service rather than the routine Israeli-hospital path.",
      limitations: "This does not determine citizenship, parentage, office, documents, eligibility, service availability, or registration outcome.",
      verificationWording: "Verify the appropriate official route for your situation.",
      safetyClassification: "verification_required"
    }
  ],
  tasks: [
    {
      id: "ec_confirm_birth_status",
      title: "Keep your plan up to date",
      actionSummary: "When the child is born, update this plan so it can show only the reviewed post-birth routes that fit the facts you choose to share.",
      priority: 1,
      timing: { kind: "general", labelKey: "expecting_child.timing.update_when_ready" },
      rationaleKey: "expecting_child.rationale.confirm_birth_status",
      sourceIds: [],
      verificationLabel: "Planning context only",
      dependsOn: []
    },
    {
      id: "ec_register_newborn_population_registry",
      title: "Register the newborn — Population and Immigration Authority",
      actionSummary: "Usually system-led after a hospital birth in Israel where the newborn is eligible for entry in Israel’s Population Registry. The hospital submits the birth notice and the Population and Immigration Authority completes the Population Registry entry.",
      priority: 1,
      timing: { kind: "milestone", milestone: "event_stage", window: "after", labelKey: "expecting_child.timing.immediately_after_birth" },
      rationaleKey: "expecting_child.rationale.routine_hospital_registration",
      sourceIds: ["ec_piba_birth_registry_procedure"],
      verificationLabel: "Verify the current process on the official source.",
      dependsOn: [],
      applicability: { kind: "confirmed_transition", requiredFacts: [{ factId: "event_stage", equals: "birth_occurred" }] }
    },
    {
      id: "ec_register_missing_newborn_first_name",
      title: "Register the child’s first name",
      actionSummary: "Use the official naming route when the child’s first name was not included in the hospital notice.",
      priority: 2,
      timing: { kind: "general", labelKey: "expecting_child.timing.verify_when_ready" },
      rationaleKey: "expecting_child.rationale.missing_first_name",
      sourceIds: ["ec_piba_newborn_name"],
      verificationLabel: "Verify the current process on the official source.",
      dependsOn: ["ec_register_newborn_population_registry"],
      applicability: { kind: "confirmed_transition", requiredFacts: [{ factId: "event_stage", equals: "birth_occurred" }] }
    },
    {
      id: "ec_obtain_birth_certificate_optional",
      title: "Get a birth certificate",
      actionSummary: "Optional follow-up: after the hospital notice is received, you may obtain a free birth certificate through the official service.",
      priority: 3,
      timing: { kind: "general", labelKey: "expecting_child.timing.optional_after_notice" },
      rationaleKey: "expecting_child.rationale.optional_birth_certificate",
      sourceIds: ["ec_piba_birth_certificate", "ec_moh_birth_certificate_parents"],
      verificationLabel: "Optional — verify the current process on the official sources.",
      dependsOn: [],
      applicability: { kind: "confirmed_transition", requiredFacts: [{ factId: "event_stage", equals: "birth_occurred" }] }
    },
    {
      id: "ec_verify_birth_abroad_registration",
      title: "Verify the official route for registering a child born outside Israel",
      actionSummary: "The standard Israeli-hospital route does not apply. Registration follows a separate official process.",
      priority: 1,
      timing: { kind: "general", labelKey: "expecting_child.timing.verify_when_ready" },
      rationaleKey: "expecting_child.rationale.birth_abroad",
      sourceIds: ["ec_piba_birth_abroad_registration"],
      verificationLabel: "Verification required — use the official source.",
      dependsOn: [],
      applicability: { kind: "confirmed_transition", requiredFacts: [{ factId: "event_stage", equals: "birth_occurred" }] }
    },
    {
      id: "ec_verify_non_hospital_birth_path",
      title: "Verify the official registration and newborn-name route for a non-hospital birth",
      actionSummary: "The standard hospital-notice route cannot be assumed. Verify the appropriate official pathway for the situation.",
      priority: 1,
      timing: { kind: "general", labelKey: "expecting_child.timing.verify_when_ready" },
      rationaleKey: "expecting_child.rationale.non_hospital_birth",
      sourceIds: [],
      verificationLabel: "Verification required",
      dependsOn: [],
      applicability: { kind: "confirmed_transition", requiredFacts: [{ factId: "event_stage", equals: "birth_occurred" }] }
    },
    {
      id: "ec_verify_special_family_path",
      title: "Verify the official registration pathway for your family situation",
      actionSummary: "This plan cannot determine a special registration pathway. Verify the appropriate official route for the facts that apply.",
      priority: 1,
      timing: { kind: "general", labelKey: "expecting_child.timing.verify_when_ready" },
      rationaleKey: "expecting_child.rationale.special_family_path",
      sourceIds: [],
      verificationLabel: "Verification required",
      dependsOn: [],
      applicability: { kind: "confirmed_transition", requiredFacts: [{ factId: "event_stage", equals: "birth_occurred" }] }
    },
    {
      id: "ec_verify_unconfirmed_route",
      title: "Verify the appropriate official route for your situation",
      actionSummary: "The routine Israeli-hospital process cannot be assumed from unknown or incompatible facts.",
      priority: 1,
      timing: { kind: "general", labelKey: "expecting_child.timing.verify_when_ready" },
      rationaleKey: "expecting_child.rationale.unconfirmed_route",
      sourceIds: [],
      verificationLabel: "Verification required",
      dependsOn: [],
      applicability: { kind: "confirmed_transition", requiredFacts: [{ factId: "event_stage", equals: "birth_occurred" }] }
    }
  ],
  baseTaskIds: ["ec_confirm_birth_status"],
  rules: [
    { id: "ec_remove_pre_birth_context_after_birth", priority: 1, when: { fact: "event_stage", equals: "birth_occurred" }, effect: { excludeTaskIds: ["ec_confirm_birth_status"] } },
    { id: "ec_include_routine_hospital_registration", priority: 10, when: { all: [{ fact: "event_stage", equals: "birth_occurred" }, { fact: "birth_location", equals: "israel" }, { fact: "birth_setting", equals: "hospital" }, { fact: "family_path", equals: "routine_birth" }] }, effect: { includeTaskIds: ["ec_register_newborn_population_registry", "ec_obtain_birth_certificate_optional"] } },
    { id: "ec_include_missing_first_name_registration", priority: 11, when: { all: [{ fact: "event_stage", equals: "birth_occurred" }, { fact: "birth_location", equals: "israel" }, { fact: "birth_setting", equals: "hospital" }, { fact: "family_path", equals: "routine_birth" }, { fact: "first_name_in_hospital_notice", equals: "no" }] }, effect: { includeTaskIds: ["ec_register_missing_newborn_first_name"] } },
    { id: "ec_include_birth_abroad_route", priority: 10, when: { all: [{ fact: "event_stage", equals: "birth_occurred" }, { fact: "birth_location", equals: "outside_israel" }] }, effect: { includeTaskIds: ["ec_verify_birth_abroad_registration"] } },
    { id: "ec_include_non_hospital_route", priority: 10, when: { all: [{ fact: "event_stage", equals: "birth_occurred" }, { fact: "birth_location", equals: "israel" }, { fact: "birth_setting", equals: "home_or_other" }] }, effect: { includeTaskIds: ["ec_verify_non_hospital_birth_path"] } },
    { id: "ec_include_special_family_route", priority: 10, when: { all: [{ fact: "event_stage", equals: "birth_occurred" }, { fact: "family_path", in: ["adoption", "surrogacy", "parentage_needs_verification"] }] }, effect: { includeTaskIds: ["ec_verify_special_family_path"] } },
    {
      id: "ec_include_unknown_route",
      priority: 20,
      when: {
        all: [
          { fact: "event_stage", equals: "birth_occurred" },
          {
            any: [
              { fact: "birth_location", exists: false },
              { fact: "birth_location", equals: "unknown" },
              {
                all: [
                  { fact: "birth_location", equals: "israel" },
                  { any: [{ fact: "birth_setting", exists: false }, { fact: "birth_setting", equals: "unknown" }] }
                ]
              },
              {
                all: [
                  { fact: "birth_location", equals: "israel" },
                  { fact: "birth_setting", equals: "hospital" },
                  { any: [{ fact: "family_path", exists: false }, { fact: "family_path", equals: "unknown" }] }
                ]
              }
            ]
          }
        ]
      },
      effect: { includeTaskIds: ["ec_verify_unconfirmed_route"] }
    }
  ],
  safety: { disclaimerKey: "expecting_child.safety.disclaimer", externalLinkNoticeKey: "expecting_child.safety.external_link" },
  demoScenarios: [
    { id: "ec_routine_hospital_birth", labelKey: "expecting_child.demo.routine_hospital_birth", initialFacts: { facts: { event_stage: "birth_occurred", birth_location: "israel", birth_setting: "hospital", family_path: "routine_birth", first_name_in_hospital_notice: "yes" } } },
    { id: "ec_name_not_in_notice", labelKey: "expecting_child.demo.name_not_in_notice", initialFacts: { facts: { event_stage: "birth_occurred", birth_location: "israel", birth_setting: "hospital", family_path: "routine_birth", first_name_in_hospital_notice: "no" } } },
    { id: "ec_birth_abroad", labelKey: "expecting_child.demo.birth_abroad", initialFacts: { facts: { event_stage: "birth_occurred", birth_location: "outside_israel" } } },
    { id: "ec_non_hospital_birth", labelKey: "expecting_child.demo.non_hospital_birth", initialFacts: { facts: { event_stage: "birth_occurred", birth_location: "israel", birth_setting: "home_or_other" } } }
  ] as EventPack["demoScenarios"]
} satisfies EventPack;

export const expectingChildQuestionPresentation = {
  ec_has_child_been_born: { prompt: "Has the child been born?", why: "A post-birth answer is required before this plan can show any post-birth route.", options: [{ label: "Yes, the child has been born", value: "birth_occurred" }, { label: "Not yet", value: "not_yet" }, { label: "I’m not sure" }] },
  ec_birth_location: { prompt: "Was the child born in Israel?", why: "A birth outside Israel follows a separate official route and cannot use the Israeli-hospital pathway.", options: [{ label: "Yes, in Israel", value: "israel" }, { label: "No, outside Israel", value: "outside_israel" }, { label: "I’m not sure", value: "unknown" }] },
  ec_birth_setting: { prompt: "Was the child born in an Israeli hospital?", why: "Only a confirmed Israeli-hospital birth can be considered for the reviewed routine hospital-notice path.", options: [{ label: "Yes, in an Israeli hospital", value: "hospital" }, { label: "No, another setting", value: "home_or_other" }, { label: "I’m not sure", value: "unknown" }] },
  ec_family_path: { prompt: "Does the routine birth path describe your situation?", why: "A special family situation must remove the routine hospital guidance rather than assume it applies.", options: [{ label: "Yes, routine birth path", value: "routine_birth" }, { label: "Adoption", value: "adoption" }, { label: "Surrogacy", value: "surrogacy" }, { label: "Parentage needs verification", value: "parentage_needs_verification" }, { label: "I’m not sure", value: "unknown" }] },
  ec_first_name_in_hospital_notice: { prompt: "Was the child’s first name included in the hospital notice?", why: "A “no” answer adds the approved conditional naming route; it does not imply a registration outcome.", options: [{ label: "Yes", value: "yes" }, { label: "No", value: "no" }, { label: "I’m not sure", value: "unknown" }] }
} as const;
