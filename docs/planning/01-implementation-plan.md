# Life Navigator — Implementation Plan

## Outcome

Deliver a public, Israel-only, English-only Life Navigator hackathon application with two polished, source-backed event flows that use the same validated contracts and deterministic roadmap compiler.

## Classification and authority

### Decided constraints

- Canonical event IDs are `expecting_child`, `job_loss`, and `move_home`.
- The product is a Next.js + TypeScript modular monolith with browser-local persistence, versioned event packs, a server-side AI boundary, and a deterministic roadmap compiler. `docs/technical-product-direction.md#6-architecture-direction`
- The complete flows are `expecting_child` and `job_loss`; `move_home` is stretch-only after explicit gates. `docs/technical-product-direction.md#4-product-scope`
- Zod validates state; GPT may interpret stated facts, choose allowlisted questions, and draft bounded explanations only. The compiler alone selects tasks, sources, timing, labels, and diffs. `docs/instructions/architecture-and-domain.md#ownership-boundaries`
- Reviewed IL content is the only user-facing jurisdiction. No authentication, integrations, live retrieval, eligibility determinations, advice, or sensitive-data storage. `AGENTS.md#non-negotiable-scope`
- Vitest covers contracts/compiler/fixtures and Playwright covers seeded end-to-end journeys. `docs/instructions/testing-and-demo.md#required-test-posture`

### Proposed implementation work

All backlog issues below are **Proposed** implementation work until separately started. Approval of this plan authorizes planning and documentation work, not any issue’s implementation without normal team direction.

### Open questions

- Rule grammar, precedence, and timing-window representation.
- Final source-review owner and checklist.
- Public-judging model operations: live calls versus validated deterministic fixtures.
- Warning, throttle, and fallback budget thresholds.

`CURRENT_STATE.md` must be aligned to this approved plan and the primary decision record as a documentation follow-up; it is not an implementation dependency.

## Milestones and proposed issue backlog

### M0 — Git and delivery bootstrap

#### P0-01 — Initialize repository delivery baseline

- **Classification:** Proposed
- **Outcome:** A reproducible repository baseline supports implementation, testing, and deployment.
- **Scope:** Next.js/TypeScript scaffold; `.gitignore`; environment template; scripts; README skeleton; CI; deployment configuration; commit conventions.
- **Dependencies:** Plan approval.
- **Acceptance criteria:** A clean clone installs and runs; lint/test commands are documented; secrets are excluded; README has setup, demo, safety, and test entry points.
- **Verification evidence:** Clean-install output, CI run, deployment preview.
- **Source references:** `docs/technical-product-direction.md#8-technology-choices`, `#13-planning-guidance-for-ai-agents`.
- **Risks:** Premature infrastructure complexity.
- **Out of scope:** Product flows, event content, and live AI behavior.

#### P0-02 — Establish Codex evidence and collaboration records

- **Classification:** Proposed
- **Outcome:** Material Codex work is truthfully traceable to reviewed artifacts and verification evidence.
- **Scope:** Primary thread, collaboration-record format, atomic commit/evidence practice.
- **Dependencies:** P0-01.
- **Acceptance criteria:** Required evidence fields are documented; accepted material work can link to artifact, commit, and verification result; no fabricated `/feedback` ID is recorded.
- **Verification evidence:** Human review of the template and first accepted entry.
- **Source references:** `docs/technical-product-direction.md#9-codex-development-strategy`, `docs/instructions/codex-collaboration.md#primary-build-thread`.
- **Risks:** Recording unapproved proposals as completed work.

### M1 — Architecture and product-flow decisions

#### P1-00 — Produce and approve the implementation HLD

