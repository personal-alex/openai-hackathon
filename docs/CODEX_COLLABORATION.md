# Codex Collaboration Record

This file records material, verifiable Codex-assisted work for the OpenAI Build
Week submission. It is a concise evidence log, not a transcript.

## Primary implementation thread

- Codex thread: Primary local implementation thread; no external session ID is claimed here
- `/feedback` session ID: To be recorded after feedback is submitted
- Scope: Scaffold, contracts, event packs, compiler, tests, product integration,
  deployment, and submission materials

## Entries

### 2026-07-17 — Catalog-driven typed-question capability

- Task/outcome: Replaced the blocked candidate branch’s hard-coded typed-date control with a generic main-thread capability for validated catalog questions.
- Codex contribution: Added the Zod question-presentation/input boundary, generic accessible renderer and parser, choice-question migration, focused contract/component tests, and ADR 0003.
- Human review/decision: The shared UI contains no job-loss, employment, or date-specific copy or matcher. Fixture/catalog data owns prompts, descriptions, rationales, typed constraints, validation wording, and seeded statement hints; skipped facts remain absent.
- Changed artifacts: Domain contract, generic question renderer, approved expecting-child presentation data, seeded fixtures, unit tests, and ADR. No job-loss pack, source card, rule, registry, compiler selection, or policy content changed.
- Evidence: `git diff --check`, `npm run lint`, `npm run typecheck`, `npm run test` (8 files, 45 tests), `npm run build`, and `npm run test:e2e` (13 Chromium journeys) passed. The candidate integration remains pending a dedicated branch adaptation and merge-readiness review.

### 2026-07-16 — Judge-ready seeded UX refactor

- Task/outcome: Implemented the approved visual and interaction direction as Linear issues OPE-25, OPE-26, and OPE-27: an independently branded opening experience, compiler-driven guided fixture workspace, and responsive/accessibility proof.
- Codex contribution: Added the original continuous-route/north-star SVG mark and favicon; warm responsive UI tokens; event confirmation and optional/skip acknowledgement; one-question fixture flow; deterministic roadmap-diff presentation; task provenance/rationale/verification/local-progress disclosure; and focused Playwright journeys.
- Human review/decision: The supplied concepts were treated as visual/interaction direction rather than a pixel-perfect design. No new policy/source/task content was approved: every added question, task, source card, and explanation remains synthetic fixture-only pending dated human content review.
- Changed artifacts: App Router UI, original brand assets, seeded test fixtures, end-to-end journey coverage, `CURRENT_STATE.md`, and this evidence record.
- Evidence: Linear OPE-25/OPE-26/OPE-27; `npm run lint`, `npm run typecheck`, `npm run test` (5 files, 24 tests), `npm run build`, and `npm run test:e2e` (3 passed); manual 1440px desktop and 390px mobile browser inspection with no console errors.
- Verification: The deterministic compiler remains the only source of selected tasks, timings, sources, and diffs; seeded mode stays network-free and the UI presents no eligibility conclusion or reviewed external source.
### 2026-07-17 — Routine Israeli-hospital newborn-registration candidate correction

- Task/outcome: Updated the `expecting_child` candidate/review artifacts with a
  dated, human-directed scope decision: **Approved with scope: routine birth in
  an Israeli hospital.**
- Codex contribution: Inspected the provided primary Authority procedure and
  official Authority/Ministry pages; revised the candidate evidence ledger,
  proposal, reviewer gate, review-deck outline, and validation record. Added a
  clearly `testOnly` routing fixture and deterministic compiler checks for
  routine hospital, conditional missing-first-name, and non-hospital/unknown
  verification routes.
- Human review/decision: The supplied worktree directive approved only the
  stated normal-path source scope. It retained explicit `birth_occurred`
  confirmation, kept special cases excluded/deferred, and prohibited runtime
  activation.
- Changed artifacts: Candidate packet, `CURRENT_STATE.md`,
  `tests/fixtures/expecting-child-transition.ts`, and
  `tests/unit/roadmap-compiler/transition-gates.test.ts`; commit
  `877b8c1af58c707126b1db3cc12e23f55d80b650`.
- Verification: `git diff --check`, `npm run lint`, `npm run typecheck`,
  `npm run test` (6 files, 27 tests), and `npm run build` passed. The
  approved-runtime validator rejects the fixture because it is test-only.

### 2026-07-17 — Main-thread review and integration of expecting-child candidate artifacts

