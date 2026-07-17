---
title: routine-israeli-hospital-registration-candidate-correction-2026-07-17
type: note
permalink: openai-hackathon/implementation/routine-israeli-hospital-registration-candidate-correction-2026-07-17
tags:
- life-navigator
- expecting-child
- candidate-review
- source-provenance
---

# Routine Israeli-hospital registration candidate correction — 2026-07-17

- Accepted scope decision: the `expecting_child` candidate packet records **Approved with scope: routine birth in an Israeli hospital**. The hospital birth notice is distinct from the Population Registry entry; the approved scope is candidate/review evidence only.
- Primary candidate source cards: `ec_piba_birth_registry_procedure`, `ec_piba_newborn_name`, `ec_piba_birth_certificate`, and `ec_moh_birth_certificate_parents`; no runtime source-card registry or event pack was activated.
- Routing proof: explicit `event_stage = birth_occurred` is required; due dates/inference cannot set it. A true Israeli-hospital fact selects the normal route, missing first name selects only conditional name action, and non-hospital/unknown routes to verification required. Birth outside Israel, home/non-recognised-institution birth, disputed parentage, late registration, corrections, adoption, and surrogacy are excluded/deferred.
- Changed artifacts: candidate packet docs, `CURRENT_STATE.md`, `docs/CODEX_COLLABORATION.md`, `tests/fixtures/expecting-child-transition.ts`, and `tests/unit/roadmap-compiler/transition-gates.test.ts`.
- Commits: `877b8c1af58c707126b1db3cc12e23f55d80b650` (content/tests) and `6449d3fca6845f05001684c3b59f96b761134a2e` (Codex evidence).
- Verification: `git diff --check`, `npm run lint`, `npm run typecheck`, `npm run test` (6 files, 27 tests), and `npm run build` passed. `validateApprovedEventPack` rejects the fixture because it is `testOnly`.
