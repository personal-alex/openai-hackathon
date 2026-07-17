# Job-loss candidate packet

**Status:** `candidate_only` / `needs_human_review` / non-production

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

All material remains outside `src/event-packs/`, is not imported by the
application or compiler, and must not be supplied to `compileRoadmap`.
`validateEventPack` and `validateApprovedEventPack` apply only after a separate,
authorized translation of dated human-approved data. They do not approve this
research packet or establish source currency.

Every candidate source card is `needs_review`. In particular, Kol Zchut is a
required secondary rights-navigation cross-check, never sole support for a
material operational instruction, deadline, document requirement, or rights
claim. Some supplied English `gov.il` pages were inaccessible or redirected at
research time; they are explicitly unresolved rather than operationalized.

## Before any runtime implementation

1. A named human reviewer re-opens each canonical source and records a dated
   `approved`, `rejected`, or `needs_review` disposition.
2. The reviewer approves/rejects each dependent claim, task, timing, rule,
   question, safety label, English rendering, and demo scenario.
3. An explicitly authorized follow-up implementation task translates **only**
   approved material into the existing runtime schema and registry path.
4. That work runs `validateEventPack`, `validateApprovedEventPack`, focused
   Vitest coverage, and seeded Playwright journeys.

No live product retrieval, provider recommendation, benefit calculation,
eligibility decision, source activation, external action, authentication,
database, or registry change is introduced by this packet.