- **Classification:** Proposed
- **Outcome:** An approved, minimal HLD defines ownership and recommends the concrete decisions needed before dependent implementation.
- **Scope:** Client/local state; server AI boundary; event-pack loading; compiler I/O; source provenance; jurisdiction separation; and concrete recommendations for schema, rule, timing, diff, fallback, and validation decisions.
- **Dependencies:** P0-01.
- **Acceptance criteria:** Diagrams/interfaces cover every boundary; the HLD recommends concrete schema, rule, timing, diff, fallback, and validation decisions; it explicitly lists only the decisions requiring human approval before dependent implementation; it introduces no database, RAG, queues, microservices, or autonomous agents.
- **Verification evidence:** Human-approved HLD review record.
- **Source references:** `docs/technical-product-direction.md#6-architecture-direction`, `docs/technical-product-direction.md#13-planning-guidance-for-ai-agents`, `docs/instructions/architecture-and-domain.md#before-implementation`.
- **Risks:** Prematurely freezing UX or content decisions.

#### P1-UX — Produce and approve UX/product-flow decision

- **Classification:** Proposed
- **Outcome:** An approved interaction recommendation makes roadmap dynamics understandable and testable without pre-deciding layout.
- **Scope:** Intake/confirmation; sequential questions and “why”; roadmap states; source/task inspection; context editing and diffs; status; reset; degraded AI behavior; accessibility.
- **Dependencies:** P1-00.
- **Acceptance criteria:** Covers every required capability and degraded state; distinguishes confirmed, inferred, general, and verification-required guidance; recommends testable experience requirements without prescribing unapproved layout.
- **Verification evidence:** Human-approved UX-flow brief or prototype review.
- **Source references:** `docs/technical-product-direction.md#5-experience-requirements`, `#13-planning-guidance-for-ai-agents`.
- **Risks:** UX presentation conflicts with safety/provenance requirements.

### M2 — Shared contracts and validated event-pack foundation

#### P2-01 — Define domain and event-pack contracts

- **Classification:** Proposed
- **Outcome:** Zod schemas and TypeScript types define generic `LifeEvent`, `UserContext`, `Question`, `SourceCard`, `Task`, `Roadmap`, `TaskDiff`, `JurisdictionProfile`, and `EventPack` contracts.
- **Scope:** Runtime validation, stable IDs, approved task/source/safety anatomy, and the canonical event-ID union.
- **Dependencies:** P1-00; P1-UX; HLD decisions needing human approval.
- **Acceptance criteria:** Invalid user, model, event-pack, and roadmap state is rejected; task and source-card required metadata is enforced; canonical event IDs are accepted.
- **Verification evidence:** Vitest valid/invalid validation matrix.
- **Source references:** `docs/technical-product-direction.md#6-architecture-direction`, `#7-event-pack-contract`, `docs/instructions/trust-safety-and-sources.md#event-pack-requirements`.
- **Risks:** Contract churn if HLD approvals are incomplete.

#### P2-02 — Define source-review and event-pack authoring workflow

- **Classification:** Proposed
- **Outcome:** Contributors can safely create reviewed, attributable packs without inventing policy claims.
- **Scope:** File layout, review checklist, source linting, owner field, and escalation path for missing content.
- **Dependencies:** P1-00; P1-UX; P2-01; source-review-owner decision.
- **Acceptance criteria:** Missing task/source/safety metadata fails validation; every high-stakes claim needs a reviewed source card; workflow blocks unreviewed IL claims.
- **Verification evidence:** Invalid-pack/source fixtures.
- **Source references:** `docs/instructions/trust-safety-and-sources.md#source-card-requirements`, `references/regulations/README.md#required-metadata-for-every-source`.
- **Risks:** Content bottleneck without reviewer assignment.

### M3 — Deterministic roadmap engine

#### P3-01 — Implement deterministic roadmap compiler and task diff

