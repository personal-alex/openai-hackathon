# Candidate event proposal: `expecting_child`

**Status:** `candidate_only` / `needs_human_review` / non-production

## Status and scope

- Jurisdiction and language: `IL` / English
- Canonical runtime event ID: `expecting_child` (existing; no ID is added)
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
| `prenatal_care_contact_known` | boolean | yes | Can select a professional-contact follow-up rather than infer care status. | candidate source support; personal value unknown |
| `newborn_name_registered` | boolean | yes | After birth only, can select a registration-status verification prompt. | candidate source support; personal value unknown |

## Candidate source references

- `ec_nii_maternity_allowance_overview` and
  `ec_nii_maternity_allowance_conditions`: may support only
  `ec_review_maternity_allowance_path` as an official-information review.
- `ec_nii_birth_grant`: may support only
  `ec_review_post_birth_nii_information` as a post-birth official-information
  review; it is not a payment or eligibility assertion.
- `ec_piba_newborn_name`: may support only
  `ec_verify_newborn_name_registration` as a post-birth verification prompt.
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
| `ec_include_prenatal_contact_follow_up` | `{ "fact": "prenatal_care_contact_known", "exists": false }` | include `ec_confirm_prenatal_care_contact` | Medical/safety reviewer must approve. |
| `ec_include_newborn_registration_review` | `{ "all": [{ "fact": "newborn_name_registered", "equals": false }, { "fact": "due_date", "exists": true }] }` | include `ec_verify_newborn_name_registration` | Draft proxy for post-birth stage is inadequate; implementation needs an approved event-stage fact or different rule. |
| `ec_include_post_birth_nii_review` | `{ "fact": "newborn_name_registered", "exists": true }` | include `ec_review_post_birth_nii_information` | Newborn registration is not a benefit proxy; human reviewer must approve/reject the linkage. |

| Draft task ID | Action summary | Typed timing | Candidate source IDs | Dependencies | Verification state | Safety note |
| --- | --- | --- | --- | --- | --- | --- |
| `ec_review_maternity_allowance_path` | Review the official NII maternity-allowance information and, if relevant, confirm the applicable process with NII and the employer. | `{ "kind": "planned", "anchor": "due_date", "window": "before", "labelKey": "expecting_child.candidate.before_due_date" }` | `ec_nii_maternity_allowance_overview`, `ec_nii_maternity_allowance_conditions` | `unknown` | verify with official source; not a determination | Do not state eligibility, amount, leave duration, deadline, or employer duty. |
| `ec_confirm_prenatal_care_contact` | Identify a qualified prenatal-care contact and use the care team/HMO for questions about personal care. | `{ "kind": "general", "labelKey": "expecting_child.candidate.general_verification" }` | `ec_moh_prenatal_follow_up` | `unknown` | verify with qualified care team | Not medical advice; no diagnosis, care schedule, or treatment recommendation. |
| `ec_verify_newborn_name_registration` | After birth, verify whether the newborn's name was registered and review the official authority page for the applicable path. | `{ "kind": "planned", "anchor": "due_date", "window": "after", "labelKey": "expecting_child.candidate.after_due_date" }` | `ec_piba_newborn_name` | `unknown` | verify with Population and Immigration Authority | Do not assume a hospital birth, GovID access, parentage, documents, or online eligibility. |
| `ec_review_post_birth_nii_information` | After birth, review the official NII birth-grant information to understand whether an official follow-up is relevant. | `{ "kind": "planned", "anchor": "due_date", "window": "after", "labelKey": "expecting_child.candidate.after_due_date" }` | `ec_nii_birth_grant` | `unknown` | verify with NII | Do not state entitlement, automatic payment, claim requirement, amount, residency, or birth-location outcome. |

## Eligibility and dependency uncertainty

- Employment status alone does not establish any NII result. Qualifying periods,
  contributions, work cessation, family circumstances, and exceptions are not
  modeled and must not be inferred.
- A due date is a planning anchor only. It does not establish a birth date,
  pregnancy stage, medical need, or urgency.
- `newborn_name_registered` is meaningful only after birth. The draft condition
  using `due_date` is intentionally marked inadequate and must not be adopted
  without an approved stage representation.
- No task can assume hospital birth, Israeli citizenship/residency, GovID,
  parentage, a particular HMO, or available documents.

## Safety labels and notes

- `candidate_verify_official_source`: The user must confirm the current
  official information; the product does not decide applicability.
- `candidate_contact_qualified_professional`: Medical or care questions go to a
  qualified professional, not the roadmap.
- `candidate_unknown_is_unknown`: Skip and missing answers remain absent; rules
  only match stated values or explicit absence.
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
| `ec_prenatal_care_contact_question` | `prenatal_care_contact_known` | “Do you already have a prenatal-care contact you can ask about your personal care?” | If absent/unknown, selects a professional-contact follow-up; if `true`, avoids duplicating it. | Skip is absent, not `false`; the draft follow-up task may appear only under the explicit missing-fact rule. | candidate-source support; needs clinical review |
| `ec_newborn_name_registration_question` | `newborn_name_registered` | “After birth, was the newborn’s name registered at the hospital?” | If `false`, selects an official registration-path verification prompt; if `true`, can select a separate official NII information review only if that linkage is human-approved. | Do not ask before the post-birth stage; skip remains absent and produces no registration conclusion. | candidate-source support; stage design unresolved |

## Seeded demo scenarios (draft-only)

These are not runtime fixtures and do not represent real people, eligibility, or
approved copy. Values deliberately avoid government ID, employer, health, or
document information.

| Scenario ID | Initial facts | Expected candidate selection for reviewer inspection | Known unknowns |
| --- | --- | --- | --- |
| `ec_demo_working_with_due_date` | `{ "due_date": "2026-11-01", "work_status": "salaried", "prenatal_care_contact_known": true }` | `ec_review_maternity_allowance_path`; timing is relative to stated due date. | All eligibility, claim, amount, and care facts. |
| `ec_demo_unknown_context` | `{}` | `ec_confirm_prenatal_care_contact` only if reviewer accepts an explicit-absence rule; no benefit or registration task. | Due date, work, care contact, birth stage, and all legal/medical facts. |
| `ec_demo_post_birth_unregistered_name` | `{ "due_date": "2026-06-01", "newborn_name_registered": false }` | `ec_verify_newborn_name_registration`; marked as stage-modeling review required. | Actual birth, identity, relationship, hospital path, documents, and online availability. |

## Human-review decisions required

1. Disposition every evidence card, including source currency and whether each
   dynamic source remains appropriate.
2. Approve/reject all source-claim-to-task linkages, especially the draft
   post-birth NII linkage and the inadequate registration-stage proxy.
3. Approve/reject all fact sensitivity, questions, task summaries, rules,
   timing labels, verification labels, safety copy, and scenarios.
4. Decide whether medical-adjacent content remains in this event pack, and have
   an appropriate qualified reviewer approve any retained wording.
5. Authorize a separate approved-pack implementation only after the above;
   this document gives no implementation authorization.
