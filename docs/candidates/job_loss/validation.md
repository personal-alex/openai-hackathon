# Job-loss candidate-packet validation record

**Status:** documentation-only candidate validation. No runtime behavior,
source-card registry, active event pack, compiler input, test fixture, or UI
route was created or changed.

## Scope checks

- Packet location is `docs/candidates/job_loss/`, outside `src/event-packs/`.
- The proposal uses existing canonical `job_loss` and `IL`; it adds no event ID,
  jurisdiction, registry entry, import, application route, or product source
  card.
- Candidate pack version `il-job-loss-candidate-v0.1` is a document label, not
  a runtime `EventPack` object.
- Every evidence card is `needs_review`. The packet is intentionally not run
  through `validateEventPack`, `validateApprovedEventPack`, or
  `compileRoadmap` because doing so would misrepresent unapproved content as
  catalog input.
- The research dossier records current-access failure/redirect risk for supplied
  English `gov.il` pages and treats those topics as unresolved.
- Review follow-up: the candidate now uses current contract-shaped timing terms,
  marks `employment_stage` as a proposed confirmed transition, and requires an
  explicit `ended` answer for future post-end applicability. It does not add a
  contract change, pack, registry, or test fixture.
- Review follow-up: the optional candidate `event_date` fact supports only
  date-aware timing after an explicit end state; it cannot establish that the
  transition happened or select a post-end task by itself.
- Review follow-up: an absent registration or claim answer is not converted to
  a negative fact. An absent claim answer may still show a bounded route-review
  prompt; it does not assert that no claim was submitted. An absent work
  arrangement stays in the bounded verification branch rather than selecting
  the standard salaried route.

## Planned validation boundary

After dated human source/content approval and separate implementation
authorization, an implementer—not this packet—must map only approved values to
the existing contracts and run `validateEventPack`,
`validateApprovedEventPack`, focused Vitest fixtures, and seeded Playwright.

## Command record — 2026-07-17

- `git diff --check` — passed.
- `npm ci` — passed. The existing dependency audit reported two moderate
  findings; no audit fix was applied because this candidate packet changes no
  dependencies.
- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm run test` — passed: 7 test files, 41 tests.
- `npm run build` — passed.

No focused Vitest or Playwright test was added: the packet is documentation-only
and an application test/fixture would incorrectly turn unapproved candidate
content into runtime-shaped input. The later-integration test plan defines the
required evidence after approval.

## Review-follow-up command record — 2026-07-17

- `npm ci` — passed; the existing dependency audit reported two moderate
  findings. No dependency or audit change was made.
- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm run test` — passed: 7 test files, 41 tests.
- `git diff --check` — passed.

These commands verify that the candidate-only documentation corrections did not
affect the existing project baseline. They do not validate, approve, compile,
or activate the candidate material.

## Reference-deck audit follow-up — 2026-07-17

- `npm run build` — passed.
- `npm run test:e2e` — blocked by a pre-existing shared landing-intro overlay:
  it intercepts the suite’s Continue click before a job-loss route is reached,
  and one assertion expects older landing heading copy. No UI or E2E repair was
  made because this candidate-only event-pack worktree must not change shared
  presentation behavior.
- The audit did not introduce a runtime `job_loss` pack or a runtime test. All
  candidate source cards remain `needs_review`; `validateApprovedEventPack`
  therefore continues to prohibit their promotion.
