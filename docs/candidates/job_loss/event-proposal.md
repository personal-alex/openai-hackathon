# Candidate event proposal: `job_loss`

**Status:** `candidate_only` / `needs_human_review` / non-production

## Status and scope

- Candidate pack version: `il-job-loss-candidate-v0.1`
- Jurisdiction and language: `IL` / English
- Contract-defined event ID: `job_loss`. This proposal neither adds an event ID
  nor activates a runtime pack or registry entry.
- In-scope persona: a recently unemployed person in Israel whose last role was
  salaried, with conservative verification branches for self-employed, mixed,
  or unknown arrangements.
- Purpose: a calm, practical roadmap that helps a person review immediate
  official routes, preserve records/questions, and regain momentum toward a
  next role. It is educational planning support, not an outcome or advice.
- Non-goals: eligibility/benefit/severance calculation, legal finding,
  employer-fault conclusion, payment prediction, form submission, live web
  retrieval, provider recommendation, or runtime implementation.

## Candidate metadata and typed context facts

All IDs, values, prompts, and labels are draft-only. Unknown and skipped facts
remain absent; no date, reason, work history, insurance history, residency,
salary, age, or employment status is inferred.

| Draft fact ID | Type | Sensitive | Proposed values | Decision-changing purpose | Evidence state |
| --- | --- | --- | --- | --- | --- |
| `employment_stage` | string, proposed `confirmed_transition` role | yes | `ended`, `notice_given`, `not_ending` | Separates active post-end steps from a clearly labelled preview. Only an explicit `ended` answer may satisfy a future post-end applicability gate. | Candidate product decision; needs review. |
| `event_date` | string | yes | an explicitly supplied employment-end date | Lets event-relative timing render only when the person chooses to provide a date. It never establishes that employment ended. | Candidate product decision; needs review. |
| `work_arrangement` | string | yes | `salaried`, `self_employed`, `both` | Selects the standard salaried official-route review or a verification-required branch. | NII conditions page is a bounded primary input; needs review. |
| `employment_service_registration` | string | yes | `registered`, `not_registered` | Selects registration prompt vs. follow-official-instructions prompt. | NII primary input; needs review. |
| `employment_end_confirmation` | string | yes | `has`, `does_not_have` | Changes records wording and adds a verification prompt; does not determine document completeness. | Candidate process/records design; needs review. |
| `unemployment_claim_status` | string | yes | `submitted`, `not_submitted` | De-emphasizes claim-route review after an explicit submitted response; does not infer outcome. | NII primary input; needs review. |
| `initial_focus` | string | no | `rights_records`, `official_route`, `next_role`, `everything` | Reorders supporting tasks; never removes the active official-route review. | Candidate UX decision; needs review. |
| `employment_information_status` | string | yes | `has_end_letter_and_pay_info`, `missing_or_unsure` | Changes the claim-information prompt from organize to verify-current-requirements. | NII Form 100 source is narrow/legacy; needs review. |

## Candidate source references

The source IDs below are candidate-only cards in
[the evidence ledger](evidence-ledger.md). Every card is `needs_review`.

- Primary operational: `jl_nii_employment_service_registration_reporting`,
  `jl_nii_submit_unemployment_claim`, `jl_nii_unemployment_conditions`, and
  `jl_nii_claim_documents_form100`.
- Primary navigation/rights candidates: `jl_gov_between_jobs`,
  `jl_gov_employment_service_registration`,
  `jl_gov_unemployment_benefits_service`, `jl_employment_service_home`,
  `jl_gov_advance_notice`, `jl_gov_severance`, and
  `jl_gov_disciplinary_hearing`.
- Required secondary cross-checks: `jl_kolzchut_unemployment_benefits`,
  `jl_kolzchut_employment_service_registration`,
  `jl_kolzchut_employment_service_reporting`, `jl_kolzchut_employment_end`,
  `jl_kolzchut_advance_notice`, `jl_kolzchut_severance`,
  `jl_kolzchut_hearing`, and `jl_kolzchut_pension`.
  They are not standalone support for operational/rules/rights claims.

