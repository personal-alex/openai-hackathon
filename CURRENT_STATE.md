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

The repository contains a validated modular-monolith baseline, deterministic compiler, bounded server-only AI boundary, and a judge-ready App Router shell using synthetic seeded scenarios. Reviewed IL event-pack content is not yet activated; runtime AI routes fail closed until a reviewed pack registry and deployed shared guard are available.

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

## 2026-07-15 — P5 AI boundary and P0-02 evidence baseline complete

- P5-01/P5-02 now cover all three server-only structured operations (event extraction, allowlisted question selection, and supplemental explanation drafting), bounded token caps, deterministic seeded/failure fallback, redacted health telemetry, and a fail-closed shared deployment-guard adapter.
- P0-02 completed the primary-thread evidence baseline: material work now records dated outcomes, human decisions, changed artifacts, verification, commit/Linear references, and no fabricated `/feedback` ID.
- Passed: `npm run lint`, `npm run typecheck`, `npm run test` (5 files, 24 tests), `npm run build`, and `npm run test:e2e`.

## 2026-07-16 — Judge-ready seeded UX refactor complete

- The App Router shell now implements a calm, independently branded opening flow, event confirmation, optional/skippable `expecting_child` acknowledgement, one-question-at-a-time seeded intake, and a persistent compiler-driven roadmap workspace for the test-only `expecting_child` and `job_loss` scenarios.
- The original route/north-star mark and favicon replace the generic scaffold mark; roadmap cards expose timing, fixture provenance, verification labels, local-only progress, compiler-derived rationale, and labelled added/adjusted/current states.
- All new questions, tasks, source metadata, and explanations remain synthetic fixtures. No reviewed event pack, policy/source content, live AI integration, persistence, or eligibility conclusion was activated.
- Passed: `npm run lint`, `npm run typecheck`, `npm run test` (5 files, 24 tests), `npm run build`, and `npm run test:e2e` (3 seeded browser journeys). Manual browser review covered 1440px desktop and 390px mobile; no console warnings/errors were observed.
## 2026-07-17 — Confirmed transition-gate contract proof complete

- The reusable authoring workflow and shared contracts now support task applicability gated by explicit typed facts declared as `confirmed_transition`; dates, estimates, schedules, inferred milestones, and elapsed time cannot establish that a transition occurred.
- `tests/fixtures/expecting-child-transition.ts` is a non-production, test-only contract proof using `event_stage = birth_occurred`; `validateApprovedEventPack` rejects it, it is not registered, and it contains no approved source or policy content.
- No approved runtime `expecting_child` pack exists on this branch. Candidate sources remain `needs_review`; applying this contract to any runtime pack remains contingent on human source/content approval.

## 2026-07-17 — Routine Israeli-hospital registration candidate correction

- The `expecting_child` candidate packet records a human-review decision:
  **Approved with scope: routine birth in an Israeli hospital.** It is backed
  by four primary Population and Immigration Authority / Ministry of Health
  source cards and explicitly distinguishes the hospital birth notice from the
  Authority's Population Registry entry.
- The candidate/test-only routing proof requires explicit
  `event_stage = birth_occurred`; a due date or inferred milestone cannot set
  it. It routes non-hospital or unknown birth location to verification required
  and keeps birth outside Israel, home/non-recognised-institution birth,
  disputed parentage, late registration, corrections, adoption, and surrogacy
  excluded/deferred.
- This is not an approved or active runtime event pack, source-card registry,
  or user-facing flow. Remaining candidate sources and all implementation
  authorization remain subject to review.

## 2026-07-17 — Reviewed expecting-child candidate artifacts integrated

- Candidate authoring materials from `codex/il-expecting-child-candidate-pack`
  are now integrated on `master`; they are not an activated runtime event pack,
  source-card registry, compiler input, or user-facing roadmap flow.
- Approved scope: **Approved with scope: routine birth in an Israeli hospital.**
  The system-led routine-path statement applies only where the newborn is
  eligible for entry in Israel’s Population Registry; it does not mean every
  newborn born in an Israeli hospital automatically receives an Israeli ID.
- The test-only, unregistered transition fixture remains rejected by
  `validateApprovedEventPack`. No production route depends on candidate content.

## 2026-07-17 — Approved Israel `expecting_child` pack activated

- Human-approved runtime scope is **routine birth in an Israeli hospital** for
  the intended eligible/registered-parent scenario, plus bounded
  verification-only routing for birth outside Israel, non-hospital birth, and
  adoption, surrogacy, or parentage needing verification.
