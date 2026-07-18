# Life Navigator — MVP Product Flows

## Outcome

Define a calm, inspectable, event-led experience for `expecting_child` and `job_loss`; the owner-approved hackathon-only `relocate_il_us` pack inherits this same generic experience without a bespoke jurisdiction UI.

## Scope and classification

### Decided

- The product is Israel-first and English-only. `expecting_child` and `job_loss` remain the baseline complete flows; `move_home` is outside current UX scope. `relocate_il_us` is a narrowly approved IL→US hackathon/demo exception with no country selector or U.S.-only journey. `docs/adr/0004-hackathon-il-us-relocation-exception.md`
- The roadmap is the primary product artifact; conversation serves intake and explanation. `docs/technical-product-direction.md#2-product-thesis`
- UI renders validated catalog data and compiler diffs, never authoritative model prose. `docs/architecture/01-hld.md#2-contracts-and-validation-boundaries`
- Local `progressStatus` overlays immutable compiled catalog tasks and never changes task selection or task diffs. `docs/adr/0002-event-pack-contract-and-roadmap-compiler.md#compiled-roadmap-diff-and-local-progress`
- Visual direction is calm, warm, high-craft, independently branded, and inspired by clarity, restraint, accessibility, and state quality of modern AI tools. Do not use OpenAI logos, wordmarks, product names, proprietary assets, or endorsement/affiliation language. Credit OpenAI technology accurately only in an About/Technology area and submission materials.
- Confirmation acknowledgements are approved pack/safety-policy copy, never model-generated.

### Proposed

The interaction recommendations below implement the approved architecture without prescribing final branding assets, component-library choices, or pixel layout.

### Open question

Exact approved questions, task titles, source cards, verification labels, safety wording, and acknowledgement availability are event-pack/source-review work. This UX artifact creates no Israel policy content.

## 1. Information architecture and visual direction

**Recommendation:** Use one persistent plan workspace containing event/intake, one-question interaction, roadmap, task-detail, context-review, change-summary, safety, and local-notice regions. The arrangement may adapt by viewport; these are information regions, not a fixed layout.

| Region/state | Purpose |
|---|---|
| Entry | Free-text event statement and brief scope framing |
| Event confirmation | Confirm, correct, select directly, or handle unsupported/unclear event |
| Question interaction | One question, answer validation, rationale, skip/unknown |
| Roadmap | Persistent compiled tasks grouped and sorted by compiler data |
| Task detail | Inspect source-backed catalog metadata and local progress control |
| Context review | Edit an answer and understand roadmap consequences |
| Change summary | Added, removed, and changed tasks from `TaskDiff` |
| Safety/footer | Persistent scope disclaimer and verification framing |
| Local notices | Reset, degraded-AI, or rate-limit message without losing valid plan |

Use restrained color, clear hierarchy, readable typography, generous reading space, visible focus states, and calm loading/degraded states. The product remains independently branded; an About/Technology area may accurately name technology but must not imply user-facing authority or endorsement.

- **Classification:** Proposed
- **Rationale:** A durable roadmap remains visible while questions stay focused; high-quality state treatment supports trust in uncertain situations.
- **Trade-offs:** More information than chat-only UI; responsive/focus behavior needs deliberate design and test coverage.
- **Sources:** `docs/technical-product-direction.md#5-experience-requirements`, `docs/architecture/01-hld.md#6-compiled-roadmap-and-task-diff-contracts`.
- **Acceptance evidence:** Users can reach every region without page reload or hidden navigation; visual/accessibility review confirms independent branding, contrast, visible focus, and non-color-only state cues.

## 2. Event-led intake, confirmation, correction, and unclear handling

**Recommendation:** Treat every valid supported extraction as a suggestion requiring explicit confirmation.

