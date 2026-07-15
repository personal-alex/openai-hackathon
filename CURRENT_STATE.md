# Current State

Last updated: 2026-07-14

## Product status

**Phase:** Hackathon concept / bootstrap

**MVP definition:** A Life Event Navigator that turns a user's described situation into a personalized, explainable action roadmap. It does not execute external actions.

## Confirmed product decisions

- The primary domain abstraction is a **Life Event**, not an institution or form.
- The project is platform-first; one demo event must not determine the system's architecture.
- The first polished demo candidate is **expecting a first child**.
- The product produces structured roadmaps, with explanations layered on top.
- The MVP remains navigation-only: no form submission, account access, payments, bookings, or other external execution.

## Candidate life events

- Expecting / having a first child
- Marriage
- Job loss and job search
- Bereavement
- Military enlistment
- Moving home
- Retirement

## Current implementation

No application implementation has been established yet. This bootstrap package defines project guidance and documentation only.

## Open decisions

- Final demo event and target jurisdiction
- Application stack and deployment target
- Source-ingestion and retrieval approach
- JSON schemas for event classification, user context, questions, and roadmap steps
- Evaluation scenarios and acceptance criteria
- UX flow and visual roadmap representation

## 2026-07-15 — Approved implementation plan

- The approved delivery plan is `docs/planning/01-implementation-plan.md`.
- The canonical event IDs are `expecting_child`, `job_loss`, and `move_home`.
- Remaining pre-implementation decisions are the HLD recommendations requiring human approval and the UX/product-flow decision; implementation must follow the approved plan's dependency order.

## 2026-07-15 — Approved HLD and compiler contract

- The approved HLD is `docs/architecture/01-hld.md`; it defines the modular-monolith boundaries, validated event-pack flow, structured AI boundary, local persistence/reset, and deterministic test strategy.
- ADR 0002 (`docs/adr/0002-event-pack-contract-and-roadmap-compiler.md`) records the validated event-pack/roadmap-compiler contract: base-task selection, rule precedence, timing union, immutable roadmap data, task diffs, and local progress overlay.

## 2026-07-15 — Approved UX product flows

- The approved UX decision package is `docs/ux/01-product-flows.md`; it defines event-led confirmation, roadmap/task-diff behavior, safety/degraded states, accessibility, and seeded demo journeys for `expecting_child` and `job_loss`.
- Remaining work is reviewed event-pack/source-card/safety-policy content, including final question, task, source, verification-label, and acknowledgement availability/copy decisions.

## 2026-07-15 — P0-01 local bootstrap complete

- P0-01 established the local Next.js/TypeScript delivery baseline with Node 24/npm 11 constraints, npm lockfile, lint/test harnesses, and CI configuration.
- Passed locally: `npm ci`, `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, Playwright Chromium installation, and `npm run test:e2e`.
- Initial commit `2f04320` was pushed to `origin/master`; P0-02 is in progress.

## 2026-07-15 — P2-01 validated domain contracts complete

- `src/domain-contracts` now provides Zod/TypeScript contracts for canonical event IDs, IL event packs, context facts, questions, source cards, tasks, rules, timing, safety metadata, immutable roadmaps, task diffs, and browser-local progress.
- Event-pack cross-references and pack-scoped fact values fail closed; the implementation contains no reviewed event-policy content, compiler logic, model integration, or product flow.
- Passed: `npm run lint`, `npm run typecheck`, `npm run test` (2 files, 6 tests), `npm run build`, and `npm run test:e2e`.

## 2026-07-15 — P2-02 source-review and event-pack authoring workflow complete

- `docs/event-pack-authoring.md` separates candidate curation, human review, and approved-pack implementation; the project owner/human reviewer records dated source-card dispositions.
- `validateApprovedEventPack` blocks any source card without an approved disposition; required source metadata now includes a named reviewer.
- Passed: `npm run lint`, `npm run typecheck`, `npm run test` (2 files, 7 tests), `npm run build`, and `npm run test:e2e`.

## 2026-07-15 — P3-01 deterministic roadmap compiler complete

- `src/roadmap-compiler` compiles only validated catalog tasks through base selection, matching inclusions, matching exclusions, valid overrides, and stable timing/priority/ID ordering.
- It preserves unknown facts, falls back unknown timing anchors to general guidance, rejects conflicting same-priority overrides, and emits deterministic added/changed/removed task diffs; local progress remains outside compiler input and output.
- Passed: `npm run lint`, `npm run typecheck`, `npm run test` (3 files, 11 tests), `npm run build`, and `npm run test:e2e`.

## 2026-07-15 — P3-02 portability contract proof complete

- A non-production, non-user-selectable IL-shaped contract fixture compiles through the shared validator and roadmap compiler; it contains no real advice or source claim.
- A deliberately incomplete jurisdiction template fixture fails validation safely. No second jurisdiction or country selector was introduced.
- Passed: `npm run lint`, `npm run typecheck`, `npm run test` (4 files, 13 tests), `npm run build`, and `npm run test:e2e`.

## 2026-07-15 — P3-03 structured seeded MVP shell complete

- The judge-facing App Router shell uses test-only `expecting_child` and `job_loss` scenarios, a clear scenario-state boundary, deterministic compiled roadmaps, and fixed fixture explanations.
- No approved event content, live AI, source URLs, persistence, authentication, or country selector was introduced; the shell is structured to accept reviewed packs and future interaction modules.
- Passed: `npm run lint`, `npm run typecheck`, `npm run test` (4 files, 13 tests), `npm run build`, and `npm run test:e2e`.

## 2026-07-15 — Bounded AI orchestration boundary complete

- Under the user-authorized P4-01 delivery scope, `src/ai-orchestrator` now validates Structured Output event suggestions and allowlisted next-question selection; it cannot create catalog tasks, sources, rules, timing, or eligibility conclusions.
- The routes apply opaque-session rate limits, output caps, one bounded upstream retry/repair path, redacted telemetry, and deterministic fallbacks. Seeded demo mode remains network-free and never consumes AI quota.
- No reviewed server-side event-pack registry exists yet, so runtime routes fail closed rather than use test fixtures or unreviewed content; deployed live calls remain disabled pending a shared server-side guard adapter.
- Passed: `npm run lint`, `npm run typecheck`, `npm run test` (5 files, 19 tests), `npm run build`, and `npm run test:e2e`.

## 2026-07-15 — Life-event authoring skill integrated

- The draft-only repository-local skill `.agents/skills/life-event-authoring/` was reviewed and integrated from worktree branch `codex/life-event-authoring-skill`, originating commit `5dd341ea164b627a7f149275468db1c249749024`, as integration commit `2cdd0181664f19551b0a40785f5c294c113a6980`.
- It provides candidate source-card, event-proposal, question-minimization, and reviewer-gate templates without changing event-pack contracts, registries, runtime content, compiler behavior, or user flows.
- Every generated source, claim, rule, task, question, and safety note remains candidate-only pending dated human review, explicit catalog approval, and separate implementation authorization.

## Deferred / explicitly out of scope for MVP

- Government or commercial-system integrations
- Form completion or submission
- Automated eligibility decisions
- Long-lived user profiles and sensitive-document storage
- Legal, medical, tax, or financial advice

## Update protocol

After a meaningful scope, domain, architecture, prompt, or evaluation decision:

1. Append a dated update here.
2. Record the history in basic-memory project `openai-hackathon`.
3. Add or update an ADR when the decision has lasting architectural consequences.
