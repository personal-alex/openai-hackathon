---
name: life-event-authoring
description: Prepare controlled, evidence-backed candidate research and review-ready Life Navigator life-event proposals. Use when proposing a future event, collecting candidate source cards, drafting candidate tasks or rules, or designing minimal decision-changing intake questions; do not use to activate catalog content or decide eligibility.
---

# Life Event Authoring

Prepare candidate material for human review. This skill produces no runtime event
pack, policy conclusion, or user-facing content.

## Required context

1. Read `AGENTS.md`, `CURRENT_STATE.md`, `docs/technical-product-direction.md`,
   `docs/event-pack-authoring.md`, and the current domain contracts before drafting.
2. Confirm the request is Israel-only and English-only. The complete flows remain
   `expecting_child` and `job_loss`; `move_home` is stretch-only.
3. Treat only `expecting_child`, `job_loss`, and `move_home` as canonical event
   IDs. Do not add a candidate future event to `EventIdSchema` or a registry.
4. Keep candidate curation, human review, and approved-pack implementation as
   three separate stages.

Read [source-card-template.md](references/source-card-template.md) before
collecting sources, [event-proposal-template.md](references/event-proposal-template.md)
before drafting, and [reviewer-gate.md](references/reviewer-gate.md) before a
handoff. Use [synthetic-future-event-example.md](references/synthetic-future-event-example.md)
only as a shape example; it is fictional and non-production.

## Candidate workflow

1. **Frame the candidate.** Record why the event is being considered, intended
   jurisdiction/language, known unknowns, and its status as `candidate_only`.
   Do not claim it is supported, active, or eligible for implementation.
2. **Collect provenance.** Create one candidate source card per prospective
   source. Preserve the canonical URL, access date, review date, supported-claim
   scope, limits, owner, and `needs_review` status. Quote or paraphrase only what
   the source supports; where support is absent, write `unknown`.
3. **Draft catalog-shaped proposals.** Use stable draft IDs, typed facts,
   constrained condition/rule shapes, typed timing, task/source references, and
   safety notes. Follow the repository schemas; do not redefine them in a
   template. Mark each uncertain dependency, eligibility issue, and source link.
4. **Minimize questions.** For every candidate question, identify the fact and
   exactly one or more effects on task selection, timing, ordering, wording,
   verification state, or a documented follow-up. Remove questions with no
   decision-changing effect. Unknown and skipped answers stay unknown; never
   turn them into negative facts.
5. **Run the approval handoff.** Complete the reviewer checklist and leave the
   proposal unapproved until a named human records dated source dispositions and
   catalog approval. AI help may summarize stated material or draft bounded
   proposals, but cannot activate content, determine eligibility, or resolve
   legal, medical, tax, or financial questions.

## Approval boundary and implementation gate

Candidate templates may include `title`, `accessDate`, `nextReviewDate`,
`applicableEventIds`, `applicableTaskIds`, `limitations`, `reviewOwner`, and
`reviewStatus`. Fields beyond the present runtime `SourceCardSchema` are
**draft-review metadata only**; retain them outside a runtime pack unless a
separate contract change is approved.

Only after the human approval gate may an implementer translate approved
material into the existing runtime contracts and approved-pack path. This is a
new implementation task, not an automatic continuation of research. Do not add
new MCPs, databases, RAG, live web retrieval to the product, autonomous agents,
or a user-facing candidate flow.

## Validation and fail-closed checks

Before proposing implementation, use `validateEventPack` to catch schema and
cross-reference failures. Use `validateApprovedEventPack` for the product gate:
it must reject every non-approved source card. Add focused Vitest coverage only
when a contract, validator, or approved catalog change warrants it; do not add
speculative application behavior for a proposal.

Fail closed for malformed IDs, undeclared/invalid facts, unknown task/source/
dependency/rule references, invalid typed timing or conditions, missing safety
metadata, missing reviewer/disposition metadata, non-approved source cards, and
an incomplete jurisdiction profile. Do not run candidate material through the
compiler or present it as a roadmap.

## Handoff

Deliver the completed event proposal, its candidate source cards, an explicit
uncertainty list, and the completed reviewer gate. State which human decisions
remain: source dispositions, source/task/rule/question/safety approval, any
eligibility ambiguity, and whether an approved implementation task should be
opened. Never label an AI-assisted draft as authoritative.
