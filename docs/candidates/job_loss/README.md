# Job-loss candidate packet

**Status:** candidate record preserved; bounded subset promoted as
`job_loss@il-job-loss-v1` for Hackathon scope on 2026-07-17.

This packet is an evidence-backed research and curation handoff for the
canonical `job_loss` event in Israel (`IL`), in English. It proposes a calm,
three-lane planning experience for a recently unemployed salaried person. It is
not a runtime event pack, source-card registry, compiler input, user-facing
flow, eligibility decision, or legal/financial advice.

## Intended experience — proposal only

The candidate experience should help someone separate what may be
time-sensitive from what they can review and what can wait. Its opening posture
is: “Here are the areas people commonly need to sort through after a job ends.”
It combines bounded official-route review, records/right-to-review prompts, and
practical next-role momentum without promising an outcome.

## Contents

- [Research dossier and evidence ledger](evidence-ledger.md): candidate source
  cards, claim limits, access results, freshness risks, and conflicts.
- [Candidate event proposal](event-proposal.md): versioned, catalog-shaped
  facts, questions, lanes, rules, tasks, preview/active states, and source IDs.
- [Decision record](decision-record.md): proposed product branches, safety
  boundaries, and human decisions required.
- [Reviewer gate](reviewer-gate.md): required dated source/content dispositions.
- [Later-integration test plan](test-plan.md): deterministic validation,
  compiler, and seeded-journey evidence required after approval.
- [Validation record](validation.md): candidate-only scope checks and command
  results for this branch.

## Runtime boundary

Only the four cards recorded as `approved_for_hackathon` in the evidence ledger
are translated into `src/event-packs/job-loss.ts` and registered after
`validateApprovedEventPack`. All other candidate material remains outside the
runtime pack and is not supplied to `compileRoadmap`.
`validateEventPack` and `validateApprovedEventPack` apply only after a separate,
authorized translation of dated human-approved data. They do not approve this
research packet or establish source currency.

The four approved NII cards are bounded route-review/records sources only. In
particular, Kol Zchut is a
required secondary rights-navigation cross-check, never sole support for a
material operational instruction, deadline, document requirement, or rights
claim. Some supplied English `gov.il` pages were inaccessible or redirected at
research time; they are explicitly unresolved rather than operationalized.

## Remaining review boundary

1. Re-open and review every excluded/needs-review source before any additional
   claim, rights/records, Form 1500, severance, pension, Form 161, tax, or
   training task is proposed for runtime.
2. Treat Hackathon approval as bounded product scope, never as an individual
   benefit, legal, tax, pension, severance, document, or payment outcome.

No live product retrieval, provider recommendation, benefit calculation,
eligibility decision, source activation, external action, authentication,
database, or registry change is introduced by this packet.
