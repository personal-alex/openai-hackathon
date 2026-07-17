# Job-loss × IL skill implementation vs. reference deck

**Audit date:** 2026-07-17
**Benchmark:** `/Users/alex/Downloads/job-loss-benefits-il.pptx`
**Review boundary:** the deck is a product-team benchmark, not an official source
or human source-card disposition. The current runtime registry contains only the
approved `expecting_child` pack. `job_loss` is a synthetic seeded fixture, and
the candidate job-loss packet remains outside the registry with every source
card marked `needs_review`.

| Reference-deck topic | Current worktree coverage | Assessment | Recommended change | Priority | Scope |
|---|---|---|---|---|---|
| Immediate Employment Service registration | Candidate `jl_register_employment_service` cites two NII candidate cards; runtime has only a synthetic timeline task. | incomplete | Retain the candidate’s explicit post-end, salaried, `not_registered` branch. A human must revalidate the NII claim and registration pages before a runtime task can show it. Do not promote deck wording such as retroactivity, in-person attendance, or a 14-day requirement. | P0 | B — pack / human source review |
| Bituach Leumi claim path and Form 1500 | Candidate `jl_review_unemployment_claim_route` and legacy Form 100 card; no Form 1500 card or runtime task. | incomplete | Add a Form 1500 claim-route source card/task only after a named reviewer verifies a current official canonical page and its filing instructions. | P0 | B — pack / human source review |
| Termination evidence, employer salary data, pay slips, and multiple employers | Candidate records prompt and legacy Form 100 card; no approved document checklist or multiple-employer branch. | incomplete | Keep the existing bounded “keep/review current information” candidate wording. Treat exact letters, six-month slips, Form 1514, and multiple-employer instructions as review-required. | P1 | B — pack / human source review |
| Dismissal, resignation, and other status-dependent branches | Candidate defers resignation and disputed cases; it has only an explicit employment-end gate. | covered | Preserve deferral. Do not infer reason for termination or add waiting-period/legal branches without current reviewed official support. | P0 | D — deliberately deferred |
| Employment history, age, dependants, and continuing reporting | No candidate fact/rule except a general registered follow-up; no runtime coverage. | incomplete | Do not ask these sensitive facts merely to display deck duration/rate information. Add a fact only if an approved source supports a specific task-selection or verification change; otherwise direct people to the official rules/calculator. | P1 | B — pack / human policy review |
| Unemployment-benefit explanation, duration/rate, and deductions | Candidate explicitly avoids amount, qualifying-period, payment-start, and outcome claims; no runtime coverage. | unsafe | Keep exact 2026 figures, percentage examples, duration bands, and deductions out of the product. They are volatile and would imply a personalised calculation. A future approved task may link to an official calculator/rules page without calculating an outcome. | P0 | D — false-precision / eligibility risk |
| Severance, pension/severance funds, Form 161, and tax follow-up | Candidate provides generic rights/records and individual-advice prompts; all relevant official pages are unreviewed/inaccessible during research. | incomplete | Preserve generic verification framing. Form 161, tax-exemption, pension withdrawal, and tax-refund workflows require separately reviewed primary sources and safety approval. | P0 | B — pack / human source and safety review |
| Training, partial work, pension income, and other optional follow-ups | Candidate defers training, continued part-time work, and special routes; no runtime coverage. | covered | Keep deferred: the deck’s route-specific details need current official support and could affect eligibility. | P1 | D — unnecessary complexity until reviewed |
| Timeline clarity: do now, gather, ongoing, and after termination/tax year | Candidate specifies priority bands and now has an optional `event_date` only for timing presentation; synthetic runtime labels only a generic fixture date. | incomplete | A reviewed future pack can use existing task timing/priority fields. Rendering semantic multi-lane timeline headings would be a reusable presentation capability, so do not hard-code it for `job_loss` here. | P1 | C — main-thread UI handoff |
| Source provenance, review dates, safe wording, and verification labels | Candidate ledger documents canonical URLs, limitations, freshness risks, and `needs_review`; approved runtime source details already render for `expecting_child`. | covered | Keep the candidate review gate closed. Promote only dated, named human-approved primary cards through `validateApprovedEventPack`; the deck itself supplies no usable source URLs. | P0 | B — pack / human source review |
| Visible roadmap diffs after registration, claim, work-arrangement, or records answers | Shared compiler and UI support task diffs; job-loss has only synthetic fixture diffs. Candidate rules describe intended changes but are not compiler input. | incomplete | After source/content approval, add pack-specific compiler and seeded E2E cases for explicit registration, submitted claim, standard vs. nonstandard/unknown arrangement, and missing records. No generic engine change is required for task diffs. | P1 | B — pack and pack-specific tests after approval |

## Focused-patch outcome

No A-level runtime pack change is safe today. The source-review gate blocks every
candidate card, and the deck’s source slides name organisations but provide no
canonical URLs or review disposition. The safe patch in this worktree therefore
corrects candidate transition/unknown-state and optional timing semantics and
strengthens the reviewer gate rather than activating content.

## Main-thread handoff

If a reviewed `job_loss` pack is later authorised, consider a reusable,
catalog-driven way to group task timing as “do now”, “gather”, “ongoing”, and
“later”. It must be designed at the shared presentation layer, not as a
job-loss-specific UI branch. The existing deterministic task-diff mechanism is
already suitable for pack-specific coverage.

Separately, the current seeded Playwright suite is blocked before either event
flow begins: the existing landing-intro overlay intercepts its Continue click,
and one test still expects pre-intro heading copy. This is unrelated to the
candidate-only patch and belongs to the main session’s shared landing/UI test
maintenance, not this event-pack worktree.
