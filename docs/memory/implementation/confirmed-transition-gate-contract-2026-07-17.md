---
title: confirmed-transition-gate-contract-2026-07-17
type: note
permalink: openai-hackathon/implementation/confirmed-transition-gate-contract-2026-07-17
tags:
- event-packs
- roadmap-compiler
- safety
- testing
---

# Confirmed transition-gate contract — 2026-07-17

Implemented a generic, deterministic transition-gate contract on branch `codex/il-expecting-child-candidate-pack` at commit `99ee184253db6df0c83d20a8a2bfadf703874707`.

## Decision

Transition-gated tasks require explicit, typed facts marked `confirmed_transition` and exact required values in task applicability. Predicted dates, schedules, estimates, inferred milestones, elapsed time, and wall-clock time are not evidence that a real-world transition occurred. Unknown transition facts leave gated tasks unselected.

## Architecture and pack proof

The repository-local `life-event-authoring` skill stays generic: it refers only to confirmed transition fact(s), task applicability, planning items, schema validation, and compiler validation. It does not name an event-specific field or event.

The non-production fixture at `tests/fixtures/expecting-child-transition.ts` proves the contract with the pack-specific snake_case fact `event_stage = birth_occurred`, because stable IDs use snake_case. The fixture is `testOnly: true`, is not registered, contains no real source or policy claim, and `validateApprovedEventPack` rejects it. Candidate sources were intentionally not promoted and remain `needs_review`.

## Enforcement and evidence

- Skill and template: `.agents/skills/life-event-authoring/SKILL.md`, `.agents/skills/life-event-authoring/references/event-proposal-template.md`
- Contract and validation: `src/domain-contracts/index.ts`
- Compiler selection: `src/roadmap-compiler/index.ts`
- Approved-runtime rejection: `src/event-packs/review.ts`
- Tests: `tests/unit/roadmap-compiler/transition-gates.test.ts`

Passed: `npm run check` (lint, typecheck, 6 test files / 26 tests), `npm run build`, and `git diff --check`. The older branch baseline's `npm run test:e2e` remains failing because its test expects a newer UI heading not present on this branch; this change did not modify the UI or e2e test.

## Follow-up

Apply the same generic contract to any approved runtime pack only after human source/content review and approval. This branch still requires explicit review and merge or cherry-pick into main before it becomes main-branch submission evidence.