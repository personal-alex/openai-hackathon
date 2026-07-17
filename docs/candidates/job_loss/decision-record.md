# Candidate decision record — Israel `job_loss` roadmap

**Status:** proposal only / `needs_human_review` / no runtime effect

## Candidate product choices

| Area | Candidate decision | Rationale / trade-off | Human decision required |
| --- | --- | --- | --- |
| Persona | Start with recently unemployed people whose last role was salaried. | This permits a bounded official-route review without pretending to cover every employment arrangement. | Confirm scope and whether another persona is needed for the MVP. |
| Three lanes | Keep immediate official route, rights/records review, and next-role momentum visible. | A job loss is both administrative and personal; a purely institutional list is low value. | Approve task/copy boundaries. |
| Ordering | Put official registration/claim-route review first after an explicit employment end; focus can reorder only supporting items. | Protects the official route without inventing a personal deadline. | Confirm priority labels and UX wording. |
| Preview | Notice/not-yet-ended states show “may become relevant” previews, not due-now registration. | A notice is not proof that work ended. | Approve preview wording and source support. |
| Standard route | Only an explicit `salaried` response can select the candidate standard unemployment route. | NII frames the benefit around salaried employment and multiple conditions. | Confirm safe fact values and any extra branch needed. |
| Nonstandard route | Self-employed, mixed, and unknown arrangements show verification-required benefit wording plus momentum tasks. | Prevents a false claim that standard unemployment instructions apply. | Decide whether any narrowly reviewed official path should later be added. |
| Rights/records | Present generic “review/keep/verify” cards for notice, severance, records, pension/provident funds, and final-settlement questions. | Official rights pages were inaccessible during research; generic prompts avoid unsupported legal conclusions. | Re-review official pages and approve/reject every card. |
| Disputes | Treat unpaid salary, discrimination, disputed dismissal, unclear final settlement, and unclear paperwork as individual-advice triggers only. | These need fact-specific legal assessment and must not become self-service legal workflows. | Approve safety/escalation copy and any official referral source. |
| Momentum | Include CV, profile, outreach, and neutral-support planning tasks for every active/verification route. | The product remains useful even where benefits are not the standard route. | Approve practical-copy tone and labels. |

## Candidate user branches

```text
User says job ended
  ├─ salaried
  │   ├─ not registered -> official registration + claim-route review
  │   ├─ registered -> follow current official instructions; retain records/momentum
  │   └─ claim submitted -> de-emphasize initial claim review; no outcome asserted
  ├─ self-employed / both / unknown -> verification-required benefit state + momentum
  └─ all active routes -> rights/records review + practical next-role tasks

Notice given / not yet ended
  └─ preview-only official-route items + optional records/resume preparation
```

## Safety boundaries

- No task determines benefit eligibility, amount, payment, qualifying period,
  severance amount, legal compliance, discrimination, residency, age, or claim
  result.
- No dates, elapsed time, schedule, estimate, or model output establishes that
  employment has ended. Only the user’s explicit `employment_stage = ended`
  state selects active post-end candidate steps.
- The deterministic compiler would be the sole authority for approved task,
  source, timing, and diff selection. This candidate material is not compiler
  input.
- The product never files claims, registers a person, contacts an employer,
  recommends paid providers, or retrieves the live web during a user flow.
- Source freshness and individual applicability are visible verification
  boundaries, not boilerplate that hides the useful content.

## Source conflicts, gaps, and freshness risks

1. The supplied English `gov.il` pages for registration, advance notice,
   severance, and hearing were inaccessible/redirected in the research
   environment. They must be reopened by a human before supporting a material
   task.
2. The NII Form 100 page sits under a Coronavirus FAQ path. It is retained as a
   narrow information-preservation clue, not a complete current document list.
3. Kol Zchut points to useful rights/branch terminology but is Hebrew-language
   and secondary. A human must approve any English rendering and primary-source
   mapping.
4. NII’s conditions material makes individual circumstances material. The
   candidate resolves this by limiting the UI to route review and verification,
   never a result.

## Explicitly deferred

- Detailed resignation, unpaid-leave, contract-end, multiple-employer,
  continued-part-time, special-occupation, work-abroad, recent-service, and
  training branches.
- Detailed unpaid-salary, discrimination, hearing, employment-law complaint,
  pension withdrawal, tax, severance, or final-settlement workflows.
- Provider directories, referrals, affiliate relationships, calculators,
  claims/forms, reminders, integrations, account data, and live retrieval.

## Required approval sequence

1. Source reviewer records dated dispositions on every card.
2. Product/safety reviewer approves the three-lane information architecture,
   wording, facts, questions, rules, timing, preview state, and deferrals.
3. Implementation owner receives a separate authorization to map approved data
   into the runtime contract, run validators/compiler tests, and build the user
   journey.