- Task/outcome: Reviewed and merged branch `codex/il-expecting-child-candidate-pack`, including commits `877b8c1af58c707126b1db3cc12e23f55d80b650` and `6449d3fca6845f05001684c3b59f96b761134a2e` and their required candidate-packet/transition-gate ancestry.
- Human review/decision: **Approved with scope: routine birth in an Israeli hospital.** The system-led routine statement applies only where the newborn is eligible for entry in Israel’s Population Registry; it does not mean every newborn born in an Israeli hospital automatically receives an Israeli ID.
- Boundary: The merge contains reviewed candidate authoring materials and a generic, test-only confirmed-transition proof only. It does not register or activate a runtime `expecting_child` pack, source-card registry entry, production compiler input, route, or user-facing roadmap content.
- Verification: Main-thread review confirms the four approved canonical official URLs, explicit `birth_occurred`/Israeli-hospital routing, excluded special cases, and approved-runtime rejection of the `testOnly` fixture. Full verification is rerun before the integration commit.

### 2026-07-15 23:05 IDT — Delegated candidate IL event-pack authoring worktree

- Purpose: Prepare the first evidence-backed, candidate-only Israel Life Navigator event template/pack for human review using the repository-local `life-event-authoring` skill.
- Scope and base: Dedicated worktree from pushed `master` commit `ed5a47060d0221b9c05b0faa850a1aaea3ee79bc`; candidate curation only for `expecting_child`, including an evidence ledger, catalog-shaped facts/questions/source cards/tasks/rules/timing/safety/demo proposal, and focused schema/compiler validation evidence.
- Expected outputs: Review-required candidate artifacts outside runtime pack paths; authoritative-source provenance; explicit uncertainties; human-review checklist/gate; branch commit(s) and verification report.
- Ownership boundaries: The worktree may not change application features, shared contracts, compiler behavior, the authoring skill, or Linear. It must not activate catalog content, infer eligibility, present legal/medical/tax/financial conclusions, or add live product retrieval; only the main thread may integrate its branch.
- Required review gates: A named human must record dated source dispositions and approve each claim, task, rule, question, timing, safety label, and implementation authorization. Integration remains a main-thread decision after review; a candidate pack is never user-facing by default.

### 2026-07-15 — P0-02 Codex evidence baseline complete

- Task/outcome: Established the durable evidence baseline for Linear OPE-6.
- Codex contribution: Maintained the primary-thread record, dated material-work entries, artifact/commit/verification references, delegation provenance, and cross-linked memory updates.
- Human review/decision: Human review remains required for scope, safety, source, and product decisions; no `/feedback` session ID has been fabricated or recorded.
- Changed artifacts: `docs/CODEX_COLLABORATION.md`, `CURRENT_STATE.md`, and the configured project memory record.
- Evidence: OPE-6; prior accepted records for bootstrap, contracts, compiler, seeded shell, AI boundary, and worktree integration; current M5 commit `819ce13`.
- Verification: Documentation review confirms required evidence fields and explicit no-fabrication boundary.

### 2026-07-15 — Delegated life-event authoring skill worktree

- Purpose: Delegate a reusable repository-local skill for controlled, evidence-backed draft proposals for future Life Events.
- Isolated worktree scope: Create the skill under the established `.agents/skills/` convention, with only essential supporting documentation or focused fixtures/tests, on branch `codex/life-event-authoring-skill`; do not change application features, compiler behavior, shared contracts, existing event-pack policy content, package files, `CURRENT_STATE.md`, or this record after this entry.
- Expected deliverables: A repeatable research/provenance workflow; source-card and candidate-event proposal templates; decision-changing question guidance; reviewer checklist and approval gate; a clearly synthetic, unapproved example; and focused validation evidence.
- Human-review boundary: Every resulting source, claim, task, rule, question, safety note, and event proposal is draft-only and cannot become catalog-approved or user-facing without explicit human review and approval.

### 2026-07-15 — P0-01 repository delivery baseline