- `src/event-packs/expecting-child.ts` registers
  `expecting_child@il-expecting-child-v1` only after approved-pack validation.
  Its five active official source cards are `ec_piba_birth_registry_procedure`,
  `ec_piba_newborn_name`, `ec_piba_birth_certificate`,
  `ec_moh_birth_certificate_parents`, and
  `ec_piba_birth_abroad_registration`.
- Post-birth tasks require explicit `event_stage = birth_occurred`; dates,
  estimates, schedules, elapsed time, and inference cannot establish it. The
  routine statement applies only where the newborn is eligible for Population
  Registry entry and does not imply an automatic Israeli ID or any outcome.
- Deferred: late registration, corrections/correction consent, household or
  family-status claims, legal interpretations of recognition or parentage,
  unreviewed document checklists, and any eligibility, citizenship, residency,
  benefit, or payment claim. The product remains educational planning support
  only and performs no external action or determination.
- Passed: `git diff --check`, `npm run lint`, `npm run typecheck`, `npm run
  test` (7 files, 38 tests), `npm run build`, and `npm run test:e2e` (5
  deterministic browser journeys).

## 2026-07-17 — Pre-birth expecting-child preview and accessible task disclosure

- `event_stage = not_yet_born` now renders a clearly labelled, after-birth
  planning preview derived only from active `expecting_child` catalog tasks,
  source cards, rationale keys, and canonical links. It does not activate a
  post-birth task or satisfy `birth_occurred`.
- A supplied fact that rules out the routine path replaces its ordinary preview
  with the existing bounded verification route. Explicit `birth_occurred`
  still switches to the deterministic active roadmap and emits the established
  task-diff state.
- The acknowledgement-only interstitial was removed. The first
  decision-changing question appears immediately with concise supportive copy.
  Roadmap card headers are semantic, keyboard-accessible disclosure buttons;
  their source links and local-status controls remain separate interactions.
- The product remains educational planning support only: it performs no
  external action and makes no eligibility, legal, medical, tax, financial,
  citizenship, parentage, or registration determination.
- Passed: `git diff --check`, `npm run lint`, `npm run typecheck`, `npm run
  test` (7 files, 41 tests), `npm run build`, and `npm run test:e2e` (6
  deterministic browser journeys).

## 2026-07-17 — First-load editorial introduction

- The main entry route now opens with a presentation-only Life Navigator
  introduction: a restrained character-resolution reveal for “Life doesn’t
  come with instructions.” followed by “Now it does.” It fades and lifts into
  the action-oriented landing heading, “Tell us what changed.”
- The resolved first line holds for approximately 0.9 seconds before the final
  statement enters, so the opening problem is given clear focus.
- The overlay has a visible Skip intro control, hands keyboard focus to the
  event input, respects reduced motion by opening the landing immediately, and
  includes a no-JavaScript escape path. It does not alter deterministic
  scenario, compiler, AI, event-pack, or safety behavior.
- Passed: `git diff --check`, `npm run lint`, `npm run typecheck`, `npm run
  test` (7 files, 41 tests), `npm run build`, and 8 production-build Chromium
  journeys, including skip, reduced-motion, and narrow-mobile flow coverage.

## 2026-07-17 — Generic roadmap clarity and explainability

- The guided experience now uses a reusable, event-agnostic roadmap panel that
  groups validated compiler tasks by typed timing window, exposes task/source/
  verification/local-status details, and gives `TaskDiff` changes a concise,
  non-colour-only summary and task markers.
- No event-pack, source, rule, fixture, policy, compiler, or AI data changed.
  The main-thread handoff in `docs/roadmap-clarity-contract-handoff.md` records
  the generic resolved-rationale, diff-reason, removed-task, and task-change
  fields still required for fuller authoritative explanations.
- Passed: `git diff --check`, `npm run lint`, `npm run typecheck`, `npm run
  test` (41 tests), `npm run build`, and 11 Chromium journeys against a fresh
  production build.

## 2026-07-17 — Shared timing lanes and intro exit reliability

- The landing intro now marks its overlay non-interactive while it fades, reveals
  the entry controls at exit start, supports Escape as a visible-equivalent
  exit, and keeps input focus management intact. Seeded browser helpers wait
  for actual overlay removal rather than a visually-hidden landing heading.
- `src/app/timing-lanes.ts` maps only validated `Timing.kind`/`window` into the
  generic Immediate, Preparation, Ongoing, Later, or When ready presentation
  lanes; compiler priority remains the within-lane order. No event, pack,
  source, fixture, rule, policy, or compiler selection data changed.
- Passed: `git diff --check`, `npm run lint`, `npm run typecheck`, `npm run
  test` (44 tests), `npm run build`, and 13 Chromium journeys against a fresh
  production build.