- **Classification:** Proposed
- **Outcome:** Pure functions compile validated pack/context input into approved roadmap steps and explainable diffs.
- **Scope:** Rule evaluation, selection, timing, sources, labels, stable ordering, and added/removed/changed task diff.
- **Dependencies:** P1-00; P1-UX; P2-01; approved HLD rule/timing/diff decisions.
- **Acceptance criteria:** Identical valid inputs yield identical output; only catalog tasks/sources occur; context changes yield explicit diffs; unknown facts do not trigger inference.
- **Verification evidence:** Table-driven Vitest cases with exact IDs, timing, sources, statuses, labels, and diffs.
- **Source references:** `docs/technical-product-direction.md#6-architecture-direction`, `docs/instructions/architecture-and-domain.md#ownership-boundaries`.
- **Risks:** Ambiguous precedence or hidden event-specific branches.
- **Out of scope:** Model calls, UI rendering, source curation.

#### P3-02 — Add portability fixture and compiler contract tests

- **Classification:** Proposed
- **Outcome:** The same contract compiles IL content and safely rejects an incomplete non-production template profile.
- **Scope:** IL fixture, non-user-selectable template, safe rejection tests.
- **Dependencies:** P2-01; P3-01.
- **Acceptance criteria:** Template has no real advice/claims; incomplete profile fails safely; IL compiles through the same contract.
- **Verification evidence:** Vitest contract-test output.
- **Source references:** `docs/technical-product-direction.md#jurisdiction-portability-proof`, `docs/instructions/testing-and-demo.md#minimum-compiler-evidence`.
- **Risks:** Representing the fixture as second-jurisdiction support.

### M4 — Expecting-child content and reference experience

#### P4-01 — Research and curate candidate expecting-child content

- **Classification:** Proposed
- **Outcome:** Candidate IL sources, questions, tasks, rules, safety wording, and seeded scenarios are ready for review, not product use.
- **Scope:** Provenance, event boundaries, decision-changing questions, candidate tasks/rules, uncertainties.
- **Dependencies:** P2-02.
- **Acceptance criteria:** Every candidate claim is traceable to a candidate source; uncertainty is marked; no candidate content is user-facing.
- **Verification evidence:** Curation packet and provenance checklist.
- **Source references:** `docs/instructions/trust-safety-and-sources.md#source-card-requirements`, `references/life-events/README.md#each-event-package-should-include`.
- **Risks:** Candidate content mistaken for reviewed guidance.

#### P4-02 — Human-review and approve expecting-child content

- **Classification:** Proposed
- **Outcome:** The team approves or rejects candidate source cards, tasks, rules, and safety wording.
- **Scope:** Provenance, review dates, claim scope, safety language, and verification prompts.
- **Dependencies:** P4-01; assigned source/safety reviewer.
- **Acceptance criteria:** Each high-stakes claim has required metadata; each candidate has an approval/rejection disposition; unresolved content is excluded.
- **Verification evidence:** Human sign-off record.
- **Source references:** `docs/technical-product-direction.md#required-event-pack-qualities`, `docs/instructions/trust-safety-and-sources.md#event-pack-requirements`.
- **Risks:** Missing reviewer or policy change during review.

#### P4-03 — Implement approved expecting-child pack and reference experience

- **Classification:** Proposed
- **Outcome:** Only approved `expecting_child` content powers the validated pack, fixtures, and first polished user flow.
- **Scope:** Pack data, rules, source cards, fixtures, intake/questions, task inspection, diffs, statuses, reset, and local persistence according to the approved UX flow.
- **Dependencies:** P1-UX; P3-01; P4-02.
- **Acceptance criteria:** Pack/lint/tests pass; roadmap refreshes without reload; task inspection shows required metadata; edits explain changes; reset clears local state.
- **Verification evidence:** Vitest/lint output; seeded Playwright journey; accessibility review.
- **Source references:** `docs/technical-product-direction.md#5-experience-requirements`, `#7-event-pack-contract`, `#12-quality-gates`.
- **Risks:** Unapproved content or UX divergence from approved flow.

### M5 — AI boundary, fallback, and observability

#### P5-01 — Implement structured AI orchestration boundary

