# Job-loss candidate research dossier and evidence ledger

**Promotion status:** Hackathon-scope runtime promotion authorised on
**2026-07-17**, subject to the source-card completeness gate below. The product
owner’s approval is scoped to the bounded claims recorded on cards marked
`approved_for_hackathon`; it does not determine an individual outcome.

## Research posture

- Primary operational authority: Bituach Leumi / National Insurance Institute
  (NII), the Israeli Employment Service, and `gov.il` / Ministry of Labor.
- Approved public-rights cross-check: Kol Zchut. Product-owner review accepts
  it as an authoritative source for this Hackathon packet; retain its publisher
  as **Kol Zchut** rather than misrepresenting it as a government publisher.
  Hebrew source text may use a documented online translation, checked by the
  reviewer against the original, before it supports new English runtime copy.
- A current operational claim is proposed only where the cited official source
  supports it. Ambiguity, inaccessible pages, and personal qualification remain
  verification-required or deferred.

## Candidate source card: `jl_nii_employment_service_registration_reporting`

- Status: `approved_for_hackathon` (bounded runtime use only)
- Title: Registration and reporting at the Employment Service — Unemployment
- Publisher: Bituach Leumi / National Insurance Institute
- Canonical URL: https://www.btl.gov.il/English%20Homepage/Benefits/Unemployment%20Insurance/Pages/Pleasenote.aspx
- Authority level: first-party operational source
- Access / research date: 2026-07-17
- Review date: 2026-07-17
- Supported-claim summary: The English NII page says registration and reporting
  at the Employment Service are prerequisites for unemployment benefit and that
  reporting occurs on the days/times determined by the Employment Service.
- Applicable event/task IDs: `job_loss`; `jl_register_employment_service`,
  `jl_follow_employment_service_instructions`
- Limitations / non-claim: Does not establish that a person qualifies, their
  reporting date, appointment, payment, benefit amount, or individual route.
- Freshness risk: Employment Service operating instructions can change quickly.
- Individual verification / advice: Verify the current Employment Service
  instructions; do not infer a personal reporting obligation from this packet.
- Review owner / status: Hackathon product owner (explicit scope approval) / `approved_for_hackathon`
- Evidence notes: NII page lead and reporting section, accessed 2026-07-17.

## Candidate source card: `jl_nii_submit_unemployment_claim`

- Status: `approved_for_hackathon` (bounded runtime use only)
- Title: How to submit the claim — Unemployment
- Publisher: Bituach Leumi / National Insurance Institute
- Canonical URL: https://www.btl.gov.il/English%20Homepage/Benefits/Unemployment%20Insurance/Pages/submit-the-claim.aspx
- Authority level: first-party operational source
- Access / research date: 2026-07-17
- Review date: 2026-07-17
- Supported-claim summary: The page directs readers to report to the Employment
  Service promptly after employment ends before submitting a claim/documents;
  it identifies registration/reporting as prerequisites in its described route.
- Applicable event/task IDs: `job_loss`; `jl_register_employment_service`,
  `jl_review_unemployment_claim_route`
- Limitations / non-claim: Does not determine eligibility, claim outcome,
  deadline, submission method in every case, or the full document list.
- Freshness risk: Claim process and security-related service availability may
  change.
- Individual verification / advice: Review the current official route before
  acting; ask NII about case-specific requirements.
- Review owner / status: Hackathon product owner (explicit scope approval) / `approved_for_hackathon`
- Evidence notes: English page introduction, accessed 2026-07-17.

## Candidate source card: `jl_nii_unemployment_conditions`

- Status: `approved_for_hackathon` (bounded runtime use only)
- Title: Conditions of entitlement — Unemployment
- Publisher: Bituach Leumi / National Insurance Institute
- Canonical URL: https://www.btl.gov.il/English%20Homepage/Benefits/Unemployment%20Insurance/Conditionsofeligibility/Pages/default.aspx
- Authority level: first-party general-rights source
- Access / research date: 2026-07-17
- Review date: 2026-07-17
- Supported-claim summary: The page frames unemployment benefit around salaried
  employment and multiple conditions, and says the reason employment stopped
  can affect the payment start date.
