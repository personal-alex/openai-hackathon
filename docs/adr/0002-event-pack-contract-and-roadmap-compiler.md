# ADR 0002: Event-Pack Contract and Deterministic Roadmap Compiler

**Status:** Accepted  
**Date:** 2026-07-15

## Context

Life Navigator must use reviewed, attributable event-pack content while ensuring that GPT cannot select authoritative tasks, sources, timing, or policy outcomes. The product needs a deterministic, testable contract that serves `expecting_child` and `job_loss` through the same engine and can demonstrate safe portability without supporting a second jurisdiction.

## Decision

### Validation boundary

Zod schemas are the runtime source of truth for user input, AI output, event packs, compiler output, and persisted browser envelopes. Untrusted values are rejected before state mutation. Event packs load only after schema and cross-reference validation.

### Event-pack task selection

An event pack declares `baseTaskIds`, validated against its task catalog. The compiler applies this fixed sequence:

1. Base tasks.
2. Matching inclusions.
3. Matching exclusions.
4. Valid overrides of surviving tasks.
5. Deterministic sort by timing bucket, task priority, and task ID.

### Rules

Rules use constrained JSON expression trees with declared fact schemas. Context fact values validate before evaluation. `all: []` is true; `any: []` is false; missing facts only satisfy `exists: false`. Rules use integer priority and stable ID only as a tie-breaker. Same-priority conflicting overrides of a task field reject the pack; invalid or excluded override targets reject the pack.

### Timing

Tasks use a typed timing union: `planned`, `event_relative`, `milestone`, or `general`. Labels are catalog-owned. Unknown anchors result in general verification-oriented guidance, never an inferred date.

### Compiled roadmap, diff, and local progress

The compiler emits immutable catalog task data and `TaskDiff` data with approved explanation message keys. Browser-local `progressStatus` is a separate overlay and never affects event-pack or compiler selection. Progress changes do not create task diffs.

## Consequences

### Positive

- Task selection, sources, timing, and diffs are deterministic, explainable, fixture-testable, and independent of model prose.
- Conflicting/unreviewed pack content fails closed rather than producing hidden policy behavior.
- User completion state remains private/local and cannot corrupt catalog truth.
- The same contracts support multiple Life Events and safe incomplete-profile rejection.

### Costs and risks

- Event-pack authors must manage explicit IDs, priorities, and typed rule expressions.
- Contract changes require coordinated fixture, validator, and pack updates.
- The expression language intentionally limits future rule complexity; new operators require reviewed extension.

## Scope

This ADR does not authorize a second jurisdiction, authentication, product database, integrations, live retrieval, eligibility decisions, or policy-content invention.
