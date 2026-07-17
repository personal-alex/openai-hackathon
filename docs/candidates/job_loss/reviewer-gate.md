# Reviewer gate — candidate `job_loss` packet

**Current outcome: approved for bounded Hackathon implementation.** Seven
official route cards in the disposition ledger are approved-for-hackathon and
mapped to runtime tasks. Kol Zchut is an approved authoritative cross-check
with publisher provenance retained; its Hebrew text requires a documented
online translation checked against the original before it supports new runtime
copy.

## Checklist

- [ ] The packet remains Israel-only and English-only, uses only existing
  canonical `job_loss`, and creates no runtime registry/user-flow activation.
- [ ] Every candidate source card has stable ID, title, publisher, canonical
  URL, access/review date, authority level, applicability, limitations,
  freshness risk, review owner, and status.
- [ ] A named reviewer re-opens every primary source and records current,
  bounded support for each material operational/right-to-review claim.
- [ ] Every Hebrew-source claim, including Kol Zchut content, has a documented
  online translation checked against the original before it is shown in the
  English-only runtime.
- [ ] Inaccessible/redirected supplied `gov.il` pages and the legacy Form 100
  page have an explicit keep/reject/revise decision.
- [ ] Each task/rule has stable IDs, typed facts/timing, source/dependency
  references, verification framing, and no hidden eligibility/outcome claim.
- [ ] Any proposed post-end task is mapped only through the existing
  `confirmed_transition` applicability contract with an explicit
  `employment_stage = ended` answer. Contract-shaped timing does not invent or
  infer an employment-end date.
- [ ] An optional supplied `event_date` is used only for timing presentation
  after an explicit end state; it never acts as transition evidence or selects
  a post-end route by itself.
- [ ] An absent registration, claim, or work-arrangement answer is not treated
  as an explicit negative answer. In particular, the verification branch for an
  unknown work arrangement remains bounded and the standard salaried route is
  not selected.
- [ ] Each question changes selection, timing, ordering, wording, verification,
  or a documented follow-up; no curiosity-only question remains.
- [ ] Unknown/skip facts remain absent. Notice, dates, schedules, estimates, or
  inference never establish that employment has ended.
- [ ] The standard candidate route is limited to explicit salaried work;
  self-employed/mixed/unknown arrangements stay verification-required.
- [ ] Preview wording does not present official registration as due before
  employment has explicitly ended.
- [ ] Rights/records copy does not calculate severance, find a violation,
  decide eligibility, recommend a paid provider, or create a legal workflow.
- [ ] Candidate metadata stays outside runtime `SourceCardSchema` / pack paths.
- [ ] A separately authorized implementation task will translate only approved
  data and run validators, Vitest, and seeded Playwright evidence.

## Required disposition record

The table below is the pre-approval candidate snapshot. The dated final
dispositions and runtime mappings are maintained in the evidence ledger; they
supersede `unassigned` and `needs_review` values in this historical snapshot.

| Candidate source ID | Human reviewer | Review date | Disposition | Currency / claim notes |
| --- | --- | --- | --- | --- |
| `jl_nii_employment_service_registration_reporting` | unassigned | not reviewed | `needs_review` | — |
| `jl_nii_submit_unemployment_claim` | unassigned | not reviewed | `needs_review` | — |
| `jl_nii_unemployment_conditions` | unassigned | not reviewed | `needs_review` | — |
| `jl_nii_claim_documents_form100` | unassigned | not reviewed | `needs_review` | Legacy-path freshness review required. |
| `jl_gov_employment_service_registration` | unassigned | not reviewed | `needs_review` | Research access failed. |
| `jl_gov_unemployment_benefits_service` | unassigned | not reviewed | `needs_review` | Redirected under construction. |
| `jl_employment_service_home` | unassigned | not reviewed | `needs_review` | Research access failed. |
| `jl_gov_between_jobs` | unassigned | not reviewed | `needs_review` | Hebrew navigation page; re-open required. |
| `jl_gov_advance_notice` | unassigned | not reviewed | `needs_review` | Research access failed. |
| `jl_gov_severance` | unassigned | not reviewed | `needs_review` | Research access failed. |
| `jl_gov_disciplinary_hearing` | unassigned | not reviewed | `needs_review` | Research access failed. |
| `jl_kolzchut_unemployment_benefits` | unassigned | not reviewed | `needs_review` | Secondary only. |
| `jl_kolzchut_employment_service_registration` | unassigned | not reviewed | `needs_review` | Secondary only. |
| `jl_kolzchut_employment_service_reporting` | unassigned | not reviewed | `needs_review` | Secondary only. |
| `jl_kolzchut_employment_end` | unassigned | not reviewed | `needs_review` | Secondary only. |
| `jl_kolzchut_advance_notice` | unassigned | not reviewed | `needs_review` | Secondary only. |
| `jl_kolzchut_severance` | unassigned | not reviewed | `needs_review` | Secondary only. |
| `jl_kolzchut_hearing` | unassigned | not reviewed | `needs_review` | Secondary only. |
| `jl_kolzchut_pension` | unassigned | not reviewed | `needs_review` | Secondary only. |

## Gate record

- Proposal ID/version: `il-job-loss-candidate-v0.1`
- Reviewer(s) and roles: Hackathon product owner (explicit scope approval)
- Review date: 2026-07-17
- Source-card dispositions: seven official route cards and the approved Kol
  Zchut cross-check cards are `approved_for_hackathon`; runtime mappings and
  English-rendering boundaries are recorded in the evidence ledger
- Catalog-content decision: approved for bounded Hackathon implementation
- Required contract change: source-card disposition and practical-guidance gate
- Implementation authorization: granted by product-owner authorization
- Remaining uncertainties and owner: source currency/access, primary support,
  English rendering, all task/rule/question/safety/UX decisions, and all
  nonstandard/dispute routes belong to named human reviewers/project owner.

Any unresolved source, ambiguity, `needs_review`/`rejected` card, or absent
separate implementation authorization keeps this packet out of the catalog.
