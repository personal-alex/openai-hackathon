# ADR 0004: Hackathon IL→US Relocation Exception

**Status:** Accepted
**Date:** 2026-07-18

## Context

The approved product direction and ADR 0002 limited the public hackathon
catalog to reviewed Israel (`IL`) content. On 2026-07-18, the project owner
approved a reviewed content handoff for one additional, cross-border scenario:
`relocate_il_us` — relocating from Israel to the United States.

## Decision

Register `relocate_il_us` as an English-only, hackathon/demo-only event pack.
Its pack-level jurisdiction is `IL_US`; each source card retains its actual
`IL` or `US` provenance. It is registered through the same validated catalog,
live structured classifier, question flow, deterministic compiler, source
inspection UI, and browser-local state as the existing packs.

The pack may contain no base tasks. In that case, unknown context compiles to
no task. Its tasks are selected only by validated, decision-changing facts.
Planned timing may use any declared pack fact as its anchor; pack validation
rejects undeclared **planned** timing anchors.

## Boundaries

- This does not create a country selector, a U.S.-only journey, or a general
  multi-jurisdiction capability.
- It does not determine immigration, visa, admission, residency, tax, filing,
  work authorization, benefits, or eligibility outcomes.
- Every task remains source-backed and `verification_required`; the attached
  handoff is approved only as `approved_for_hackathon`, not production review.
- No live-web retrieval, integration, authentication, database, or autonomous
  action is authorized.

## Consequences

This ADR supersedes the Israel-only runtime-catalog restriction in the product
direction, HLD, UX package, implementation plan, and ADR 0002 **only for this
single IL→US pack**. All other jurisdiction expansion remains out of scope.