## Candidate roadmap: three lanes

### 1. Handle immediate official steps

| Draft task ID | Candidate action summary | Typed timing | Candidate source IDs | Dependencies | Verification state / safety note |
| --- | --- | --- | --- | --- | --- |
| `jl_register_employment_service` | Register with the Employment Service after employment has ended. Registration is an important early step; review the current official instructions and follow-up requirements before acting. | `{ "kind": "event_relative", "anchor": "event_date", "window": "immediate", "labelKey": "job_loss.candidate.after_employment_end" }` | `jl_nii_employment_service_registration_reporting`, `jl_nii_submit_unemployment_claim` | Future applicability: `confirmed_transition(employment_stage = ended)`; `work_arrangement = salaried`; `employment_service_registration = not_registered` | Uses current contract-shaped timing; it does not create or infer an employment-end date. Verify the current official route. Do not state a personal deadline, appointment, payment, or eligibility result. |
| `jl_review_unemployment_claim_route` | Review the official unemployment-benefit process and current conditions. Eligibility depends on individual circumstances, which this planner does not determine. | `{ "kind": "event_relative", "anchor": "event_date", "window": "immediate", "labelKey": "job_loss.candidate.review_after_end" }` | `jl_nii_submit_unemployment_claim`, `jl_nii_unemployment_conditions` | Future applicability: `confirmed_transition(employment_stage = ended)`; `work_arrangement = salaried`. Exclude/de-emphasize only after explicit `unemployment_claim_status = submitted`. | Uses current contract-shaped timing; it does not create or infer an employment-end date. An absent claim answer selects a review, not an assertion that no claim was submitted. Verification required. No claim outcome, benefit amount, qualifying-period, or payment-start claim. |
| `jl_prepare_claim_route_information` | Keep the employment-end letter and wage or employment information available. Check the current official claim page for requirements in your case. | `{ "kind": "general", "labelKey": "job_loss.candidate.prepare_information" }` | `jl_nii_claim_documents_form100` | Future applicability: `confirmed_transition(employment_stage = ended)`; `work_arrangement = salaried` | The source is legacy-path material. This is not a complete document checklist or a statement that information is sufficient. |
| `jl_follow_employment_service_instructions` | After you have registered, follow the Employment Service’s current instructions for your situation. | `{ "kind": "general", "labelKey": "job_loss.candidate.follow_current_instructions" }` | `jl_nii_employment_service_registration_reporting`, `jl_employment_service_home` | Future applicability: `confirmed_transition(employment_stage = ended)`; `work_arrangement = salaried`; `employment_service_registration = registered` | Verification required. Do not invent reporting days, appointments, or outcome. |
| `jl_verify_nonstandard_benefit_route` | Your work arrangement or route may not match the standard salaried unemployment path. Review the current official information before assuming a benefits route applies. | `{ "kind": "general", "labelKey": "job_loss.candidate.verify_route" }` | `jl_nii_unemployment_conditions` | Future applicability: `confirmed_transition(employment_stage = ended)`; work arrangement is explicitly `self_employed`/`both` or remains unknown | Verification-only state; no detailed self-employment, mixed-income, or eligibility workflow. |

### 2. Understand rights and records to review

