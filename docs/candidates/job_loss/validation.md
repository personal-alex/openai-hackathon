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
