# ADR 0003: Catalog-Driven Question Presentation

**Status:** Accepted
**Date:** 2026-07-17

## Context

The shared guided-planning interface needs to collect a small set of typed facts
without embedding event-specific controls, labels, validation, or accessibility
copy in React components. A date, text, or number entry must stay a validated
question capability rather than become a bespoke event flow.

## Decision

`QuestionDefinition` owns a validated `presentation` object. It contains the
user-visible prompt, optional description, rationale, and exactly one answer
mode:

- labelled choice options; or
- a typed `text`, `date`, or `number` input with optional format help, bounded
  constraints, and a catalog-owned validation message.

`allowSkip` remains the single required/optional signal. The generic renderer
uses native input semantics, a programmatic label, described-by relationships,
an alert for validation failure, and neutral shared controls such as “Continue”
and “Skip for now.” Typed values are parsed and checked before local context
changes. A skipped answer remains absent; it is never replaced with a guessed
value.

The model-selection boundary receives only question ID, fact ID, and rationale
key. It never receives, authors, or changes presentation copy or validation.

## Consequences

- Event packs can add bounded typed questions without new routes or
  event-specific UI conditions.
- Pack validation rejects incompatible typed input/fact types, invalid ranges,
  and ambiguous presentation modes.
- Existing choice questions use the same validated schema and renderer.
- This does not authorize any event content, source, rule, task, eligibility,
  or timing change; catalog content still requires its existing human-review
  gates.