1. User enters a free-text statement.
2. The app shows a loading state while structured extraction runs.
3. Valid supported-event extraction presents catalog-approved confirmation copy with **Continue**, **Choose a different supported event**, and **Start over**. This includes the owner-approved `relocate_il_us` exception.
4. After explicit confirmation of `expecting_child`, optionally show the approved, skippable acknowledgement: “Congratulations—let’s build a plan for what may be ahead.” The user may skip it and continue with the neutral approved alternative: “Let’s build a plan for what may be ahead.”
5. After explicit confirmation of `job_loss`, show the approved empathetic, non-assumptive acknowledgement: “I’m sorry you’re dealing with a job loss. Let’s make a clear plan for the next steps.”
6. Direct selection uses neutral wording and no acknowledgement.
7. Invalid, ambiguous, unavailable, or unsupported extraction routes to direct selection and an unsupported/unclear state that explains the two supported flows.
8. Do not display model confidence. Seeded mode uses the same confirmation UI and never bypasses it.

Acknowledgements must not include condolences, promises, “silver lining” language, emotional assumptions, eligibility implications, or unsupported urgency claims. All final wording is pack/safety-policy copy.

- **Classification:** Proposed
- **Rationale:** Explicit confirmation preserves user control; limited acknowledgment is supportive without making an ungrounded interpretation authoritative.
- **Trade-offs:** Adds an interaction to all flows, including fixtures; direct selection provides a reliable non-AI path.
- **Sources:** `docs/architecture/01-hld.md#7-server-side-gpt-56-structured-outputs-and-guarding`, `docs/instructions/trust-safety-and-sources.md#source-card-requirements`.
- **Acceptance evidence:** Playwright covers valid suggestion, correction, unsupported/ambiguous/unavailable extraction, direct selection, and seeded confirmation; no model-confidence value is rendered.

## 3. One-question-at-a-time interaction

**Recommendation:** Display one active allowlisted question with approved rationale, schema-derived answer control, validation, and explicit unknown/skip actions.

- Question and “Why this matters” copy originate only in the active pack.
- The next question is selected by validated allowlisted model output or deterministic selector; UI does not select from prose.
- Answer controls follow declared fact schema: constrained selection, date, bounded number, or approved short text.
- Inline validation preserves input and prior roadmap.
- **I don’t know** records no fact; **Skip for now** defers the question. Neither is false/negative data.
- Valid answer or unknown recompiles the roadmap and presents its diff. Users may continue to the roadmap with unknown context.

- **Classification:** Proposed
- **Rationale:** Decision-changing questions stay understandable without coercing sensitive or uncertain information.
- **Trade-offs:** More structured than chat; packs need typed question metadata.
- **Sources:** `docs/technical-product-direction.md#2-product-thesis`, `docs/adr/0002-event-pack-contract-and-roadmap-compiler.md#rules`.
- **Acceptance evidence:** Invalid input does not mutate context; unknown facts remain absent; inactive question IDs cannot render.

## 4. End-to-end expecting-child flow

1. Enter a statement and confirm the suggested event or select directly.
2. After confirmed suggestion, optionally view/skip the approved acknowledgement; skipped continuation uses the neutral alternative.
3. View initial base-task roadmap with general safety/verification framing.
4. Answer approved questions one at a time; due-date-related data affects only approved rules/timing.
5. Inspect updated roadmap and catalog-derived change summary after each meaningful answer.
6. Open task/source details, set local progress, edit a prior answer, and reset when desired.

- **Classification:** Proposed
- **Rationale:** Demonstrates progressive planning while preserving uncertainty around unknown anchors.
- **Trade-offs:** Timing remains general where anchors are unknown; no date is inferred.
- **Sources:** `docs/architecture/01-hld.md#5-timing-model`, `docs/planning/01-implementation-plan.md#m4-expecting-child-content-and-reference-experience`.
- **Acceptance evidence:** Seeded flow includes confirmation, acknowledgement skip, three purposeful questions, a roadmap change, source inspection, progress, context edit, and reset.

## 5. End-to-end job-loss flow

1. Enter a statement and confirm the suggested event or select directly.
2. After confirmed suggestion, show approved empathetic acknowledgement; direct selection stays neutral.
3. View initial base-task roadmap.
4. Answer approved questions sequentially; event-relative timing and changes come only from compiler/pack data.
5. Inspect source-backed tasks, local progress, context edits, diffs, and reset.
6. Use verification framing whenever applicability is uncertain.

- **Classification:** Proposed
- **Rationale:** Proves shared engine/UI grammar across a materially different timing pattern.
- **Trade-offs:** Urgency must remain source-backed and cannot imply entitlement or deadline.
- **Sources:** `docs/technical-product-direction.md#4-product-scope`, `docs/adr/0001-life-event-primary.md#decision`.
- **Acceptance evidence:** Seeded journey uses shared contracts and event-relative timing without child-specific branches.

