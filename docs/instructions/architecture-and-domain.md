# Architecture and Domain Instructions

Read this file before changing domain contracts, event packs, the roadmap
compiler, AI orchestration, or package/module boundaries.

## Architectural decision

Build one Next.js + TypeScript modular monolith with a server-side model
boundary, versioned event packs, browser-local persistence, and a pure,
deterministic roadmap compiler.

## Ownership boundaries

- GPT-5.6 Structured Outputs may interpret event text, extract explicitly stated
  facts, choose an allowlisted next question, and draft bounded explanations.
- Zod validates user, model, event-pack, and roadmap state at boundaries.
  Invalid model output must not mutate application state.
- The deterministic compiler alone selects tasks, sources, timing,
  verification/confidence labels, and roadmap diffs using approved event-pack
  content and explicit rules.
- The UI renders validated catalog data and does not derive business logic.

## Domain rules

- Use generic concepts: `LifeEvent`, `UserContext`, `EventPack`, `Question`,
  `SourceCard`, `Task`, `Roadmap`, and `TaskDiff`.
- Add events through versioned data and rules, not bespoke pages or prompt chains.
- Unknown information remains unknown. Do not infer sensitive facts.
- Do not let models invent task IDs, rules, source URLs, timing, policy facts, or
  eligibility claims.
- Prefer pure functions and small explicit modules. Do not add a top-level
  service unless an existing boundary cannot reasonably own the behavior.

## Before implementation

State the exact relevant spec source, identify undecided schema/rule/timing
questions, and propose the smallest testable interface. Use an ADR for durable
architecture decisions. Update `CURRENT_STATE.md` after accepted decisions.