- Task/outcome: Completed the local bootstrap baseline for Linear issue OPE-5.
- Codex contribution: Scaffolded the minimal Next.js App Router/TypeScript application, npm runtime metadata and lockfile, environment and ignore templates, lint/typecheck/test configuration, Playwright smoke coverage, GitHub Actions CI, and README delivery guidance.
- Human review/decision: Approved npm 11, Node 24, exact initial dependency pins, TypeScript 6.x, the no-empty-module-directory approach, and the bounded non-product scaffold scope; ESLint 9.39.5 replaced incompatible ESLint 10 after verification.
- Changed artifacts: Application shell; package/runtime/configuration files; unit and end-to-end scaffold tests; CI workflow; README.
- Evidence: Linear OPE-5; `npm ci`, `npm run lint`, `npm run typecheck`, `npm run test` (1 passed), `npm run build`, Playwright Chromium installation, and `npm run test:e2e` (1 passed).
- Verification: All listed checks passed locally. Commit `2f04320` was pushed to `origin/master`; no `/feedback` session ID is recorded.

### 2026-07-15 — P2-01 validated domain and event-pack contracts

- Task/outcome: Implemented the shared Zod/TypeScript validation boundary for Linear issue OPE-9.
- Codex contribution: Added canonical event, IL pack, fact/context, question, source-card, task, timing, rule-expression, safety, roadmap, diff, and local-progress contracts plus cross-reference and pack-scoped fact-value validation.
- Human review/decision: Implemented the approved HLD and ADR 0002 contract decisions; no event-policy, source, or safety-policy content was introduced.
- Changed artifacts: `src/domain-contracts`; domain-contract Vitest matrix; pinned Zod dependency and lockfile; Vitest alias configuration; project records.
- Evidence: Linear OPE-9; `npm run lint`, `npm run typecheck`, `npm run test` (2 files, 6 tests), `npm run build`, and `npm run test:e2e` (1 passed).
- Verification: All listed checks passed locally. No `/feedback` session ID is recorded.

### 2026-07-15 — P2-02 source-review and event-pack authoring workflow

- Task/outcome: Implemented the reviewed event-pack authoring workflow for Linear issue OPE-10.
- Codex contribution: Added an authoring checklist, named-reviewer source-card requirement, and product-pack review gate that rejects non-approved source cards.
- Human review/decision: Implemented the approved source-review ownership and dated-disposition requirements; no source, policy, safety-copy, or event-pack content was added.
- Changed artifacts: Authoring workflow documentation; source-card contract; event-pack review validator; contract matrix; project records.
- Evidence: Linear OPE-10; `npm run lint`, `npm run typecheck`, `npm run test` (2 files, 7 tests), `npm run build`, and `npm run test:e2e` (1 passed).
- Verification: All listed checks passed locally. No `/feedback` session ID is recorded.

### 2026-07-15 — P3-01 deterministic roadmap compiler

- Task/outcome: Implemented the pure deterministic roadmap compiler and task-diff boundary for Linear issue OPE-11.
- Codex contribution: Added approved rule-expression semantics, base/inclusion/exclusion/override selection, stable sort, unknown-anchor fallback, conflict rejection, and immutable catalog diff generation.
- Human review/decision: Implemented HLD and ADR 0002 decisions; no event-policy content, source curation, model call, UI flow, or local-progress authority was added.
- Changed artifacts: Compiler module; compiler test matrix; domain-contract type exports; project records.
- Evidence: Linear OPE-11; `npm run lint`, `npm run typecheck`, `npm run test` (3 files, 11 tests), `npm run build`, and `npm run test:e2e` (1 passed).
- Verification: All listed checks passed locally. No `/feedback` session ID is recorded.

### 2026-07-15 — P3-02 portability contract proof

- Task/outcome: Implemented the non-production portability fixture and contract tests for Linear issue OPE-12.
- Codex contribution: Added an IL-shaped schema fixture that compiles through shared validation/compiler contracts and an intentionally incomplete template fixture that fails safely.
- Human review/decision: Preserved the Israel-only boundary: fixtures contain no real advice or source claims and create no second-jurisdiction journey.
- Changed artifacts: Test-only portability fixtures, compiler contract tests, and project records.
- Evidence: Linear OPE-12; `npm run lint`, `npm run typecheck`, `npm run test` (4 files, 13 tests), `npm run build`, and `npm run test:e2e` (1 passed).
- Verification: All listed checks passed locally. No `/feedback` session ID is recorded.

### 2026-07-15 — P3-03 structured seeded MVP shell