- **Classification:** Proposed
- **Outcome:** Server-only routes validate structured extraction, allowlisted questions, and bounded explanations.
- **Scope:** Zod validation, allowlist enforcement, error paths, and redacted telemetry hooks.
- **Dependencies:** P1-00; P2-01; P3-01; live-versus-fixture decision.
- **Acceptance criteria:** Invalid output cannot mutate state; models cannot inject tasks/sources/timing/rules/determinations; prompts use only relevant facts and allowlisted IDs.
- **Verification evidence:** Mock-model validation/failure tests.
- **Source references:** `docs/technical-product-direction.md#non-negotiable-separation-of-responsibility`, `#token-and-cost-controls`.
- **Risks:** Prompt injection, invalid output, budget overruns.

#### P5-02 — Implement fallback and privacy-preserving telemetry

- **Classification:** Proposed
- **Outcome:** Useful deterministic behavior persists when AI fails, without logging sensitive text.
- **Scope:** Configurable limits, fallback, redacted logs, developer budget/health summary.
- **Dependencies:** P5-01; budget-threshold decision.
- **Acceptance criteria:** Controlled fallback covers required failures; logs exclude raw stories/documents/secrets; required telemetry is inspectable.
- **Verification evidence:** Failure-mode tests; redaction inspection; health-summary demonstration.
- **Source references:** `docs/technical-product-direction.md#minimum-observability`, `docs/instructions/testing-and-demo.md#demo-reliability`.
- **Risks:** Personal data in logs; a fallback dependent on live services.

### M6 — Job-loss content and integration

#### P6-01 — Research and curate candidate job-loss content

- **Classification:** Proposed
- **Outcome:** Candidate IL job-loss sources, questions, tasks, rules, safety wording, and seeded scenarios are ready for review.
- **Scope:** Candidate-only curation and provenance; no eligibility conclusions.
- **Dependencies:** P2-02.
- **Acceptance criteria:** Claims are attributable; uncertainty is marked; no candidate guidance is user-facing.
- **Verification evidence:** Curation packet and provenance checklist.
- **Source references:** `docs/instructions/trust-safety-and-sources.md#source-card-requirements`.
- **Risks:** Unsupported employment/benefits implications.

#### P6-02 — Human-review and approve job-loss content

- **Classification:** Proposed
- **Outcome:** Human-approved job-loss content is ready for shared-contract implementation.
- **Scope:** Review source cards, tasks, questions, rules, and safety wording.
- **Dependencies:** P6-01; assigned reviewer.
- **Acceptance criteria:** Each item is approved or rejected; unresolved material is excluded.
- **Verification evidence:** Human sign-off record.
- **Source references:** `docs/technical-product-direction.md#required-event-pack-qualities`.
- **Risks:** Missing reviewer or unsuitable urgency language.

#### P6-03 — Implement approved job-loss pack and integration

- **Classification:** Proposed
- **Outcome:** Approved `job_loss` content uses the shared contracts, compiler, UX grammar, source inspection, diffs, reset, and fallback.
- **Scope:** Pack/fixtures and full seeded user journey; no bespoke page or prompt chain.
- **Dependencies:** P1-UX; P3-01; P4-03; P5-02; P6-02.
- **Acceptance criteria:** Pack/lint and exact fixtures pass; seeded Playwright journey passes; UI renders only catalog content.
- **Verification evidence:** Vitest/lint output; Playwright run; manual seeded demo.
- **Source references:** `docs/instructions/architecture-and-domain.md#domain-rules`, `docs/instructions/testing-and-demo.md#minimum-compiler-evidence`.
- **Risks:** Child-flow assumptions leaking into the job-loss flow.

### M7 — Demo, deployment, and submission proof

#### P7-01 — Establish seeded demo and release checks

- **Classification:** Proposed
- **Outcome:** Both flows run repeatedly without fragile live dependencies.
- **Scope:** Seeded scenarios, reset, validated fixtures/cached responses, release checklist, emergency procedure.
- **Dependencies:** P4-03; P5-02; P6-03.
- **Acceptance criteria:** Both seeded journeys pass; ten clean runs complete before recording; emergency procedure exposes no secrets or personal data.
- **Verification evidence:** Playwright output, ten-run checklist, rehearsal recording.
- **Source references:** `docs/technical-product-direction.md#demo-reliability-requirements`, `docs/instructions/testing-and-demo.md#demo-reliability`.
- **Risks:** Deployment differs from rehearsal or includes hidden live dependency.

