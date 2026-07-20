import type { EventPack } from "@/domain-contracts";

const reviewDate = "2026-07-18";
const reviewer = "Project owner (hackathon-scope directive)";
const hackathonScope = "Reviewed for the Life Navigator hackathon/demo only; not production legal, tax, immigration, or eligibility guidance.";

function source(id: string, title: string, publisher: string, canonicalUrl: string, jurisdiction: "IL" | "US", supportedClaimSummary: string, limitations: string): EventPack["sourceCards"][number] {
  return {
    id,
    title,
    publisher,
    canonicalUrl,
    jurisdiction,
    reviewedOn: reviewDate,
    reviewer,
    disposition: "approved_for_hackathon",
    scope: hackathonScope,
    supportedClaimSummary,
    limitations,
    verificationWording: "Verify the current process on the official source or with a qualified reviewer before acting.",
    safetyClassification: "verification_required"
  };
}

const questionPresentation = {
  purpose: {
    prompt: "What is the main purpose of your move to the U.S.?",
    rationale: "The purpose changes which verification-only route review this plan can show; it never decides eligibility.",
    options: [
      { label: "Work or employment", value: "employment" },
      { label: "Joining or marrying family", value: "family_or_marriage" },
      { label: "Study", value: "study" },
      { label: "Other or not sure", value: "other_or_unsure" }
    ]
  },
  jobOffer: {
    prompt: "Do you already have a job offer from a U.S. employer?",
    rationale: "This changes the explanation for an employment-category review; it is not an eligibility signal.",
    options: [{ label: "Yes, I have an offer", value: "has_offer" }, { label: "Not yet", value: "no_offer_yet" }, { label: "I’m not sure", value: "unknown" }]
  },
  relationship: {
    prompt: "Are you married to, or engaged to, a U.S. citizen or permanent resident?",
    rationale: "This changes the explanation for a family or marriage review; it makes no relationship or petition-outcome claim.",
    options: [{ label: "Married", value: "married_to_us_person" }, { label: "Engaged", value: "engaged_to_us_person" }, { label: "Not applicable", value: "not_applicable" }, { label: "I’m not sure", value: "unknown" }]
  },
  familyUnit: {
    prompt: "Will your entire immediate family be relocating with you?",
    rationale: "A spouse or child remaining in Israel adds a verification-only family-unit review; it never predicts a residency outcome.",
    options: [{ label: "Yes, everyone is relocating", value: "entire_family_relocating" }, { label: "A spouse or child will remain in Israel", value: "spouse_or_child_remaining_in_israel" }, { label: "I have no dependents", value: "single_no_dependents" }, { label: "I’m not sure", value: "unknown" }]
  },
  duration: {
    prompt: "Roughly how long do you expect to be abroad?",
    rationale: "This determines whether a departure-notification or residency review is worth verifying; it does not decide residency or tax status.",
    options: [{ label: "Under 3 months", value: "under_3_months" }, { label: "3 months to 2 years", value: "3_months_to_2_years" }, { label: "Over 2 years", value: "over_2_years" }, { label: "I’m not sure", value: "unknown" }]
  },
  departureDate: {
    prompt: "If you want to share it, when do you plan to depart?",
    rationale: "A date makes the selected departure reviews easier to time; it never establishes a move or changes an official route.",
    input: { kind: "date" as const, formatHelp: "Use YYYY-MM-DD.", validationMessage: "Enter a valid calendar date." }
  }
};

/**
 * Cross-border IL→US catalog approved only for the hackathon demo on 2026-07-18.
 * It presents reviewed source-verification steps, never an immigration, tax, or
 * residency outcome. The deterministic compiler remains its sole task selector.
 */
