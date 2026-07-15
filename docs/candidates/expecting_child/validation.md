# Candidate-packet validation evidence

**Status:** Documentation-only candidate validation; no runtime behavior was
added or changed.

## Scope checks — 2026-07-15

- `git diff --check` passed: no whitespace errors.
- Packet location is `docs/candidates/expecting_child/`; no file was added under
  `src/event-packs/`, and no application import or compiler input was added.
- The packet retains only canonical event ID `expecting_child` and jurisdiction
  `IL`; it introduces no country selector, registry, or runtime source card.
- Every evidence card is `needs_review`; the reviewer gate records that the
  candidate packet is not catalog-approved.

## Existing relevant validation — 2026-07-15

- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm run test` — passed: 5 test files, 19 tests.

## Why no candidate fixture was passed to runtime validators or compiler

`validateEventPack` is appropriate only after approved data is translated into a
complete runtime `EventPack`. This packet intentionally includes review metadata
outside `SourceCardSchema`, uses `needs_review` source cards, and preserves an
explicitly unresolved post-birth stage-modeling issue. Running it as a runtime
pack would either require an unauthorized translation/contract decision or
misrepresent unapproved content as catalog input.

`validateApprovedEventPack` must reject every non-approved source card; that is
the intended gate, not a test to circumvent for candidate research.
`compileRoadmap` is not run because the authoring workflow prohibits compiling
unreviewed candidate material into a roadmap.

No focused Vitest fixture was added: documentation structure is not a runtime
contract, and adding an application test for it would expand runtime behavior
without validating an approved catalog change. The existing validator/compiler
test suite provides the relevant fail-closed evidence until a separately
authorized implementation task supplies approved runtime data.
