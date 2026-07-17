# Candidate event proposal: `expecting_child`

**Status:** `candidate_only` / `needs_human_review` / non-production

## Status and scope

- Jurisdiction and language: `IL` / English
- Contract-defined event ID: `expecting_child`, as confirmed in repository
  contracts. This proposal does not establish, activate, or imply an approved
  runtime event pack.
- Purpose: Candidate research for a calm, source-verification-oriented planning
  flow around an expected child; not a statement of rights or procedure.
- Non-goals: Eligibility, legal, medical, tax, or financial conclusions;
  autonomous action; live retrieval; source-card registry; runtime implementation.

## Candidate metadata and typed context facts

All IDs, labels, prompts, and values below are draft-only. Sensitive facts are
not to be retained or inferred; an unknown or skipped fact remains absent.

| Draft fact ID | Type | Sensitive | Why it matters | Evidence state |
| --- | --- | --- | --- | --- |
| `due_date` | string | yes | Enables only relative planned-timing labels; no date estimate is made. | supported by timing contract; personal value unknown |
| `work_status` | string | yes | Can select a verification-only National Insurance review prompt. Values proposed: `salaried`, `self_employed`, `other`. | candidate source support; content review required |
| `prenatal_care_contact_status` | string | yes | An explicit `not_shared` response can select an optional professional-contact follow-up without concluding anything about care status. Proposed values: `known`, `not_shared`. | candidate source support; personal value unknown |
| `event_stage` | string (`confirmed_transition`) | yes | Explicitly confirms whether a transition has occurred; required for post-transition operational tasks. Proposed confirmed value: `birth_occurred`. | contract-supported; personal value unknown |
| `newborn_name_registered` | boolean | yes | After birth only, can select a registration-status verification prompt. | candidate source support; personal value unknown |

## Candidate source references

- `ec_nii_maternity_allowance_overview` and
  `ec_nii_maternity_allowance_conditions`: may support only
  `ec_review_maternity_allowance_path` as an official-information review.
- `ec_kolzchut_maternity_allowance`: secondary terminology/process aid only;
  never sole support for a material claim. Its NII primary cards remain required.
- `ec_nii_birth_grant`: may support only
  `ec_review_birth_grant_information` as a narrow birth-grant
  official-information review; it is not a payment or eligibility assertion.
- `ec_kolzchut_birth_grant`: secondary topic map only; its NII primary card
  remains required for any material claim.
- `ec_piba_newborn_name`: may support only
  `ec_verify_newborn_name_registration` as a post-birth verification prompt.
- `ec_kolzchut_birth_notification`: secondary research aid only; a direct
  primary birth-notification procedure remains `unresolved`.
- `ec_moh_prenatal_follow_up`: may support only
  `ec_confirm_prenatal_care_contact` as a prompt to use a qualified care team.

Every reference remains `needs_review`; no candidate source card is a runtime
`SourceCardSchema` object.

## Candidate rules and task templates

Rule notation and timing shapes mirror the existing contracts but are never
passed to a validator or compiler in this packet.

| Draft rule ID | Explicit condition | Effect | Uncertainty / source dependency |
| --- | --- | --- | --- |
| `ec_include_maternity_allowance_review` | `{ "fact": "work_status", "in": ["salaried", "self_employed"] }` | include `ec_review_maternity_allowance_path` | No eligibility inference; both NII cards need review. |
| `ec_include_prenatal_contact_follow_up` | `{ "fact": "prenatal_care_contact_status", "equals": "not_shared" }` | include `ec_confirm_prenatal_care_contact` | `not_shared` is an explicit candidate response meaning the fact was intentionally not provided; it is not a conclusion about care. Medical/safety reviewer must approve. |
| `ec_include_newborn_registration_review` | `{ "all": [{ "fact": "event_stage", "equals": "birth_occurred" }, { "fact": "newborn_name_registered", "equals": false }] }` | include `ec_verify_newborn_name_registration` | Candidate Population Authority support; direct birth-notification procedure remains unresolved. |
| `ec_include_birth_grant_information_review` | `{ "fact": "event_stage", "equals": "birth_occurred" }` | include `ec_review_birth_grant_information` | No eligibility inference; NII source requires review. |

