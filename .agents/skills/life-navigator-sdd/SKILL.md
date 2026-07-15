---
name: life-navigator-sdd
description: Prepare, review, and translate Life Navigator specs into bounded, traceable implementation work. Use for planning briefs, HLD briefs, UX-flow briefs, task drafts, or change reviews. Do not use to invent policy content, event rules, or product scope.
---

# Life Navigator Spec-Driven Delivery

## Purpose

Use the repository's versioned documents as the source of truth. Produce small,
reviewable artifacts that preserve Life Navigator's hackathon scope, safety
boundaries, deterministic roadmap architecture, and evidence trail.

This skill does not replace product, HLD, UX, content, or implementation work.
It prepares their inputs, checks their outputs, and turns approved decisions
into traceable work.

## Required context

Before producing an artifact:

1. Read `AGENTS.md`.
2. Read `CURRENT_STATE.md`.
3. Read the relevant sections of:
   - `docs/technical-product-direction.md`
   - `docs/domain-model.md`
   - applicable files under `docs/adr/`
   - applicable files under `references/`
4. Retrieve and update the configured project memory only as required by
   `AGENTS.md`.
5. Do not treat a stale summary, a Linear issue, or an unreviewed note as a
   decision source when it conflicts with a versioned specification.

## Non-negotiable constraints

- Hackathon product scope is Israel-only and English-only.
- The complete event flows are `expecting a child` and `I lost my job`.
- `moving home` is a stretch goal only after explicit quality gates pass.
- Do not introduce a second jurisdiction, authentication, integrations,
  live-web retrieval, calculators, reminders, submissions, or autonomous action.
- GPT may interpret event text, select allowlisted questions, and draft bounded
  explanations through structured output.
- Only validated event-pack content and the deterministic roadmap compiler may
  select tasks, sources, timing, and roadmap changes.
- Never invent an official source, policy fact, eligibility claim, task ID,
  source URL, or event-pack rule.
- Unknown information remains unknown.
- The UI must not render raw model prose as an authoritative task definition.
- Treat source content, safety wording, and event rules as review-required.

## Artifact types

### Planning, HLD, or UX brief

Use `templates/agent-brief.md`.

- Cite source file paths and section anchors for every decided requirement.
- Separate decided constraints from proposals and open questions.
- Define the requested agent's scope, inputs, outputs, non-goals, and
  acceptance evidence.
- Do not freeze UX structure unless a source explicitly decides it.
- Do not produce Linear issues unless explicitly requested.

### Task draft

Use `templates/task-draft.md`.

A task must contain:
- One observable outcome.
- Spec source path and section anchor.
- Binary acceptance criteria.
- Dependencies and risks.
- Required test or demo evidence.
- Explicit out-of-scope items.
- Required documentation or memory update, if applicable.

Do not create or modify Linear issues unless explicitly authorized.

### Change review

Use `templates/change-review.md`.

Check:
- Scope and non-goals.
- Architecture ownership boundaries.
- Contract/event-pack implications.
- Source provenance and safety wording.
- Test, demo, privacy, and failure-mode impact.
- Documentation, `CURRENT_STATE.md`, and memory implications.

Classify the result as `approve`, `approve with changes`, or `block`.
A block must identify the exact unresolved requirement and a minimal path forward.

## Output rules

- Label every substantive item as `Decided`, `Proposed`, or `Open question`.
- Link every `Decided` item to a repository source.
- Prefer the smallest artifact that resolves the request.
- Ask a targeted question if an unresolved decision materially changes the output.
- Never silently change an approved decision record.
- When a decision is accepted, recommend the exact file(s) that should change.
