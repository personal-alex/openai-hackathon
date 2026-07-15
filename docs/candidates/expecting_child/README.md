# Expecting-child candidate packet

**Status:** `candidate_only` / `needs_human_review` / non-production

This packet is a research and curation handoff for the canonical `expecting_child`
event in Israel (`IL`), in English. It is not a runtime event pack, source-card
registry, implementation specification, or user-facing content. Nothing here is
approved, current enough for production, or an eligibility conclusion.

## Contents

- [Evidence ledger](evidence-ledger.md): prospective official sources, bounded
  claim support, provenance, and uncertainty.
- [Candidate event proposal](event-proposal.md): draft contract-shaped facts,
  questions, rules, tasks, timing, safety notes, and seeded scenarios.
- [Reviewer gate](reviewer-gate.md): required human dispositions and handoff.
- [Validation evidence](validation.md): scope checks and existing-code
  verification, including why candidate material is not run as a pack.

## Runtime boundary

The documents intentionally remain outside `src/event-packs/` and are not
imported by the application or compiler. They must not be supplied to
`compileRoadmap` or presented as a roadmap.

`validateEventPack` validates a runtime-shaped `EventPack` schema and its
cross-references. `validateApprovedEventPack` additionally rejects every source
card whose disposition is not `approved`. Neither validator approves this
candidate research, verifies source currency, or makes the packet runnable.

## Before any runtime implementation

1. A named human reviewer must re-open each canonical URL, establish source
   currency, and record a dated `approved`, `rejected`, or `needs_review`
   disposition for every card.
2. The reviewers must approve or reject each dependent claim, task, timing,
   rule, question, safety label, and seeded scenario; unsupported or ambiguous
   material is excluded.
3. An authorized follow-up implementation task may translate only approved
   material into the existing runtime contracts and reviewed-pack path.
4. That implementation must run `validateEventPack`,
   `validateApprovedEventPack`, focused Vitest coverage, and applicable seeded
   journey checks. It is not authorized by this research packet.

No live retrieval, external action, country selector, additional event ID,
registry, sensitive-data storage, or eligibility decision is introduced here.