#### P7-02 — Deploy and assemble submission evidence

- **Classification:** Proposed
- **Outcome:** Public application, judge-accessible repository, README, video, and truthful Codex/GPT evidence are ready.
- **Scope:** Deployment, README, limitations/sources/safety evidence, video checklist, final `/feedback` record.
- **Dependencies:** P0-02; P7-01.
- **Acceptance criteria:** Deployment is resettable with no exposed secrets; README meets submission requirements; video is under three minutes; feedback ID is recorded only after submission.
- **Verification evidence:** Production URL, access check, final checklist, video URL.
- **Source references:** `docs/technical-product-direction.md#submission-acceptance`, `docs/instructions/codex-collaboration.md#primary-build-thread`.
- **Risks:** Unsupported Codex claims or inaccessible repository.

### M8 — Optional moving-home flow

#### P8-01 — Decide moving-home scope gate

- **Classification:** Proposed
- **Outcome:** A recorded binary go/no-go decision controls whether `move_home` begins.
- **Scope:** Evaluate M0–M7 evidence, deadline, and capacity.
- **Dependencies:** All quality gates below.
- **Acceptance criteria:** Decision has evidence for every gate and confirms no compromise to core work.
- **Verification evidence:** Approved scope-gate record.
- **Source references:** `docs/technical-product-direction.md#scope-rules`, `#resolved-assumptions-and-remaining-decisions`.
- **Risks:** Scope expansion compromises core demo quality.

#### P8-02 — Implement engine-powered move-home stretch flow

- **Classification:** Proposed
- **Outcome:** If approved, `move_home` proves extensibility through the same contracts and UX grammar.
- **Scope:** Reviewed IL pack, fixtures, source cards, safety review, seeded journey.
- **Dependencies:** P8-01.
- **Acceptance criteria:** No bespoke compiler branch/static mockup; validation/lint/fixtures/Playwright pass; core evidence remains green.
- **Verification evidence:** Tests, demo, and review sign-off.
- **Source references:** `docs/technical-product-direction.md#scope-rules`, `#definition-of-done`.
- **Risks:** Unreviewed content or regressions to core flows.

## Critical path for the hackathon demo

`P0-01 → P0-02 → P1-00 (HLD) → P1-UX (UX/product-flow) → P2-01 → P2-02 → P3-01 → P4-01 → P4-02 → P4-03 → P5-01 → P5-02 → P6-01 → P6-02 → P6-03 → P7-01 → P7-02`

P3-01 and P6-01 can proceed after P2-02 in parallel; the critical path retains the first completed content-review path. UI implementation waits for P1-UX, approved event content, and compiler dependencies.

## Quality gates before move_home can begin

- [ ] Both complete IL flows have approved packs, source cards, safety wording, validation, and source linting.
- [ ] Both flows ask at least three purposeful questions and visibly change a roadmap after meaningful answers.
- [ ] Determinism, exact fixture output, explainable diffs, unknown-fact handling, and incomplete-profile rejection are covered by tests.
- [ ] Both seeded Playwright journeys pass; fallback works; logs are redacted; no fragile live retrieval is required.
- [ ] Ten clean rehearsals, deployment readiness, README evidence, and emergency procedure are complete.
- [ ] The team records a binary scope-gate decision with a deadline/capacity assessment.

Sources: `docs/technical-product-direction.md#12-quality-gates`, `docs/instructions/testing-and-demo.md`.

## Plan-level non-goals

- No Linear work until explicitly authorized.
- No second jurisdiction, authentication, integrations, reminders, submissions, RAG, autonomous agents, or sensitive profiles.
- No invented IL policy facts, sources, rules, eligibility claims, or deadlines.
- No UX layout is frozen before the approved product-flow decision.