- Applicable event/task IDs: `job_loss`; `jl_review_unemployment_claim_route`,
  `jl_verify_nonstandard_benefit_route`
- Limitations / non-claim: Never supports an eligibility finding, amount,
  qualifying-period conclusion, payment date, or conclusion about resignation,
  leave, or any other personal route.
- Freshness risk: Conditions and exceptions are legally/policy sensitive.
- Individual verification / advice: Verify with NII; seek individual advice if
  the work ending or status is disputed/unclear.
- Review owner / status: Hackathon product owner (explicit scope approval) / `approved_for_hackathon`
- Evidence notes: English page opening and work-termination section, accessed
  2026-07-17.

## Candidate source card: `jl_nii_claim_documents_form100`

- Status: `approved_for_hackathon` (bounded runtime use only)
- Title: What documents should I attach to the claim for unemployment benefit?
- Publisher: Bituach Leumi / National Insurance Institute
- Canonical URL: https://www.btl.gov.il/English%20Homepage/About/Frequent_questions/Coronavirus/Unemployment/Pages/mismacim.aspx
- Authority level: first-party operational source; legacy/Coronavirus path
- Access / research date: 2026-07-17
- Review date: 2026-07-17
- Supported-claim summary: The page says an employer sends Form 100 (a payroll
  abstract) and names an employer employment/pay certificate as a fallback in
  the stated circumstance.
- Applicable event/task IDs: `job_loss`; `jl_prepare_claim_route_information`
- Limitations / non-claim: Legacy path/title creates freshness risk. It does
  not establish a complete document checklist, who must submit what in every
  case, or that a person’s information is sufficient.
- Freshness risk: high — recheck current NII claim instructions before use.
- Individual verification / advice: Treat records as items to keep/review, not
  a guaranteed complete submission list.
- Review owner / status: Hackathon product owner (explicit scope approval) / `approved_for_hackathon`
- Evidence notes: English page’s Form 100 / BL-1514 text, accessed 2026-07-17.

## Candidate source card: `jl_gov_employment_service_registration`

- Status: `approved_for_hackathon` (bounded runtime corroboration)
- Title: Register to Employment Services
- Publisher: gov.il / Israeli Government
- Canonical URL: https://www.gov.il/en/service/register_to_employment_services
- Authority level: first-party operational source
- Access / research date: 2026-07-17
- Review date: 2026-07-17
- Supported-claim summary: The official service page describes initial online
  registration with the Israeli Employment Service and says online registration
  does not replace the local-office appointment described on the page.
- Applicable event/task IDs: `job_loss`; `jl_register_employment_service`
- Limitations / non-claim: Does not establish a personal appointment,
  reporting date, eligibility, deadline, payment, or benefit outcome.
- Freshness risk: service instructions can change.
- Individual verification / advice: Review the current official route before acting.
- Review owner / status: Hackathon product owner (explicit scope approval) / `approved_for_hackathon`
- Evidence notes: official English page reviewed 2026-07-17.

## Candidate source card: `jl_gov_unemployment_benefits_service`

- Status: `approved_for_hackathon` (bounded runtime corroboration)
- Title: Unemployment benefits service
- Publisher: gov.il / Israeli Government
- Canonical URL: https://www.gov.il/en/service/unemployment_benefits
- Authority level: first-party operational source
- Access / research date: 2026-07-17
- Review date: 2026-07-17
- Supported-claim summary: The official service page describes applying online
  for unemployment benefit and lists employment-end and employment/pay
  information among the materials to review for the route.
- Applicable event/task IDs: `job_loss`; `jl_review_unemployment_claim_route`,
  `jl_prepare_claim_route_information`
- Limitations / non-claim: Does not establish qualification, a complete
  document checklist, a deadline, payment, or a personal claim outcome.
- Freshness risk: service requirements can change.
- Individual verification / advice: Check the current official route for your situation.
- Review owner / status: Hackathon product owner (explicit scope approval) / `approved_for_hackathon`
- Evidence notes: official English page reviewed 2026-07-17.

## Candidate source card: `jl_employment_service_home`

