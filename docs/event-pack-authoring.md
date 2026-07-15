# Event-pack authoring and source-review workflow

## Purpose

This workflow governs reviewed, user-facing Israel (`IL`) event packs. It keeps
candidate research separate from approved content and ensures the deterministic
compiler can use only validated catalog data.

## Roles and boundaries

- **Candidate researcher/curator:** collects potential sources, questions,
  tasks, rules, and safety wording. Candidate material is not an event pack and
  must not be shown to users.
- **Project owner/human reviewer:** records a dated disposition for every source
  card and approves or rejects the associated content.
- **Implementer:** adds only approved data to the future JSON pack registry and
  runs the validation checks. The implementer does not infer policy facts or
  replace review.

No source card, task, rule, question, safety copy, policy claim, deadline, or
eligibility implication may be invented during authoring.

## Authoring sequence

1. Create a candidate curation record outside the user-facing event-pack path.
   Mark uncertainty and missing evidence explicitly.
2. For every candidate source, prepare publisher, canonical URL, review date,
   reviewer, scope, and supported-claim summary.
3. The human reviewer assigns `approved`, `rejected`, or `needs_review`.
   Rejected and `needs_review` material remains outside a product pack.
4. Add only approved cards and dependent approved catalog data to the future
   `src/event-packs/il/<event-id>.json` path. Do not create that file until
   P4-02 or P6-02 approval is complete.
5. Run `validateApprovedEventPack` and the unit-test suite. Any missing
   metadata, unknown reference, invalid fact value, or non-approved card blocks
   implementation.
6. Record reviewer decisions and validation evidence in the applicable content
   approval work item before making content user-facing.

## Required pack anatomy

The schema requires stable IDs, declared fact types, decision-changing question
rationale, typed task timing, source references, verification labels, rule
expressions, and safety metadata. Source cards require:

- publisher;
- canonical URL;
- `reviewedOn` date;
- named `reviewer`;
- disposition;
- scope; and
- supported-claim summary.

`validateEventPack` checks schema and cross-references. `validateApprovedEventPack`
adds the product gate: every included source card must have disposition
`approved`. Both functions fail closed and return actionable validation errors.

## Escalation and non-goals

Escalate missing, changed, ambiguous, or unreviewed material to the project
owner/human reviewer. Exclude it until a dated disposition exists. This workflow
does not add a CMS, live retrieval, a second jurisdiction, source content,
policy rules, or a user-facing flow.