| Draft task / card ID | Candidate wording | What to keep / source posture | Safety boundary |
| --- | --- | --- | --- |
| `jl_review_notice_and_severance` | Employment endings often involve written notice and, in some situations, severance-pay questions. Keep the written notice and employment records, then review current official guidance. | Written notice, employment agreement, final communication. Candidate cards: `jl_gov_advance_notice`, `jl_gov_severance`; Kol Zchut cross-checks only. | Do not say the person is entitled to severance, has a particular notice period, or that the employer acted unlawfully. Supplied official pages require human re-check. |
| `jl_review_ending_records` | Keep the final payslip, employment agreement, pension/provident-fund information, and written correspondence about the employment ending. These records can help identify questions to verify. | Final payslip, agreement, pension/provident details, correspondence. Candidate navigation: `jl_gov_between_jobs`; secondary `jl_kolzchut_employment_end` / `jl_kolzchut_pension`. | No completeness, entitlement, withdrawal, tax, or settlement conclusion. |
| `jl_review_final_settlement_questions` | If the final settlement, unused vacation, pension/provident-fund information, or employment-end records are unclear, identify the question and verify the current official guidance or obtain individual advice. | Preserve the relevant record and factual timeline. | This is a verification/advice trigger, not a legal conclusion or a detailed dispute workflow. |
| `jl_verify_pre_dismissal_process_if_relevant` | If employment has not ended and a hearing, notice, or dismissal process is unclear, consider reviewing the official information or obtaining individual advice before treating it as resolved. | Written notice or hearing communication if the person has it. Candidate cards: `jl_gov_disciplinary_hearing`, `jl_kolzchut_hearing`. | Not shown as a normal post-loss task; does not claim that a hearing was required or mishandled. |

Candidate individual-advice triggers: unpaid salary, discrimination, disputed
dismissal, unclear final payment/settlement, unclear notice, or unclear
employment-ending paperwork. These are prompts to seek appropriate individual
help, not findings that a breach occurred and not referrals to paid providers.

### 3. Start rebuilding momentum

These are practical planning tasks, not official-rights claims. They use no
source card, make no provider recommendation, and should be marked as practical
guidance in a future approved pack.

| Draft task ID | Candidate action summary | Typed timing | Safety label |
| --- | --- | --- | --- |
| `jl_update_resume` | Capture your latest role, achievements, skills, and references while details are fresh. A focused first draft is enough; refine it later. | `{ "kind": "general", "labelKey": "job_loss.candidate.when_ready" }` | Practical guidance; not a job-outcome claim. |
| `jl_refresh_professional_presence` | Review your LinkedIn profile, portfolio, and contact details. Focus on channels that fit the kind of role you want next. | `{ "kind": "general", "labelKey": "job_loss.candidate.when_ready" }` | Practical guidance; no platform/provider endorsement. |
| `jl_make_small_outreach_plan` | List a few people who know your work and could help you reconnect with relevant opportunities. Start with one or two conversations. | `{ "kind": "general", "labelKey": "job_loss.candidate.when_ready" }` | Practical guidance; no lead generation or promise of work. |
| `jl_consider_support` | Employment counsellors, career coaches, professional associations, community programs, and trusted peers can offer different kinds of support. Consider what would help you. | `{ "kind": "general", "labelKey": "job_loss.candidate.when_ready" }` | No recommendation, ranking, affiliation, or promotion of any provider. |

## Candidate rules and deterministic prioritization

Rule notation mirrors the existing contract but remains documentation only; it
is not passed to a validator/compiler.