- Status: `approved_for_hackathon` (bounded runtime corroboration)
- Title: Israeli Employment Service
- Publisher: Israeli Employment Service
- Canonical URL: https://www.taasuka.gov.il/
- Authority level: first-party operational source
- Access / research date: 2026-07-17
- Review date: 2026-07-17
- Supported-claim summary: The Israeli Employment Service site is the official
  service endpoint linked by NII for Employment Service job-search and
  reporting queries.
- Applicable event/task IDs: `job_loss`; `jl_follow_employment_service_instructions`
- Limitations / non-claim: Does not establish appointments, reporting dates,
  office access, required follow-up, or a personal route/outcome.
- Freshness risk: high — service instructions may vary.
- Individual verification / advice: Review the current service instructions directly.
- Review owner / status: Hackathon product owner (explicit scope approval) / `approved_for_hackathon`
- Evidence notes: browser-accessible endpoint confirmed by human review; referenced by NII registration/reporting page.

## Candidate source card: `jl_gov_between_jobs`

- Status: `needs_review`
- Title: Moving between jobs / unemployment life-event guide
- Publisher: gov.il / National Digital Directorate
- Canonical URL: https://www.gov.il/he/service/between-jobs-and-unemployment
- Authority level: first-party general navigation source
- Access / research date: 2026-07-17
- Review date: not reviewed
- Supported-claim summary: Search result describes an official life-event guide
  covering dismissal/resignation, compensation, pension, forms, unemployment,
  and returning to work.
- Applicable event/task IDs: `job_loss`; `jl_review_ending_records`,
  `jl_review_notice_and_severance`
- Limitations / non-claim: Hebrew source; an online translation must be checked
  against the original before it supports English copy or a material claim.
- Freshness risk: page structure/content may change.
- Individual verification / advice: Use as navigation only pending review of
  exact primary subpages.
- Review owner / status: project owner or named human reviewer / `needs_review`
- Evidence notes: official search result accessed 2026-07-17; direct retrieval
  failed in the research environment.

## Candidate source cards: supplied Ministry of Labor rights pages

All three are first-party candidate sources, `needs_review`, accessed
2026-07-17. The supplied English URLs returned access errors in the research
environment, so no direct legal/operational claim is proposed from them.

| ID | Title | Canonical URL | Potential use after review | Limitation / follow-up |
| --- | --- | --- | --- | --- |
| `jl_gov_advance_notice` | Notice of dismissal and resignation | https://www.gov.il/en/pages/notice-of-dismissal-and-resignation | Bounded review of written notice | Re-open and confirm current content; no deadline/individual entitlement claim. |
| `jl_gov_severance` | Severance package | https://www.gov.il/en/pages/severance-package | Bounded review of severance topics | Re-open and confirm conditions; no amount/eligibility claim. |
| `jl_gov_disciplinary_hearing` | Disciplinary hearing | https://www.gov.il/en/pages/disciplinary-hearing | Bounded review of a hearing issue before a dismissal decision | Re-open and confirm scope/currentness; do not suggest it applies after every job end. |

For each: authority level is first-party; applicable event is `job_loss`; review
owner is project owner or named human reviewer; review status is `needs_review`;
freshness risk is high until accessible/current content is confirmed; individual
verification/advice is appropriate when the timing, reason, process, or final
settlement is disputed or unclear.

## Candidate source cards: approved Kol Zchut cross-checks

These pages are approved authoritative public-rights cross-checks for this
Hackathon packet. Each row retains publisher **Kol Zchut** (not a substituted
government publisher), applies to `job_loss`, was reviewed 2026-07-17 by the
Hackathon product owner, and is `approved_for_hackathon`. All are
Hebrew-language and require a documented online translation checked against the
original before they support new English runtime copy.