export const relocateIlUsPack: EventPack = {
  id: "relocate_il_us",
  version: "il-us-relocate-hackathon-v1",
  jurisdiction: "IL_US",
  metadata: {
    title: "Relocating from Israel to the United States",
    recognitionHints: [
      "relocating from Israel to the US",
      "relocating from Israel to the United States",
      "moving to America for my job",
      "I got a job offer from a company in the USA",
      "moving to the U.S. to join my spouse",
      "my fiancé is American and I’m moving to the US",
      "relocating from Israel to California",
      "long-term move from Israel to the United States"
    ]
  },
  facts: [
    { id: "relocation_purpose", valueType: "string", labelKey: "relocate_il_us.fact.purpose", sensitive: true },
    { id: "us_job_offer_status", valueType: "string", labelKey: "relocate_il_us.fact.job_offer", sensitive: true },
    { id: "marital_status_for_relocation", valueType: "string", labelKey: "relocate_il_us.fact.relationship", sensitive: true },
    { id: "family_unit_departure_status", valueType: "string", labelKey: "relocate_il_us.fact.family_unit", sensitive: true },
    { id: "time_abroad_expected", valueType: "string", labelKey: "relocate_il_us.fact.duration", sensitive: true },
    { id: "departure_date", valueType: "string", labelKey: "relocate_il_us.fact.departure_date", sensitive: true }
  ],
  questions: [
    { id: "relocate_purpose_question", factId: "relocation_purpose", promptKey: "relocate_il_us.question.purpose", rationaleKey: "relocate_il_us.why.purpose", answerType: "string", allowSkip: true, presentation: questionPresentation.purpose },
    { id: "relocate_job_offer_question", factId: "us_job_offer_status", promptKey: "relocate_il_us.question.job_offer", rationaleKey: "relocate_il_us.why.job_offer", answerType: "string", allowSkip: true, presentation: questionPresentation.jobOffer },
    { id: "relocate_relationship_question", factId: "marital_status_for_relocation", promptKey: "relocate_il_us.question.relationship", rationaleKey: "relocate_il_us.why.relationship", answerType: "string", allowSkip: true, presentation: questionPresentation.relationship },
    { id: "relocate_family_unit_question", factId: "family_unit_departure_status", promptKey: "relocate_il_us.question.family_unit", rationaleKey: "relocate_il_us.why.family_unit", answerType: "string", allowSkip: true, presentation: questionPresentation.familyUnit },
    { id: "relocate_duration_question", factId: "time_abroad_expected", promptKey: "relocate_il_us.question.duration", rationaleKey: "relocate_il_us.why.duration", answerType: "string", allowSkip: true, presentation: questionPresentation.duration },
    { id: "relocate_departure_date_question", factId: "departure_date", promptKey: "relocate_il_us.question.departure_date", rationaleKey: "relocate_il_us.why.departure_date", answerType: "string", allowSkip: true, presentation: questionPresentation.departureDate }
  ],
  sourceCards: [
    source("relocate_il_nii_termination_of_residency", "Submitting a termination of residency request", "National Insurance Institute of Israel (Bituach Leumi)", "http://www.btl.gov.il/English%20Homepage/Insurance/An%20Insured%20Person%20Residing%20Abroad/Pages/HfsakatTosvot1.aspx", "IL", "A person who transferred their center of life abroad may review the official termination-of-residency request process; family circumstances are considered in that official assessment.", "Does not determine a personal residency outcome, timing, or tax status."),
    source("relocate_il_nii_staying_abroad_old_age", "Staying abroad — Old Age", "National Insurance Institute of Israel", "http://www.btl.gov.il/English%20Homepage/Benefits/Old%20Age%20Insurance/Stayingabroad/Pages/default.aspx", "IL", "The official page describes notifying National Insurance about an intended absence longer than three months.", "Notification information only; it does not establish benefit continuity or an obligation in a particular case."),
    source("relocate_il_tax_residency_form_1348", "Form 1348 / center-of-life commentary (secondary)", "tzer.co.il (private tax-advisory site)", "https://tzer.co.il/en/do-israelis-have-to-pay-taxes-after-renouncing-residency/", "IL", "Secondary commentary describes Form 1348 and center-of-life concepts for hackathon-scope review.", "Not an Israel Tax Authority narrative source; it cannot establish residency, filing, or tax obligations."),
    source("relocate_il_tax_residency_secondary_guide", "Severing Israeli Tax Residency — Professional Guide 2026", "cpa.co.il (private accounting-firm site)", "https://www.cpa.co.il/en/severing-residency-2026-guide-en/", "IL", "Secondary commentary notes that moving abroad does not automatically settle Israeli tax residency.", "Secondary context only; no personal tax outcome or requirement follows."),
    source("relocate_il_tax_authority_form_1348_pdf", "Form 1348 — Declaration of Residency for the tax year", "Israel Tax Authority, via gov.il", "https://www.gov.il/blobFolder/service/annual-tax-report/he/Service_Pages_Income_tax_itc1348_18.pdf", "IL", "Official form artifact for a tax-year residency declaration.", "A Hebrew form artifact, not guidance on when a person must file it."),
    source("relocate_il_tax_authority_annual_report_service_page", "Annual tax reports for individuals and unincorporated businesses", "Israel Tax Authority, via gov.il", "https://www.gov.il/en/service/reporting-and-payment-2023-annual-tax-report-for-individuals", "IL", "Official annual-report service information references Form 1348 as an attachment for residency declarations.", "Does not state who must file Form 1348 or a substantive residency test."),
    source("relocate_il_tax_authority_center_of_life_certificate_1312", "Request for confirmation of residence for tax reduction", "Israel Tax Authority, via gov.il", "https://www.gov.il/en/service/itc1312", "IL", "Official service for a distinct domestic center-of-life certificate.", "Not an international-residency severance form and must not be conflated with Form 1348."),
    source("relocate_il_lawoffice_residents_abroad", "The Rights and Duties of Israeli Residents Abroad", "lawoffice.org.il (private law-firm site)", "https://lawoffice.org.il/en/israeli-residents-staying-abroad/", "IL", "Secondary context about Israeli residents abroad.", "Not an official source and cannot establish a form, duty, or personal outcome."),
    source("relocate_us_dos_visa_categories", "Directory of Visa Categories", "U.S. Department of State, Bureau of Consular Affairs", "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/all-visa-categories.html", "US", "Official directory maps purposes of travel to category names.", "It does not determine a category, eligibility, fees, processing time, or approval likelihood for a person."),
    source("relocate_us_esta_visa_waiver_israel", "Visa Waiver Travel for Israeli Citizens", "U.S. Department of State, Bureau of Consular Affairs", "https://travel.state.gov/content/travel/en/News/visas-news/visa-waiver-travel-for-israeli-citizens.html", "US", "Official short-visit Visa Waiver Program information for eligible Israeli citizens.", "Short-visit information only; it is not a relocation or work-authorization path."),
    source("relocate_us_secondary_h1b_l1_o1_comparison", "H-1B, L-1, and O-1 comparison (secondary)", "Pollak Immigration Law", "https://www.pollakimmigration.com/blog/h1b-vs-l1-visa-for-working-in-the-us", "US", "Secondary contextual comparison of employment category names.", "Not an official source and cannot support eligibility, cap, or process claims."),
    source("relocate_us_secondary_greencard_pathways_israelis", "How to Get a U.S. Green Card as an Israeli Citizen (secondary)", "eb5visainvestments.com", "https://eb5visainvestments.com/blog/how-to-get-a-u-s-green-card-as-an-israeli-citizen", "US", "Secondary overview of pathway families.", "Not an official source and cannot support an eligibility, form, fee, quota, or timing claim."),
    source("relocate_us_uscis_h1b", "H-1B Specialty Occupations", "U.S. Citizenship and Immigration Services (USCIS)", "https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations", "US", "Official classification information for H-1B specialty occupations.", "Does not determine whether a job or person qualifies."),
    source("relocate_us_uscis_l1a", "L-1A Intracompany Transferee Executive or Manager", "U.S. Citizenship and Immigration Services (USCIS)", "https://www.uscis.gov/working-in-the-united-states/temporary-workers/l-1a-intracompany-transferee-executive-or-manager", "US", "Official classification information for L-1A transfers.", "Does not determine a person’s classification or outcome."),
    source("relocate_us_uscis_l1b", "L-1B Intracompany Transferee Specialized Knowledge", "U.S. Citizenship and Immigration Services (USCIS)", "https://www.uscis.gov/working-in-the-united-states/temporary-workers/l-1b-intracompany-transferee-specialized-knowledge", "US", "Official classification information for L-1B transfers.", "Does not determine whether a role or knowledge qualifies."),
    source("relocate_us_uscis_l1b_policy_manual_ch4", "USCIS Policy Manual — L-1B specialized knowledge", "U.S. Citizenship and Immigration Services (USCIS)", "https://www.uscis.gov/policy-manual/volume-2-part-l-chapter-4", "US", "Official adjudicator guidance describes the specialized-knowledge standard as case-specific.", "Not a self-assessment tool or a personal outcome determination."),
    source("relocate_us_uscis_o1", "O-1 Visa: Individuals with Extraordinary Ability or Achievement", "U.S. Citizenship and Immigration Services (USCIS)", "https://www.uscis.gov/working-in-the-united-states/temporary-workers/o-1-visa-individuals-with-extraordinary-ability-or-achievement", "US", "Official O-1 classification information and evidentiary criteria.", "Does not determine whether evidence meets the standard for a person."),
    source("relocate_us_uscis_i130", "I-130, Petition for Alien Relative", "U.S. Citizenship and Immigration Services (USCIS)", "https://www.uscis.gov/i-130", "US", "Official petition information for qualifying family relationships.", "Does not determine relationship, petition, visa, or admission outcome."),
    source("relocate_us_uscis_i129f_fiance", "Visas for Fiancé(e)s of U.S. Citizens", "U.S. Citizenship and Immigration Services (USCIS)", "https://www.uscis.gov/family/family-of-us-citizens/visas-for-fiancees-of-us-citizens", "US", "Official K-1 fiancé process information.", "Does not determine eligibility, bona fides, fees, timing, or admission."),
    source("relocate_us_dos_cr1_ir1_spouse_visa", "Immigrant Visa for a Spouse of a U.S. Citizen", "U.S. Department of State, Bureau of Consular Affairs", "https://travel.state.gov/content/travel/en/us-visas/immigrate/family-immigration/immigrant-visa-for-spouse.html", "US", "Official IR1/CR1 spouse process information.", "Does not determine relationship, processing time, fee, or visa outcome.")
  ],
  tasks: [
    { id: "relocate_notify_nii_of_departure", title: "Review the National Insurance departure-notification process", actionSummary: "For a planned absence over three months, review the current official National Insurance departure-notification information before acting.", priority: 10, timing: { kind: "general", labelKey: "relocate_il_us.timing.before_departure" }, rationaleKey: "relocate_il_us.rationale.departure_notice", sourceIds: ["relocate_il_nii_staying_abroad_old_age"], verificationLabel: "Verification required — no benefits or obligations outcome", dependsOn: [] },
    { id: "relocate_review_nii_residency_termination", title: "Review National Insurance residency information", actionSummary: "Review the official process before assuming that moving abroad changes National Insurance residency. Family circumstances need their own verification.", priority: 20, timing: { kind: "general", labelKey: "relocate_il_us.timing.review_after_departure" }, rationaleKey: "relocate_il_us.rationale.residency_review", sourceIds: ["relocate_il_nii_termination_of_residency"], verificationLabel: "Verification required — no residency outcome", dependsOn: [] },
    { id: "relocate_flag_family_unit_review", title: "Verify the family-unit context before a residency request", actionSummary: "Because a spouse or child may remain in Israel, review the official family-unit context before assuming how a National Insurance residency request will be assessed.", priority: 15, timing: { kind: "general", labelKey: "relocate_il_us.timing.verify_when_ready" }, rationaleKey: "relocate_il_us.rationale.family_unit", sourceIds: ["relocate_il_nii_termination_of_residency"], verificationLabel: "Verification required — no residency outcome", dependsOn: [] },
    { id: "relocate_review_tax_residency_status", title: "Review Israeli tax-residency information", actionSummary: "Review the official annual-report and residency-declaration information, then consider qualified Israeli tax advice for your circumstances. This plan does not determine tax residency or filing obligations.", priority: 30, timing: { kind: "general", labelKey: "relocate_il_us.timing.verify_when_ready" }, rationaleKey: "relocate_il_us.rationale.tax_review", sourceIds: ["relocate_il_tax_authority_form_1348_pdf", "relocate_il_tax_authority_annual_report_service_page", "relocate_il_tax_residency_form_1348"], verificationLabel: "Verification required — no tax residency or filing outcome", dependsOn: [] },
    { id: "relocate_review_us_visa_category_options", title: "Review official U.S. entry-category information", actionSummary: "Review the official U.S. category directory for your stated purpose. A short ESTA/Visa Waiver visit is not treated here as a relocation or work-authorization path.", priority: 10, timing: { kind: "general", labelKey: "relocate_il_us.timing.verify_when_ready" }, rationaleKey: "relocate_il_us.rationale.us_category_review", sourceIds: ["relocate_us_dos_visa_categories", "relocate_us_esta_visa_waiver_israel", "relocate_us_uscis_h1b", "relocate_us_uscis_l1a", "relocate_us_uscis_l1b", "relocate_us_uscis_o1"], verificationLabel: "Verification required — no category or admission outcome", dependsOn: [] },
    { id: "relocate_review_family_or_marriage_based_path", title: "Review official family or marriage pathway information", actionSummary: "Review the official USCIS/DOS starting information that matches the relationship you described. This plan does not determine a relationship, petition, visa, or admission outcome.", priority: 10, timing: { kind: "general", labelKey: "relocate_il_us.timing.verify_when_ready" }, rationaleKey: "relocate_il_us.rationale.family_path_review", sourceIds: ["relocate_us_uscis_i130", "relocate_us_uscis_i129f_fiance", "relocate_us_dos_cr1_ir1_spouse_visa"], verificationLabel: "Verification required — no petition or visa outcome", dependsOn: [] }
  ],
  baseTaskIds: [],
  rules: [
    { id: "relocate_include_departure_notice", priority: 10, when: { fact: "time_abroad_expected", in: ["3_months_to_2_years", "over_2_years"] }, effect: { includeTaskIds: ["relocate_notify_nii_of_departure"] } },
    { id: "relocate_include_residency_review", priority: 10, when: { fact: "time_abroad_expected", equals: "over_2_years" }, effect: { includeTaskIds: ["relocate_review_nii_residency_termination"] } },
    { id: "relocate_include_family_unit_review", priority: 10, when: { fact: "family_unit_departure_status", equals: "spouse_or_child_remaining_in_israel" }, effect: { includeTaskIds: ["relocate_flag_family_unit_review"] } },
    { id: "relocate_include_tax_review", priority: 10, when: { fact: "time_abroad_expected", in: ["under_3_months", "3_months_to_2_years", "over_2_years"] }, effect: { includeTaskIds: ["relocate_review_tax_residency_status"] } },
    { id: "relocate_include_employment_category_review", priority: 10, when: { fact: "relocation_purpose", equals: "employment" }, effect: { includeTaskIds: ["relocate_review_us_visa_category_options"] } },
    { id: "relocate_include_offer_explanation", priority: 20, when: { all: [{ fact: "relocation_purpose", equals: "employment" }, { fact: "us_job_offer_status", equals: "has_offer" }] }, effect: { overrides: [{ taskId: "relocate_review_us_visa_category_options", rationaleKey: "relocate_il_us.rationale.employment_offer" }] } },
    { id: "relocate_include_family_path_review", priority: 10, when: { fact: "relocation_purpose", equals: "family_or_marriage" }, effect: { includeTaskIds: ["relocate_review_family_or_marriage_based_path"] } },
    { id: "relocate_include_married_explanation", priority: 20, when: { all: [{ fact: "relocation_purpose", equals: "family_or_marriage" }, { fact: "marital_status_for_relocation", equals: "married_to_us_person" }] }, effect: { overrides: [{ taskId: "relocate_review_family_or_marriage_based_path", rationaleKey: "relocate_il_us.rationale.married_path" }] } },
    { id: "relocate_include_engaged_explanation", priority: 21, when: { all: [{ fact: "relocation_purpose", equals: "family_or_marriage" }, { fact: "marital_status_for_relocation", equals: "engaged_to_us_person" }] }, effect: { overrides: [{ taskId: "relocate_review_family_or_marriage_based_path", rationaleKey: "relocate_il_us.rationale.engaged_path" }] } },
    { id: "relocate_include_general_category_review", priority: 10, when: { fact: "relocation_purpose", in: ["study", "other_or_unsure"] }, effect: { includeTaskIds: ["relocate_review_us_visa_category_options"] } },
    { id: "relocate_time_departure_notice", priority: 30, when: { all: [{ fact: "departure_date", exists: true }, { fact: "time_abroad_expected", in: ["3_months_to_2_years", "over_2_years"] }] }, effect: { overrides: [{ taskId: "relocate_notify_nii_of_departure", timing: { kind: "planned", anchor: "departure_date", window: "before", labelKey: "relocate_il_us.timing.before_departure" } }] } },
    { id: "relocate_time_residency_review", priority: 30, when: { all: [{ fact: "departure_date", exists: true }, { fact: "time_abroad_expected", equals: "over_2_years" }] }, effect: { overrides: [{ taskId: "relocate_review_nii_residency_termination", timing: { kind: "planned", anchor: "departure_date", window: "after", labelKey: "relocate_il_us.timing.review_after_departure" } }] } }
  ],
  safety: { disclaimerKey: "relocate_il_us.safety.disclaimer", externalLinkNoticeKey: "relocate_il_us.safety.external" },
  demoScenarios: [
    { id: "relocate_demo_employment_offer", labelKey: "relocate_il_us.demo.employment_offer", initialFacts: { facts: { relocation_purpose: "employment", us_job_offer_status: "has_offer", time_abroad_expected: "over_2_years" } } },
    { id: "relocate_demo_marriage_based", labelKey: "relocate_il_us.demo.marriage_based", initialFacts: { facts: { relocation_purpose: "family_or_marriage", marital_status_for_relocation: "married_to_us_person", family_unit_departure_status: "entire_family_relocating" } } },
    { id: "relocate_demo_spouse_remaining", labelKey: "relocate_il_us.demo.spouse_remaining", initialFacts: { facts: { relocation_purpose: "employment", family_unit_departure_status: "spouse_or_child_remaining_in_israel", time_abroad_expected: "over_2_years" } } },
    { id: "relocate_demo_short_trip_only", labelKey: "relocate_il_us.demo.short_trip_only", initialFacts: { facts: { relocation_purpose: "other_or_unsure", time_abroad_expected: "under_3_months" } } },
    { id: "relocate_demo_unknown_context", labelKey: "relocate_il_us.demo.unknown_context", initialFacts: { facts: {} } }
  ]
};
