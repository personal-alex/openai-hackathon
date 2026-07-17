# Later runtime-integration test plan — candidate `job_loss`

**Status:** proposed evidence only. Do not implement these tests until the
source/content approval gate and a separate implementation authorization exist.

## Contract and approval-gate tests

1. A translated runtime pack validates only when every fact/question/task/rule
   and stable source/task reference is valid.
2. `validateApprovedEventPack` rejects every non-approved candidate source card.
3. The candidate packet itself is never imported, registered, compiled, or
   rendered by a test or application route.
4. Unknown/skip facts remain absent; undeclared values and source/task/rule
   references fail closed.

## Compiler fixture matrix

| Scenario | Expected deterministic evidence |
| --- | --- |
| Explicitly ended + salaried + not registered | Registration and official claim-route review appear before records/momentum; no benefit outcome is asserted. |
| Explicitly ended + salaried + registered | Initial registration is removed/de-emphasized; official-instruction review remains without inventing a date/appointment. |
| Explicitly ended + salaried + claim submitted | Initial claim-review task is removed/de-emphasized; no acceptance/payment inference. |
| Notice given / not ending | Preview labels only; registration is not due-now; records/resume preparation is optional planning. |
| Explicitly ended + self-employed/both/unknown | Standard salaried route is absent; bounded verification state plus practical momentum remains. |
| Focus = next role | Momentum order changes only after active official-route priorities; no time-sensitive source-backed item disappears. |
| Missing records / unknown facts | Verification wording changes; no document-completeness or legal conclusion. |
| Dispute trigger | Generic verification/advice prompt only; no legal workflow, employer-fault conclusion, or provider recommendation. |

## Seeded Playwright journeys

1. “I lost my job” → event confirmation → one question at a time → explicitly
   ended/salaried/not registered → source-aware official route, rights/records,
   and momentum tasks.
2. Same journey with registration confirmed → initial registration changes,
   source details remain inspectable, and the task diff is non-colour labelled.
3. Notice-given state → preview notice appears; registration is not presented as
   active/due-now; optional record/resume preparation is clearly labelled.
4. Self-employed/mixed/unknown → standard route is absent and a
   verification-required state appears without an eligibility conclusion.
5. Focus selection reorders supporting tasks but preserves official priorities;
   reset clears only local state.
6. Keyboard task-card disclosure, source-link behavior, visible focus,
   reduced-motion behavior, and desktop/mobile rendering pass.

## Required commands after authorized implementation

```text
git diff --check
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

The implementation handoff must report exact test counts/results and confirm
that no live retrieval, external action, provider recommendation, eligibility
calculation, or raw model task/source content was introduced.