| ID / title | Canonical URL | Candidate contribution / applicable candidate tasks | Limitation / required official mapping |
| --- | --- | --- | --- |
| `jl_kolzchut_unemployment_benefits` — Unemployment benefits | https://www.kolzchut.org.il/he/%D7%93%D7%9E%D7%99_%D7%90%D7%91%D7%98%D7%9C%D7%94?idU=1 | Identifies registration/claim terminology and branching risk for `jl_register_employment_service`, `jl_review_unemployment_claim_route`. | Pair with `jl_nii_employment_service_registration_reporting`, `jl_nii_submit_unemployment_claim`, and `jl_nii_unemployment_conditions`; never sole support. |
| `jl_kolzchut_employment_service_registration` — Initial online Employment Service registration | https://www.kolzchut.org.il/he/%D7%A8%D7%99%D7%A9%D7%95%D7%9D_%D7%A8%D7%90%D7%A9%D7%95%D7%A0%D7%99_%D7%9C%D7%9C%D7%A9%D7%9B%D7%AA_%D7%94%D7%AA%D7%A2%D7%A1%D7%95%D7%A7%D7%94_%D7%91%D7%90%D7%95%D7%A4%D7%9F_%D7%9E%D7%A7%D7%95%D7%95%D7%9F_%28%D7%91%D7%90%D7%99%D7%A0%D7%98%D7%A8%D7%A0%D7%98%29 | Cross-checks registration terminology for `jl_register_employment_service`. | Secondary only; the page includes volatile detail and must be mapped to a reviewed official source. |
| `jl_kolzchut_employment_service_reporting` — Reporting at the Employment Service | https://www.kolzchut.org.il/he/%D7%94%D7%AA%D7%99%D7%99%D7%A6%D7%91%D7%95%D7%AA_%D7%91%D7%A9%D7%99%D7%A8%D7%95%D7%AA_%D7%94%D7%AA%D7%A2%D7%A1%D7%95%D7%A7%D7%94 | Cross-checks reporting terminology for `jl_follow_employment_service_instructions`. | Secondary only; do not expose a specific reporting requirement or consequence without a current official source. |
| `jl_kolzchut_employment_end` — End of employment | https://www.kolzchut.org.il/he/%D7%A4%D7%99%D7%98%D7%95%D7%A8%D7%99%D7%9D | Maps termination, pension, and later-rights topics for `jl_review_ending_records`. | Navigation only; exact claims need official confirmation. |
| `jl_kolzchut_advance_notice` — Advance notice before dismissal | https://www.kolzchut.org.il/he/%D7%94%D7%95%D7%93%D7%A2%D7%94_%D7%9E%D7%95%D7%A7%D7%93%D7%9E%D7%AA_%D7%9C%D7%A4%D7%99%D7%98%D7%95%D7%A8%D7%99%D7%9D | Highlights written-notice topic for `jl_review_notice_and_severance`. | Pair with `jl_gov_advance_notice`; no date/amount/entitlement statement. |
| `jl_kolzchut_severance` — Severance pay | https://www.kolzchut.org.il/he/%D7%A4%D7%99%D7%A6%D7%95%D7%99%D7%99_%D7%A4%D7%99%D7%98%D7%95%D7%A8%D7%99%D7%9D | Identifies severance/pension interactions for `jl_review_notice_and_severance`. | Pair with `jl_gov_severance`; never calculate or determine eligibility. |
| `jl_kolzchut_hearing` — Hearing before dismissal | https://www.kolzchut.org.il/he/%D7%A9%D7%99%D7%9E%D7%95%D7%A2_%D7%9C%D7%A4%D7%99%D7%98%D7%95%D7%A8%D7%99%D7%9D | Highlights pre-dismissal hearing for `jl_verify_pre_dismissal_process_if_relevant`. | Pair with `jl_gov_disciplinary_hearing`; not a post-loss normal-path task. |
| `jl_kolzchut_pension` — Pension insurance | https://www.kolzchut.org.il/he/%D7%A4%D7%A0%D7%A1%D7%99%D7%94 | Surfaces pension/provident-fund cessation questions for `jl_review_ending_records`. | Secondary only; no withdrawal/recommendation, tax, or individual conclusion. |

## Research findings, conflicts, and exclusions

- **Official process vs. individual outcome:** NII supports a general
  registration/reporting and claim-route review. It also makes clear that the
  route depends on multiple conditions and employment-ending circumstances.
  Candidate content therefore never says a person qualifies, will be paid, or
  has a particular deadline.
- **Document list freshness:** The Form 100 page lives under a Coronavirus FAQ
  path. It supports only a narrow “keep/review current employment and pay
  information” candidate prompt; it cannot be used as a complete checklist
  without human confirmation.