## 6. Live roadmap, task detail, and local progress

**Recommendation:** Keep the roadmap persistent. Group by compiler timing bucket and preserve compiler order within groups; never client-sort by model or inferred urgency.

Task detail presents action, timing label, catalog rationale, source-card publisher/review date/supported-claim scope, verification label, dependencies, and local status: not started, reviewed, or complete. Changed tasks may have visual emphasis but unchanged tasks remain visible. Progress updates only the browser-local overlay.

- **Classification:** Proposed
- **Rationale:** Users can inspect why a task exists and where to verify it, while progress remains private and non-authoritative.
- **Trade-offs:** Detail depth and source metadata require progressive disclosure.
- **Sources:** `docs/technical-product-direction.md#5-experience-requirements`, `docs/architecture/01-hld.md#2-contracts-and-validation-boundaries`.
- **Acceptance evidence:** Every seeded task opens detail/source metadata; progress changes do not alter compiler task selection or emit task diff.

## 7. Context edits and task diffs

**Recommendation:** Provide an edit action per answered context fact. After validated edit, preserve prior roadmap long enough to show `TaskDiff`.

| Change | Treatment |
|---|---|
| Added | Highlight as new with approved explanation |
| Changed | Highlight changed timing, priority, rationale, or sources |
| Removed | Show in dismissible “No longer in this plan” summary |
| No catalog change | Confirm save without artificial change narrative |

Compiler `messageKey` resolves approved copy. If a local-complete task disappears, remove stale local progress, show calm removal summary, do not imply prior completion was wrong, and do not retain it in current roadmap after dismissal.

- **Classification:** Proposed
- **Rationale:** Makes roadmap evolution inspectable while separating catalog truth from private progress.
- **Trade-offs:** Removed-task history is intentionally session-local, not an audit log.
- **Sources:** `docs/architecture/01-hld.md#6-compiled-roadmap-and-task-diff-contracts`, `docs/adr/0002-event-pack-contract-and-roadmap-compiler.md#compiled-roadmap-diff-and-local-progress`.
- **Acceptance evidence:** Fixtures/Playwright cover added, changed, removed, no-change, and completed-task removal.

## 8. Normal, degraded, and reset states

**Recommendation:** Preserve valid roadmap/context whenever possible and use short, calm, accessible notices.

| State | Behavior |
|---|---|
| Normal | Current question and roadmap available |
| Loading | Keep prior roadmap; disable only pending submission |
| Empty | Explain that plan follows event confirmation; offer direct selection |
| Validation error | Inline error; preserve input and roadmap |
| AI timeout / invalid output | Do not apply output; preserve state; deterministic fallback and notice |
| Local rate limit | No retry; `Retry-After`-aware notice; preserve plan/fallback |
| Upstream rate limit | One bounded retry if allowed; otherwise fallback/notice |
| Budget exhausted | No further model call; preserve plan and fallback |
| Local-storage reset | Start empty scoped plan and show short reset notice |
| Seeded demo | Clearly label deterministic mode; no live quota use |

Notices must not blame users, expose provider internals, or block reset/correction. They remain readable, keyboard-dismissible when appropriate, and accessible through live-region announcement.

- **Classification:** Proposed
- **Rationale:** Keeps the roadmap useful during model/network/storage failure and supports rehearsal reliability.
- **Trade-offs:** More states increase UI/test complexity; fallback has less conversational richness.
- **Sources:** `docs/architecture/01-hld.md#7-server-side-gpt-56-structured-outputs-and-guarding`, `docs/instructions/testing-and-demo.md#demo-reliability`.
- **Acceptance evidence:** Each state has deterministic Playwright assertion; rate-limit test confirms no extra live call.

## 9. Persistent safety and external links

**Recommendation:** Display concise persistent planning-not-advice disclaimer near roadmap and repeat verification framing in task/source detail.

The product states it is general planning support, not an eligibility, legal, medical, tax, or financial determination. External links show publisher identity, open in a separate browsing context with safe link attributes, and remain distinct from app navigation. Task detail directs users to verify current information with the named source.