- Task/outcome: Implemented the judge-facing seeded roadmap shell for Linear issue OPE-24.
- Codex contribution: Added App Router scenario state, test-only packs, deterministic compiler projection, controlled explanation copy, responsive shell styling, and seeded Playwright coverage.
- Human review/decision: Kept the shell within the approved UX/HLD boundary; no policy/source content, live AI, persistence, authentication, or country selection was added.
- Changed artifacts: Test-fixture scenarios; App Router shell and styles; seeded browser test; project records.
- Evidence: Linear OPE-24; `npm run lint`, `npm run typecheck`, `npm run test` (4 files, 13 tests), `npm run build`, and `npm run test:e2e` (1 passed).
- Verification: All listed checks passed locally. No `/feedback` session ID is recorded.

### 2026-07-15 — Approved UX product-flow package

- Task/outcome: Produced the approved MVP UX/product-flow decision package for the two complete event flows.
- Codex contribution: Drafted and revised information architecture, confirmation/correction, acknowledgement constraints, roadmap/diff/progress behavior, accessibility, degraded states, and seeded demo criteria.
- Human review/decision: Approved the package with independently branded visual direction and optional, skippable expecting-child acknowledgement using neutral alternative copy.
- Evidence: `docs/ux/01-product-flows.md`; `CURRENT_STATE.md`.
- Verification: Documentation-only review; no application code, Linear, commit, push, or pull request changes.

### 2026-07-15 — Approved HLD and compiler contract ADR

- Task/outcome: Produced the approved MVP HLD and accepted ADR for the event-pack validation boundary and deterministic roadmap compiler.
- Codex contribution: Drafted and revised module boundaries, contracts, rule semantics, timing, roadmap/diff data, AI guard behavior, persistence/reset, and test evidence.
- Human review/decision: Approved the HLD, ADR, source-review ownership, hybrid AI mode, and initial rate/cost controls.
- Evidence: `docs/architecture/01-hld.md`; `docs/adr/0002-event-pack-contract-and-roadmap-compiler.md`; `CURRENT_STATE.md`.
- Verification: Documentation-only review; no application code, Linear, commit, push, or pull request changes.

### 2026-07-15 — Approved implementation plan

- Task/outcome: Produced the approved, source-traceable delivery plan and aligned the illustrative event ID with the canonical `expecting_child` identifier.
- Codex contribution: Drafted and revised the milestone backlog, dependency path, HLD/UX decision packages, and moving-home quality gates.
- Human review/decision: Approved with HLD and UX sequencing amendments.
- Evidence: `docs/planning/01-implementation-plan.md`; `docs/technical-product-direction.md`; `CURRENT_STATE.md`.
- Verification: Documentation-only review; no application code, Linear, commit, push, or pull request changes.

### 2026-07-15 — Repository-specific SDD workflow

- Task/outcome: Created and validated the `life-navigator-sdd` repository-local
  skill for source-traceable planning, HLD/UX briefs, task drafts, and change
  reviews.
- Codex contribution: Generated a read-only planning brief for the deterministic
  roadmap compiler from repository decision records.
- Human review/decision: Accepted the compiler boundary; deferred contract,
  rule, timing, precedence, and diff-schema decisions to HLD.
- Evidence: `.agents/skills/life-navigator-sdd/SKILL.md`; planning-thread output;
  `CURRENT_STATE.md` update.
- Verification: Skill cited required repository sources and made no repository
  or Linear modifications.

### 2026-07-15 — Bounded Structured Outputs orchestration

- Task/outcome: Implemented the server-only AI interpretation and next-question boundary under the user-authorized P4-01 delivery scope (Linear OPE-13).
- Codex contribution: Added strictly structured Responses API transport, Zod/output allowlists, opaque-session local guarding, redacted telemetry interface, bounded retry/repair behavior, safe fallbacks, route shells, and seeded-mode non-consumption evidence.
- Human review/decision: Preserved the approved separation of responsibility: only approved packs/compiler data can define tasks, sources, rules, timing, and labels. No reviewed pack registry exists yet, and deployed live calls remain disabled pending shared guard configuration.
- Changed artifacts: AI orchestration and server route modules; environment template; seeded shell boundary notice; unit and browser coverage; project records.
- Evidence: Linear OPE-13; `npm run lint`, `npm run typecheck`, `npm run test` (5 files, 19 tests), `npm run build`, and `npm run test:e2e` (1 passed).
- Verification: All listed checks passed locally. No `/feedback` session ID is recorded.

### 2026-07-15 — Life-event authoring skill worktree review and integration