| Draft rule ID | Explicit condition | Candidate effect | Uncertainty / source dependency |
| --- | --- | --- | --- |
| `jl_preview_before_employment_end` | `{ "fact": "employment_stage", "in": ["notice_given", "not_ending"] }` | Present a preview state for official-route items; retain optional records/resume preparation. | No task is due now; exact preview wording needs safety review. |
| `jl_include_salaried_official_route` | `{ "all": [{ "fact": "employment_stage", "equals": "ended" }, { "fact": "work_arrangement", "equals": "salaried" }] }` | Include register, claim-route review, claim-information preparation, rights/records, and momentum tasks. | NII sources require human source/claim approval. |
| `jl_include_registration_prompt` | `{ "all": [{ "fact": "employment_stage", "equals": "ended" }, { "fact": "work_arrangement", "equals": "salaried" }, { "fact": "employment_service_registration", "equals": "not_registered" }] }` | Priority 10: `jl_register_employment_service`. | Only an explicit `not_registered` response selects it; do not use an absent answer to infer a date, appointment, or outcome. |
| `jl_include_follow_official_instructions` | `{ "all": [{ "fact": "employment_stage", "equals": "ended" }, { "fact": "work_arrangement", "equals": "salaried" }, { "fact": "employment_service_registration", "equals": "registered" }] }` | Replace/de-emphasize initial registration with `jl_follow_employment_service_instructions`. | Only the standard candidate route may select this task; official instructions must be current. |
| `jl_include_nonstandard_route_verification` | `{ "all": [{ "fact": "employment_stage", "equals": "ended" }, { "not": { "fact": "work_arrangement", "equals": "salaried" } }] }` | Exclude standard salaried claim instructions; include `jl_verify_nonstandard_benefit_route` plus momentum tasks. | Covers explicit self-employed/mixed responses and an absent/unknown arrangement without turning unknown into a negative fact. No detailed nonstandard workflow. |
| `jl_deemphasize_submitted_claim` | `{ "all": [{ "fact": "work_arrangement", "equals": "salaried" }, { "fact": "unemployment_claim_status", "equals": "submitted" }] }` | Remove/de-emphasize initial claim-route review; retain official-instruction, records, and momentum tasks. | Only an explicit submitted response changes the task. It does not infer acceptance, payment, or completeness. |
| `jl_adjust_records_for_missing_end_confirmation` | `{ "fact": "employment_end_confirmation", "equals": "does_not_have" }` | Replace any document-completeness implication with a bounded prompt to identify what is unclear and verify the current official route or obtain individual advice. | Candidate records-design decision; no claim that a particular document is legally required. |
| `jl_adjust_information_prompt_when_unsure` | `{ "fact": "employment_information_status", "equals": "missing_or_unsure" }` | Change claim-information wording from organise to verify current requirements for the person’s route. | Narrow legacy-source dependency; no complete checklist or document-sufficiency conclusion. |
| `jl_focus_reordering` | `{ "fact": "initial_focus", "equals": "next_role" }` | Raise momentum tasks after any active official-route priority items. | Must never remove time-sensitive official-route review. |

Proposed sort: active official registration (priority 10), official claim-route
review (20), information/records verification (30), rights/records review (40),
then practical momentum (50). User focus may reorder priorities 30–50 only.

## Preview versus active behavior

- **Employment ended:** display the active candidate route for a stated
  salaried person. “Start with the time-sensitive items, then work through the
  rest” is proposed product copy, not a personal deadline claim.
- **Notice given / employment not ended:** show a clearly labelled preview:
  “We’re here with you. These are steps that may become relevant once your
  employment ends. We’ll help you work through the details when you’re ready.”
  Registration is not shown as due now. Records and resume preparation may be
  presented as optional planning guidance.
- **Registered salaried route:** de-emphasize initial registration; do not assume
  appointments, reporting dates, or results.
- **Self-employed, mixed, or unknown:** do not show standard salaried-benefit
  instructions as applicable. Use a verification-required benefit state and
  retain practical momentum guidance.

## Proposed minimal question set

All prompt copy is draft-only and follows one-question-at-a-time interaction.