## 2026-07-17 — Catalog-driven typed-question capability

- `QuestionDefinition` now validates catalog-owned prompt/rationale,
  choice-or-typed presentation, typed constraints, format help, and
  validation wording. The shared renderer supports text, date, and number
  inputs without event-specific labels or conditions; skipped values remain
  absent and invalid values do not update context.
- Existing `expecting_child` choices now use the same validated presentation
  shape with unchanged facts, tasks, rules, sources, and selection behavior.
  GPT question selection remains limited to allowlisted IDs/fact IDs/rationale
  keys and never receives presentation text.
- ADR 0003 records this durable catalog/UI boundary. This capability is a
  prerequisite for a future reviewed pack to supply typed-question metadata;
  it does not activate or change `job_loss` content. Shared entry matching is
  likewise fixture-driven rather than event-specific React logic.

## 2026-07-17 — Reviewed Israel job-loss pack integrated

- Two IL runtime packs are now registered through the validated catalog:
  `expecting_child@il-expecting-child-v1` and `job_loss@il-job-loss-v1`.
  The job-loss pack, evidence ledger, and reference-deck review are at
  `src/event-packs/job-loss.ts`, `docs/candidates/job_loss/`, and
  `docs/reviews/job-loss-il-skill-vs-reference-deck.md`.
- Every sourced job-loss task is backed by a human-reviewed
  `approved_for_hackathon` source card; source-free tasks carry the explicit
  practical-guidance label. The deterministic compiler remains the sole
  authority for task selection, timing, sources, and diffs.
- The flow is educational planning and verification only. It makes no
  individual eligibility, legal, tax, financial, severance, benefit, payment,
  or employment-outcome determination. Resignation and non-salaried special
  routes remain excluded pending separate review.
- Evidence: merge `f9dffbd`; `git diff --check`, `npm run typecheck`,
  `npm run lint`, `npm run test` (53 passed), `npm run build`, and 13 seeded
  Chromium journeys passed. Linear OPE-17, OPE-19, and OPE-20 are Done.

## 2026-07-17 — Responsive desktop landing hierarchy refined

- At desktop widths (901px and above), the landing input now occupies the
  primary left-hand reading column while the quiet route preview stays separate
  at the right. The existing single-column tablet/mobile presentation is
  unchanged.
- This is presentation-only: it changes no event pack, source, rule, fixture,
  route, contract, compiler, AI, intro, question, roadmap, or reduced-motion
  behavior. The input remains the direct conversational entry point into the
  roadmap-first product experience.
- Passed: `git diff --check`, `npm run typecheck`, `npm run lint`, `npm run
  test` (53 passed), and `npm run build`. The current Playwright suite has an
  unrelated baseline failure: it expects the visually exited landing intro to
  be removed from the DOM immediately after Skip intro; the same targeted test
  fails with this CSS media query temporarily removed.

## 2026-07-17 — Action Route workspace refactor

- The seed-demo experience now treats conversation as structured input and the
  deterministic compiled roadmap as the primary artifact. Event understanding,
  confirmation, one active allowlisted question, rationale, local reset, and
  task inspection all occur in an accessible Action Route workspace; no chat
  response creates tasks, sources, timing, rules, or eligibility conclusions.
- Before confirmation the route stays a neutral, non-task preview. After
  confirmation it renders only validated catalog tasks, source metadata,
  verification labels, compiler diffs, local progress, and fixture-backed
  explanation text. A versioned browser-local seeded envelope restores a
  validated planning state and bypasses the first-load intro; reset preserves
  the no-replay rule for that browser session.
- This is shared presentation work only. Both active IL packs, source cards,
  compiler selection, contracts, AI boundaries, and policy wording are
  unchanged. The generic timing lanes remain derived from validated timing
  metadata, not event or jurisdiction conditions.
- Passed: `git diff --check`, `npm run typecheck`, `npm run lint`, `npm run
  test` (53 passed), `npx playwright test` (9 Chromium journeys), and `npm run
  build`. Browser inspection covered desktop intro/entry, a job-loss route and
  task detail, and 390px mobile conversation-first layout.

## 2026-07-17 — Action Route intro and conversational-turn correction

- The first-load motto is visible again for a normal clean visit. Its session
  marker was versioned from `v1` to `v2` because a prior broad marker suppressed
  the newly approved intro for existing sessions; only a valid restored local
  plan or the explicit `?demo=seeded` condition now bypasses it. Reduced-motion
  users receive the completed static statement with explicit Continue/Skip
  controls rather than an automatic dismissal.