- Task/outcome: Reviewed and approved the dedicated worktree deliverable for controlled, evidence-backed candidate Life Event proposals; integrated it without activating any event content.
- Worktree provenance: Branch `codex/life-event-authoring-skill`; originating commit `5dd341ea164b627a7f149275468db1c249749024`; cherry-picked integration commit `2cdd0181664f19551b0a40785f5c294c113a6980`.
- Scope/review: Added only `.agents/skills/life-event-authoring/` instructions, review templates, and a clearly fictional/unapproved example. The review found no runtime packs, registry entries, shared-contract changes, source URLs, policy claims, compiler changes, or user-facing content; outcome: approved.
- Human review/decision: All generated material remains candidate-only. Source-card dispositions, claim/task/rule/question/safety approval, any contract change, and a separately authorized approved-pack implementation remain mandatory gates.
- Verification: Manual frontmatter/metadata and safety-content inspection passed; `npm run lint`, `npm run typecheck`, `npm run test` (4 files, 13 tests), `npm run build`, and `npm run test:e2e` (1 passed) passed in the worktree. The supplied skill validator was not runnable because both available Python runtimes lack PyYAML; no environment dependency was added.

### 2026-07-17 — Approved `expecting_child` runtime-pack promotion

- Task/outcome: Promoted only the explicitly approved Israel `expecting_child`
  content into active catalog pack `il-expecting-child-v1` and wired it through
  the deterministic seeded interaction.
- Codex contribution: Added runtime registration validation, five canonical
  first-party source cards, explicit post-birth and special-path rules,
  catalog-derived task/source detail rendering, and focused unit/browser
  coverage.
- Human review/decision: Approved the routine Israeli-hospital scope, with the
  eligibility qualifier that Population Registry entry is not automatic for
  every newborn; approved bounded verification-only routing rather than
  special-case workflows.
- Safety boundary: Explicit `birth_occurred` is required; no model defines
  tasks or sources, no eligibility/legal/medical/tax/financial/citizenship/
  parentage/registration determination is made, and no external action occurs.
- Evidence: `git diff --check`, `npm run lint`, `npm run typecheck`, `npm run
  test` (7 files, 38 tests), `npm run build`, and `npm run test:e2e` (5 passed)
  all passed locally. No `/feedback` session ID is recorded.

### 2026-07-17 — Pre-birth preview and task-card disclosure

- Task/outcome: Added a supportive, high-level after-birth preview for the
  active `expecting_child` flow and replaced the acknowledgement-only
  interstitial with the first decision-changing question.
- Codex contribution: Added a catalog-derived preview presentation mode,
  preview-specific approved rationale keys, accessible full-card disclosure
  controls, and focused compiler/browser coverage.
- Human review/decision: Implemented the approved UX request without changing
  source content, post-birth rules, or the explicit `birth_occurred` gate.
- Safety boundary: Preview is not an active task, does not imply eligibility or
  an outcome, and switches to deterministic active content only after explicit
  confirmation. Source links and local progress remain separate interactions.
- Evidence: `git diff --check`, `npm run lint`, `npm run typecheck`, `npm run
  test` (41 passed), `npm run build`, and `npm run test:e2e` (6 passed) all
  passed locally; no `/feedback` session ID is recorded.

### 2026-07-17 — First-load editorial introduction

- Task/outcome: Added a calm, first-load-only editorial introduction that
  resolves the approved motto before handing into the action-oriented landing
  entry point.
- Codex contribution: Implemented the restrained glyph-resolution animation,
  transition, Skip intro control, reduced-motion/no-script behavior, input
  focus handoff, mobile word-wrap protection, a 0.9-second first-line pause,
  and focused browser coverage.
- Human review/decision: Requested the first-load message, warm visual
  direction, action-oriented landing copy, and non-flashy interaction posture.
- Changed artifacts: `src/app/landing-intro.tsx`;
  `src/app/landing-intro.css`; `src/app/page.tsx`; seeded browser tests; this
  collaboration record and `CURRENT_STATE.md`.
- Verification: `git diff --check`, `npm run lint`, `npm run typecheck`,
  `npm run test` (41 passed), `npm run build`, and 8 Chromium journeys against
  the fresh production build passed; no `/feedback` session ID is recorded.

### 2026-07-17 — Generic roadmap clarity and explainability

- Task/outcome: Added a reusable, compiler-output-only roadmap panel for the
  guided workspace, with timing groups, detailed inspection, local-progress
  controls, source metadata, change summaries, and question-rationale access.