- **Rights-page accessibility:** supplied English Ministry pages were
  inaccessible in this environment. Their topics remain verification-required,
  and no normal-path legal task is based solely on Kol Zchut.
- **Hearing timing:** a hearing is a pre-dismissal issue; it is not proposed as
  an ordinary post-employment task. It is a verification/advice trigger only
  when the person says the process is unclear or disputed.
- **Excluded/deferred detailed workflows:** resignation, unpaid leave, contract
  end, multiple employers, continued part-time work, special occupations, work
  abroad, recent service, training, discrimination, unpaid salary, disputed
  dismissal, unclear final payment, legal complaints, benefit calculations,
  severance calculations, and provider selection.

## Hackathon source-card disposition ledger — 2026-07-17

The seven runtime-approved cards retain the publisher, title, canonical user-openable
URL, jurisdiction, review date, scope, bounded claim, and limitations recorded
above. They are the only source cards translated into `src/event-packs/job-loss.ts`.
`approved_for_hackathon` means approved for this bounded planning scope, not
that a person’s eligibility, legal position, documents, deadline, payment, tax,
pension, severance, or claim outcome is determined.

| Card ID | Disposition | Runtime task mapping / exact blocker |
| --- | --- | --- |
| `jl_nii_employment_service_registration_reporting` | `approved_for_hackathon` | `jl_register_employment_service`, `jl_follow_employment_service_instructions`; bounded registration/reporting route review only. |
| `jl_nii_submit_unemployment_claim` | `approved_for_hackathon` | `jl_register_employment_service`, `jl_review_unemployment_claim_route`; official route review only, no deadline or outcome assertion. |
| `jl_nii_unemployment_conditions` | `approved_for_hackathon` | `jl_review_unemployment_claim_route`, `jl_verify_nonstandard_benefit_route`; verification-only framing for salaried/nonstandard route distinction. |
| `jl_nii_claim_documents_form100` | `approved_for_hackathon` | `jl_prepare_claim_route_information`; legacy-path, records-preservation prompt only; never a complete checklist. |
| `jl_gov_employment_service_registration` | `approved_for_hackathon` | `jl_register_employment_service`; bounded online-registration route review only. |
| `jl_gov_unemployment_benefits_service` | `approved_for_hackathon` | `jl_review_unemployment_claim_route`, `jl_prepare_claim_route_information`; route/records review only. |
| `jl_employment_service_home` | `approved_for_hackathon` | `jl_follow_employment_service_instructions`; current-instructions endpoint only. |
| `jl_gov_between_jobs` | `excluded_from_runtime` | Search-result-only/Hebrew navigation description; no reviewed English task claim or usable direct evidence. |
| `jl_gov_advance_notice` | `needs_review` | Access failure; no supported claim may be mapped to a notice task. |
| `jl_gov_severance` | `needs_review` | Access failure; no supported claim may be mapped to a severance task. |
| `jl_gov_disciplinary_hearing` | `needs_review` | Access failure; no supported claim may be mapped to a pre-dismissal task. |
| `jl_kolzchut_unemployment_benefits` | `approved_for_hackathon` | Approved cross-check; not translated into new English runtime copy. |
| `jl_kolzchut_employment_service_registration` | `approved_for_hackathon` | Approved cross-check; not translated into new English runtime copy. |
| `jl_kolzchut_employment_service_reporting` | `approved_for_hackathon` | Approved cross-check; not translated into new English runtime copy. |
| `jl_kolzchut_employment_end` | `approved_for_hackathon` | Approved cross-check; requires an English claim review before runtime use. |
| `jl_kolzchut_advance_notice` | `approved_for_hackathon` | Approved cross-check; requires an English claim review before runtime use. |
| `jl_kolzchut_severance` | `approved_for_hackathon` | Approved cross-check; requires an English claim review before runtime use. |
| `jl_kolzchut_hearing` | `approved_for_hackathon` | Approved cross-check; requires an English claim review before runtime use. |
| `jl_kolzchut_pension` | `approved_for_hackathon` | Approved cross-check; requires an English claim review before runtime use. |