| Question ID | Fact ID | Candidate question | Decision-changing effect | Unknown / skip behavior | Evidence state |
| --- | --- | --- | --- | --- | --- |
| `jl_employment_stage_question` | `employment_stage` | “Has your employment already ended, have you been given notice, or is it not ending yet?” | Chooses active route vs. preview; prevents treating registration as due before the stated end. | Keep fact absent; show only neutral general planning and a follow-up if the user wants to continue. | Candidate product/safety decision. |
| `jl_event_date_question` | `event_date` | “Would you like to add the date your employment ended?” | Lets eligible event-relative items use a date-aware timing presentation after an explicit ended state; it does not select a route or establish the transition. | Keep fact absent; task timing remains general/verification-oriented. | Candidate product/safety decision; show only after explicit `employment_stage = ended`. |
| `jl_work_arrangement_question` | `work_arrangement` | “Was your work salaried, self-employed, or a mix of both?” | Selects standard salaried-route review vs. verification-required state. | Keep fact absent; do not assume standard route. | NII conditions input; needs review. |
| `jl_employment_service_registration_question` | `employment_service_registration` | “Have you registered with the Employment Service?” | Selects initial registration prompt vs. follow-current-instructions prompt. | Keep fact absent; do not infer a reporting requirement. | NII primary input; needs review. |
| `jl_end_confirmation_question` | `employment_end_confirmation` | “Do you have written confirmation of how and when the employment ended?” | Changes records wording and shows a bounded verify/ask-for-clarification prompt. | Keep fact absent; do not infer document completeness. | Candidate records design. |
| `jl_claim_status_question` | `unemployment_claim_status` | “Have you submitted an unemployment-benefit claim?” | De-emphasizes initial claim-route review after explicit submission. | Keep fact absent; no outcome is inferred. | NII primary input; needs review. |
| `jl_initial_focus_question` | `initial_focus` | “What would be most helpful to focus on first: rights and paperwork, the official route, finding your next role, or a bit of everything?” | Reorders supporting tasks only; active official items remain visible. | Default ordering remains; no preference inferred. | Candidate UX decision. |
| `jl_information_status_question` | `employment_information_status` | “Do you have an employment-end letter and recent pay information, or are you unsure what you have?” | Changes information-preparation wording and verification state. | Keep fact absent; no assumption about missing records. | Narrow legacy NII document support; needs review. |

## Why this appears / why this changed — candidate explanation keys

- `job_loss.candidate.reason.employment_ended_salaried`: The person explicitly
  said work ended and described a salaried arrangement; this selects a review of
  official registration/claim information, not an eligibility result.
- `job_loss.candidate.reason.registration_not_registered`: The person explicitly
  said they had not registered, so the roadmap raises the official route for
  review.
- `job_loss.candidate.reason.nonstandard_arrangement`: A self-employed or
  mixed arrangement does not safely match the candidate standard salaried path;
  only a verification prompt appears.
- `job_loss.candidate.reason.pre_end_preview`: Employment has not explicitly
  ended, so future official steps are preview-only.
- `job_loss.candidate.reason.user_focus`: The chosen focus reorders supporting
  items but does not remove active official-route items.

## Eligibility, dependency, and safety uncertainty

- Never infer the reason employment ended, qualifying history, residency, age,
  salary, benefit amount, payment start, severance amount, documents, or claim
  outcome.
- `employment_stage = ended` is an explicit user fact, not derived from notice,
  a date, a schedule, elapsed time, or a model inference. A notice is not proof
  that employment has ended.
- The standard official candidate path applies only to an explicitly stated
  salaried arrangement. Unknown, self-employed, and mixed arrangements remain
  verification-required.
- No detailed path is proposed for resignation, unpaid leave, contract end,
  multiple employers, continued part-time work, special occupations, work
  abroad, recent service, training, discrimination, unpaid salary, disputed
  dismissal, or unclear final settlement.
- Candidate safety keys: `job_loss.candidate.disclaimer` (educational planning,
  not legal/financial/eligibility advice),
  `job_loss.candidate.external_notice` (verify source currency/applicability),
  and `job_loss.candidate.verify_individual_route` (a personal route is
  unresolved). Exact wording requires human review.

## Human-review decisions required

1. Disposition and currency check for every evidence card, especially supplied
   inaccessible English `gov.il` URLs and the legacy Form 100 page.
2. Approval/rejection of each claim, task, timing, rule, documented online
   translation where a source is Hebrew,
   question, rationale key, safety label, and demo scenario.
3. Decision whether rights/records cards remain generic verification prompts or
   gain separately reviewed official subpage support.
4. Decision on whether/when to create a reviewed runtime pack. Any approved
   post-end task must use the existing explicit status-transition applicability
   gate; this candidate does not request a contract change.
5. Separate implementation authorization. This proposal grants none.