- Codex contribution: Separated shared presentation from the page, removed
  event-specific timing rendering, preserved deterministic/local-progress
  boundaries, and added focused browser coverage.
- Human review/decision: Requested main-session-only generic UI work while the
  job-loss worktree continues independent event-pack review.
- Handoff: `docs/roadmap-clarity-contract-handoff.md` records missing resolved
  rationale/diff/replacement/change-condition fields; no UI-generated policy
  explanation or event-specific workaround was introduced.
- Verification: `git diff --check`, lint, typecheck, 41 Vitest tests, build,
  and 11 fresh-production Chromium journeys passed; no `/feedback` session ID
  is recorded.

### 2026-07-17 — Shared timing lanes and intro exit reliability

- Task/outcome: Repaired the landing-intro exit interaction and replaced the
  roadmap's timing-bucket labels with a pure generic timing-lane mapper.
- Codex contribution: Kept the fading overlay non-interactive, added Escape
  handling and deterministic browser waits, and added validated
  timing/window/priority mapping with unit and browser coverage.
- Human review/decision: Requested main-thread-only shared presentation work;
  job-loss candidate content remains isolated and review-required.
- Safety/scope: No candidate pack was activated, imported, rendered, or
  changed; no task/source/policy/AI/compiler-selection data changed.
- Verification: `git diff --check`, lint, typecheck, 44 Vitest tests, build,
  and 13 fresh-production Chromium journeys passed; no `/feedback` session ID
  is recorded.

### 2026-07-17 — Reviewed Israel job-loss pack main-session integration

- Task/outcome: Reviewed and merged the isolated `job_loss × IL` pack into the
  active catalog as `job_loss@il-job-loss-v1` alongside the existing approved
  `expecting_child` pack.
- Worktree provenance: `codex/job-loss-deck-audit`, pack adaptation/cleanup
  range `212b7aa..8214c50`, mechanically updated through `8c19dc4`; main
  integration merge `f9dffbd`.
- Codex contribution: Kept candidate content isolated to pack/evidence/fixture
  files, applied only the approved registry entry during integration, and
  repaired catalog-level expecting-child assertions to preserve its five-source
  approval guarantee with two active packs.
- Human review/decision: Accepted the reviewed source cards and bounded
  job-loss content for the hackathon catalog. Generic typed-question and
  reviewed-source safeguards were promoted separately in `f065967`, `b8989db`,
  and `268cb0e`.
- Safety boundary: Sourced tasks require reviewed dispositions; source-free
  tasks are labelled practical guidance. The flow remains educational planning
  and verification only, with no individual eligibility, legal, tax, financial,
  severance, benefit, payment, or employment-outcome determination.
- Evidence: `git diff --check`, lint, typecheck, 53 Vitest tests, build, and
  13 seeded Chromium journeys passed. Linear OPE-17/OPE-19/OPE-20 were marked
  Done with linked evidence; the Life Navigator project received an on-track
  two-pack status update. No `/feedback` session ID is recorded.

### 2026-07-17 — Responsive desktop landing hierarchy refinement

- Task/outcome: Reviewed the isolated desktop layout adjustment and retained a
  desktop-only CSS refinement that makes the event input the clear primary
  reading column while preserving the quiet route-preview motif at the right.
- Codex contribution: Inspected the stash before application; manually checked
  landing/intro, guided-question, live-roadmap/task-detail, and mobile states;
  and kept the accepted change to `src/app/globals.css` without component,
  contract, catalog, source, rule, fixture, or product-copy changes.
- Human review/decision: Requested a responsive, accessible layout improvement
  only when it created a clear usability benefit; the existing mobile and
  single-question experiences remain unchanged.
- Verification: `git diff --check`, `npm run typecheck`, `npm run lint`, 53
  Vitest tests, and `npm run build` passed. The full Playwright suite currently
  fails a pre-existing Skip-intro test that expects the exited overlay to be
  removed from the DOM; the same targeted failure reproduces with this CSS
  query removed. No `/feedback` session ID is recorded.

### 2026-07-17 — Action Route presentation refactor

- Task/outcome: Reframed the seeded MVP around a persistent, route-first
  workspace: structured conversation collects validated facts while the
  deterministic catalog roadmap is the visual planning artifact.
- Codex contribution: Implemented the reusable route, task-detail drawer,
  neutral pre-confirmation preview, first-load/restored-plan handling,
  keyboard focus return, mobile route jump, local-only progress/reset, and
  focused browser coverage without changing packs, contracts, compiler logic,
  sources, rules, or AI authority.
