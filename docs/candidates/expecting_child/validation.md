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

## Candidate research rerun — 2026-07-17

- Added three `needs_review` Kol Zchut secondary-source cards and an internal
  review-deck outline. The cards are explicitly not standalone support for
  material claims; primary-source mappings or `unresolved` status are recorded.
- Replaced the former candidate date-based post-transition proxy with the
  explicit candidate fact `event_stage = birth_occurred`. This remains
  candidate documentation only and must not be compiled or treated as a runtime
  pack.
- `git diff --check` passed for this documentation-only update. No application,
  schema, compiler, source disposition, or runtime-pack file changed.

## Candidate review correction pass — 2026-07-17

- Replaced the hospital-specific newborn-name question with route-neutral
  wording and preserved the direct primary birth-notification / registration
  procedure as `unresolved`.
- Replaced the prenatal-contact `exists: false` draft condition with an
  explicitly recorded candidate value, `prenatal_care_contact_status =
  not_shared`. It means only that the fact was intentionally not provided; a
  skip remains absent and selects no task.
- Narrowed the post-transition NII candidate to
  `ec_review_birth_grant_information`; it is a verification-only official
  birth-grant-information review, not generic post-birth NII content.
- Added the proposal-only UX boundary that an explicit statement or
  user-controlled event-status update, rather than timing data or routine
  prenatal intake, establishes `event_stage = birth_occurred`.
- Re-ran `git diff --check`, `npm run lint`, `npm run typecheck`, and
  `npm run test`: all passed; Vitest reported 6 files and 26 tests passing.
- Confirmed `expecting_child` is present in the repository's `eventIds` and
  `EventIdSchema`; no contract file was changed.