- The Action Route no longer repeats a visible hero heading. It begins with the
  single approved assistant welcome; event confirmation uses the existing
  seeded presentation field with human-facing copy for each event, not pack or
  catalog implementation language. Questions render as compact transcript
  turns with reply chips or an inline typed composer, and prior answers become
  concise local user bubbles.
- Route nodes are presentation-only compact connected actions. Full rationale,
  source, review, verification, safety, and local-status detail remains in the
  existing drawer. No active pack facts, source claims, task selection, rules,
  compiler behavior, contracts, or AI behavior changed.
- Passed: `git diff --check`, `npm run typecheck`, `npm run lint`, `npm run
  test` (53 passed), `npx playwright test` (13 Chromium journeys), and `npm
  run build`.

## 2026-07-17 — Intro visibility and timing-label correction

- A full no-plan page load now always presents the completed first-load intro
  until the user selects Continue or Skip. In-app reset still returns directly
  to the entry conversation, and a valid restored plan or explicit
  `?demo=seeded` bypasses the intro. This removes the session-wide suppression
  that prevented the motto from being observable after prior visits.
- Task drawers now map typed timing semantics to generic user-facing text (for
  example, “When ready” or “Do now”) and never render internal timing message
  keys. Verification wording remains the validated catalog value.
- Passed: `git diff --check`, `npm run typecheck`, `npm run lint`, `npm run
  test` (53 passed), `npx playwright test` (14 Chromium journeys), and `npm
  run build`.

## 2026-07-17 — Active-question focus and answer-gated route prominence

- The structured conversation now uses a bounded, auto-following turn viewport:
  when an answer advances the flow, the current allowlisted question is brought
  into view and prior turns scroll above it. Reduced-motion users receive the
  same positioning without smooth motion.
- The compact route preview now gives validated compiler-diff items precedence
  within its generic five-item limit. This keeps newly added answer-gated
  official-route steps visible alongside existing practical planning items,
  without inspecting an event, task, source, jurisdiction, or eligibility
  condition in the UI.
- No event-pack task, rule, source card, policy claim, compiler selection, or
  AI behavior changed. The job-loss catalog continues to supply next-role
  practical guidance by default and adds official-route review only from its
  approved, explicit fact rules.
- Passed: `git diff --check`, `npm run typecheck`, `npm run lint`, `npm run
  test` (53 passed), `npx playwright test --workers=1` (15 Chromium journeys),
  and `npm run build`.

## 2026-07-18 — M9 LLM classification gateway (OPE-30–OPE-35)

- Event intake now goes through a server-only provider-neutral `LlmGateway`.
  The local default is Ollama `qwen3.5:9b`, with `/no_think` in the system
  instruction and `think: false` in its request body; OpenAI supports strict
  structured classification and optional Gemini is available only for transient
  OpenAI infrastructure failures.
- User-approved M9 revision: seeded demo calls the same live classification
  route rather than bypassing it. Explicit confirmation still precedes any
  deterministic compiler state, and unavailable/unsupported/invalid/limited
  output produces a neutral clarification rather than an empty route.
- Classification can return only registered event IDs and explicitly stated,
  allowlisted fact values. It cannot define tasks, sources, questions, timing,
  policy, benefits, or eligibility. Server-only controls bound input, output,
  timeout/retries, opaque-session and IP calls; telemetry excludes statements,
  prompts, output, session IDs, IPs, and credentials.
- OPE-36 remains intentionally unimplemented for human ADR evaluation of Vercel
  AI Gateway versus the direct adapters. Passed: `git diff --check`, typecheck,
  lint, 73 Vitest tests, 17 serial Chromium journeys, and production build.

## 2026-07-18 — Natural-language event-classification hints

- Active event packs may supply bounded optional `recognitionHints` solely to
  improve live classifier recognition of ordinary event wording. The Israel
  `expecting_child` catalog now includes “having a baby” and “pregnant”; the
  hints are neither policy content nor compiler input.
- The classifier still returns only a registered event ID and explicit
  allowlisted facts. Tasks, rules, timing, sources, verification, and
  eligibility remain deterministic catalog/compiler responsibilities.
- Passed: `git diff --check`, typecheck, lint, 74 Vitest tests, 17 serial
  Chromium journeys, and production build.

## 2026-07-18 — Local classifier-limit feedback and sliding windows

- Local live-classifier controls now apply the approved ten-minute sliding and
  hourly windows rather than retaining a session count forever. The browser
  shows a distinct calm rate-limit message instead of treating a local `429` as
  an unsupported event.
- The exact ordinary statement “We’re having a baby” is covered in the
  browser-level classifier fixture and expecting-child journey. It still reaches
  the live classification boundary in normal product operation.

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