- Human review/decision: Supplied the Action Route reference direction and
  required generic, catalog-driven presentation for both active event packs.
- Changed artifacts: `src/app/page.tsx`, `src/app/action-route.tsx`, scoped
  Action Route/intro styles, seeded Chromium tests, `CURRENT_STATE.md`, and
  the linked `openai-hackathon` implementation memory record.
- Verification: `git diff --check`, lint, typecheck, 53 Vitest tests, 9
  Chromium journeys, and production build passed. Browser inspection covered
  intro/entry, job-loss route/detail, and 390px mobile. No `/feedback` session
  ID is recorded.

### 2026-07-17 — Action Route interaction correction

- Task/outcome: Corrected the first-load motto, duplicate opening copy,
  confirmation language, transcript question treatment, and route density in
  the shared Action Route presentation.
- Codex contribution: Identified the legacy `intro-seen.v1` session marker as
  the cause of suppressed normal intros, versioned it safely, added explicit
  `?demo=seeded` bypass behavior, kept a static reduced-motion intro with user
  controls, and reshaped generic reply/detail presentation without touching
  policy or compiler authority.
- Human review/decision: Required the exact natural job-loss confirmation,
  catalog-provided event-safe confirmations, one visible assistant welcome,
  compact transcript replies, and a less card-like route.
- Changed artifacts: shared Action Route/intro/question presentation,
  test-only confirmation wording, seeded Chromium coverage, `CURRENT_STATE.md`,
  and the linked `openai-hackathon` implementation memory record.
- Verification: `git diff --check`, lint, typecheck, 53 Vitest tests, 13
  Chromium journeys, and production build passed. No `/feedback` session ID is
  recorded.

### 2026-07-17 — Intro visibility and timing-label correction

- Task/outcome: Repaired two verified Action Route presentation defects: the
  first-load motto was not reliably observable, and task drawers exposed raw
  timing message keys.
- Codex contribution: Removed the session-wide intro suppression while retaining
  reset/restored-plan/demo boundaries; made completion user-controlled; and
  mapped the validated timing union to generic display text without inspecting
  event, task, or jurisdiction IDs.
- Human review/decision: Reported the missing intro and raw `labelKey` display
  from the live interface.
- Verification: `git diff --check`, lint, typecheck, 53 Vitest tests, 14
  Chromium journeys, and production build passed. No `/feedback` session ID is
  recorded.

### 2026-07-17 — Active-question focus and answer-gated route prominence

- Task/outcome: Kept the active structured question visible as the conversation
  advances and surfaced newly added validated route actions within the compact
  generic route preview.
- Codex contribution: Added an auto-following bounded transcript viewport,
  reduced-motion fallback, and generic diff-aware route ordering; added a
  Chromium journey through the salaried/not-registered path.
- Human review/decision: Required conversation to remain focused on the current
  question and requested that next-role practical guidance coexist with
  answer-gated legal/official route review for job loss.
- Safety/scope: No job-loss or expecting-child pack data, sources, rules,
  compiler behavior, contracts, or raw model output changed. The UI only
  presents validated catalog/compiler data.
- Verification: `git diff --check`, lint, typecheck, 53 Vitest tests, 15
  Chromium journeys run serially, and production build passed. No `/feedback`
  session ID is recorded.

### 2026-07-18 — M9 LLM classification gateway (OPE-30–OPE-35)

- Task/outcome: Added the provider-neutral server-only classification boundary,
  OpenAI/Ollama adapters, transient-only Gemini fallback, input/call controls,
  redacted telemetry, and safe live-classifier event intake.
- Human review/decision: Revised M9 so seeded demo uses live classification;
  explicit confirmation and deterministic compiler ownership remain unchanged.
  Ollama defaults to `qwen3.5:9b` with `/no_think` and `think: false`.
- Safety/scope: Model output is limited to validated registered event IDs and
  explicitly stated allowlisted facts. It cannot define catalog tasks, sources,
  rules, timing, questions, policy, benefits, or eligibility. Unsupported and
  provider-failure outcomes use neutral clarification copy.
- Verification: `git diff --check`, lint, typecheck, 73 Vitest tests, 17 serial
  Chromium journeys, and production build passed. OPE-36 remains a human ADR
  decision; no `/feedback` session ID is recorded.