| Draft task ID | Action summary | Typed timing | Candidate source IDs | Dependencies | Verification state | Safety note |
| --- | --- | --- | --- | --- | --- | --- |
| `ec_review_maternity_allowance_path` | Review the official NII maternity-allowance information and, if relevant, confirm the applicable process with NII and the employer. | `{ "kind": "planned", "anchor": "due_date", "window": "before", "labelKey": "expecting_child.candidate.before_due_date" }` | `ec_nii_maternity_allowance_overview`, `ec_nii_maternity_allowance_conditions` | `unknown` | verify with official source; not a determination | Do not state eligibility, amount, leave duration, deadline, or employer duty. |
| `ec_confirm_prenatal_care_contact` | Optional planning follow-up: if helpful, identify a qualified prenatal-care contact for questions about your personal care. | `{ "kind": "general", "labelKey": "expecting_child.candidate.general_verification" }` | `ec_moh_prenatal_follow_up` | `unknown` | verify with qualified care team | Optional and non-urgent; not medical advice and not a conclusion about care status, diagnosis, schedule, or treatment. |
| `ec_verify_newborn_name_registration` | After the explicitly confirmed transition, verify whether the newborn's name was registered and review the official authority page for the applicable path. | `{ "kind": "general", "labelKey": "expecting_child.candidate.general_verification" }`; candidate applicability: `{ "kind": "confirmed_transition", "requiredFacts": [{ "factId": "event_stage", "equals": "birth_occurred" }] }` | `ec_piba_newborn_name`, `ec_kolzchut_birth_notification` (secondary only) | `unknown` | verify with Population and Immigration Authority | Do not assume a hospital birth, GovID access, parentage, documents, or online eligibility. |
| `ec_review_birth_grant_information` | After the explicitly confirmed transition, review official NII birth-grant information to understand whether a current official follow-up may be relevant. | `{ "kind": "general", "labelKey": "expecting_child.candidate.general_verification" }`; candidate applicability: `{ "kind": "confirmed_transition", "requiredFacts": [{ "factId": "event_stage", "equals": "birth_occurred" }] }` | `ec_nii_birth_grant`, `ec_kolzchut_birth_grant` (secondary only) | `unknown` | verify with NII | Do not state entitlement, payment, amount, automatic payment, claim requirement, residency, or birth-location outcome. |

## Eligibility and dependency uncertainty

- Employment status alone does not establish any NII result. Qualifying periods,
  contributions, work cessation, family circumstances, and exceptions are not
  modeled and must not be inferred.
- A due date is a planning anchor only. It does not establish a birth date,
  pregnancy stage, medical need, urgency, or confirmed transition.
- `event_stage = birth_occurred` is the candidate pack-specific confirmed
  transition fact. It must be explicitly stated and typed; it is not inferred
  from a due date, current date, elapsed time, schedule, estimate, or milestone.
- `newborn_name_registered` is meaningful only after the confirmed transition.
- No task can assume hospital birth, Israeli citizenship/residency, GovID,
  parentage, a particular HMO, or available documents.
- The direct primary birth-notification / registration procedure is
  `unresolved`. This packet does not select or describe a particular
  registration route.

## Candidate UX note: explicit transition update

- Ordinary prenatal intake does not need to ask “Has the birth occurred?”
- `event_stage` remains absent unless the person explicitly states that the
  birth occurred or intentionally updates their event status. It is never
  inferred from timing-related data.
- The intended future UX is a user-controlled update such as “Update your life
  event: the birth has occurred.” This is a proposal only; no UI behavior is
  implemented or authorized here.
- Only after that explicit confirmation may this proposal ask the neutral
  newborn-name-registration question or surface post-transition verification
  tasks.

## Safety labels and notes

- `candidate_verify_official_source`: The user must confirm the current
  official information; the product does not decide applicability.
- `candidate_contact_qualified_professional`: Medical or care questions go to a
  qualified professional, not the roadmap.
- `candidate_unknown_is_unknown`: Skip and missing answers remain absent; rules
  only match stated values. `not_shared` is an explicit candidate response, not
  an inferred negative fact.
- Candidate disclaimer key: `expecting_child.candidate.disclaimer` — proposed
  meaning only: educational planning support, not medical, legal, tax,
  financial, or eligibility advice. Exact copy needs safety review.