- **Classification:** Proposed
- **Rationale:** Makes provenance and limitation visible at the point of action.
- **Trade-offs:** Repeated language adds visual weight; use concise approved safety copy.
- **Sources:** `docs/technical-product-direction.md#trust-and-safety-ux`, `docs/instructions/trust-safety-and-sources.md#source-card-requirements`.
- **Acceptance evidence:** Every outbound source displays publisher/review date; no task screen presents an eligibility conclusion.

## 10. Accessibility and keyboard/focus behavior

**Recommendation:** Support practical keyboard and screen-reader use from the first flow, without reliance on color or motion.

- Semantic landmarks for intake, question, roadmap, task detail, notices.
- Focus moves to confirmed-event heading after intake, question heading after advance, and diff summary after context edit.
- Detail dialogs trap focus only while open and restore invoking-task focus on close.
- Inputs associate errors; concise live regions announce validation, roadmap/diff, and notices.
- Source labels include publisher and external-link context.
- All controls including unknown, skip, reset, progress, details, and dismissal are keyboard reachable.
- Respect reduced motion; do not require animation to understand changes.

- **Classification:** Proposed
- **Rationale:** State changes and provenance details must work without pointer, color, or motion dependence.
- **Trade-offs:** Focus/announcement sequences need explicit testing to avoid excessive verbosity.
- **Sources:** `docs/technical-product-direction.md#trust-and-safety-ux`, `docs/planning/01-implementation-plan.md#p1-ux-produce-and-approve-uxproduct-flow-decision`.
- **Acceptance evidence:** Keyboard-only Playwright completes both seeded flows; screen-reader smoke test verifies question, diff, validation, and notice announcements.

## 11. Seeded demo scripts and Playwright criteria

**Recommendation:** Use approved deterministic fixtures for rehearsed seeded mode; demonstrate product dynamics, never unreviewed policy content.

### expecting-child seeded script

1. Launch seeded demo and confirm label.
2. Enter fixture statement and confirm suggested `expecting_child` through normal confirmation UI.
3. View/skip optional acknowledgement and continue with neutral copy.
4. Answer three approved fixture questions, including unknown/skip path.
5. Inspect added/changed task and source metadata; set local progress.
6. Edit an answer, inspect diff, then reset.

### job-loss seeded script

1. Launch seeded demo and confirm label.
2. Enter fixture statement and confirm suggested `job_loss` through normal confirmation UI.
3. View approved acknowledgement and answer three fixture questions.
4. Inspect event-relative timing/source detail; complete a task.
5. Edit context so task is removed and observe reconciliation.
6. Trigger approved fallback fixture, retain roadmap, and reset.

### Playwright-ready acceptance criteria

- [ ] Seeded flows make no live model request or quota consumption.
- [ ] Both flows retain confirmation UI; seeded fixtures never bypass it.
- [ ] Each has at least three purposeful approved questions.
- [ ] Intake/correction/unsupported/direct-selection/unknown/skip/validation/reset are covered.
- [ ] Task details contain timing, rationale, publisher/review metadata, verification label, and local progress.
- [ ] Deterministic added/changed/removed presentation and completed-task reconciliation pass.
- [ ] Each degraded state has accessible assertion.
- [ ] Keyboard-only journeys complete both scripts.
- [ ] No test asserts invented policy content, source URL, or eligibility outcome.
- [ ] Acknowledgement behavior, skip/neutral alternative, prohibited language, and independent-branding rules are verified.

- **Classification:** Proposed
- **Rationale:** Deterministic proof supports repeatable demo and shared-engine validation.
- **Trade-offs:** Fixtures must stay synchronized with approved packs/contracts.
- **Sources:** `docs/architecture/01-hld.md#9-test-fixtures-and-seeded-journeys`, `docs/instructions/testing-and-demo.md#required-test-posture`.
- **Acceptance evidence:** Passing local/preview Playwright runs and ten clean rehearsals before recording.

## Non-goals

- No `move_home` UX flow.
- No final branding system, component-library choice, or fixed pixel layout.
- No invented policy content, sources, rules, or safety wording.
- No accounts, product database, integrations, submissions, reminders, calculators, or autonomous action.