- Candidate external-link key: `expecting_child.candidate.external_notice` —
  proposed meaning only: verify source currency and applicability before acting.

## Proposed minimal question set

Prompt wording is draft-only and needs content/safety approval.

| Question ID | Fact ID | Candidate question | Decision-changing effect | Unknown/skip behavior | Evidence state |
| --- | --- | --- | --- | --- | --- |
| `ec_due_date_question` | `due_date` | “If you want to share it, what is your expected due date?” | Changes timing label from general verification to a relative before/after-due-date label for candidate tasks. | Fact remains absent; timing stays general; no date inferred. | contract-supported; no policy claim |
| `ec_work_status_question` | `work_status` | “Which best describes your work situation: salaried, self-employed, or another situation?” | Selects or omits the verification-only NII maternity-allowance information task; it never determines entitlement. | Fact remains absent; task is not selected; explicit follow-up is “review only if the user later chooses to share work status.” | candidate-source support; needs review |
| `ec_prenatal_care_contact_question` | `prenatal_care_contact_status` | “Would you like to share whether you have a prenatal-care contact for questions about your personal care?” | An explicit `not_shared` response selects the optional planning follow-up; `known` avoids duplicating it. | Skip remains absent and selects nothing. `not_shared` means only that this fact was intentionally not shared; it does not mean no care or a care failure. | candidate-source support; needs clinical review |
| `ec_event_stage_question` | `event_stage` | “Has the birth occurred?” | Only an explicit statement or intentional event-status update may set `birth_occurred` and select post-transition operational verification tasks. | Ordinary prenatal intake need not ask this; the fact remains absent unless explicitly confirmed, and no transition is inferred. | contract-supported; source/content review required |
| `ec_newborn_name_registration_question` | `newborn_name_registered` | “After the birth is confirmed, has the newborn’s name been registered?” | If `false`, selects an official registration-status verification prompt; the separate official NII birth-grant information review is controlled by the confirmed transition fact, not registration status. | Ask only after the confirmed transition; skip remains absent and produces no registration conclusion. No route is assumed. | candidate-source support; direct primary birth-notification / registration procedure unresolved |

## Seeded demo scenarios (draft-only)

These are not runtime fixtures and do not represent real people, eligibility, or
approved copy. Values deliberately avoid government ID, employer, health, or
document information.

| Scenario ID | Initial facts | Expected candidate selection for reviewer inspection | Known unknowns |
| --- | --- | --- | --- |
| `ec_demo_working_with_due_date` | `{ "due_date": "2026-11-01", "work_status": "salaried", "prenatal_care_contact_status": "known" }` | `ec_review_maternity_allowance_path` only; timing is relative to stated due date. | All eligibility, claim, amount, and care facts. |
| `ec_demo_unknown_context` | `{}` | No task is selected: unknown context does not create eligibility, a negative fact, or an optional follow-up. | Due date, work, care contact, birth stage, and all legal/medical facts. |
| `ec_demo_due_date_without_transition` | `{ "due_date": "2026-11-01", "newborn_name_registered": false }` | No post-transition operational task; a due date cannot prove a transition. | Whether a transition occurred and all registration facts. |
| `ec_demo_confirmed_transition_unregistered_name` | `{ "event_stage": "birth_occurred", "newborn_name_registered": false }` | `ec_verify_newborn_name_registration` and `ec_review_birth_grant_information`; both are narrowly scoped, verification-only candidates. | Identity, relationship, registration route, official process applicability, and every eligibility fact. |

## Human-review decisions required

1. Disposition every evidence card, including source currency and whether each
   dynamic source remains appropriate.
2. Approve/reject all source-claim-to-task linkages, especially the secondary
   Kol Zchut / primary-source relationship and direct birth-notification gap.
3. Approve/reject all fact sensitivity, questions, task summaries, rules,
   timing labels, verification labels, safety copy, and scenarios.
4. Confirm/reject the candidate `event_stage = birth_occurred` transition
   representation and all related question/rule/task applicability.
5. Decide whether medical-adjacent content remains in this event pack, and have
   an appropriate qualified reviewer approve any retained wording.
6. Authorize a separate approved-pack implementation only after the above;
   this document gives no implementation authorization.
