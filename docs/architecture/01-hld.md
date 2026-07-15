# Life Navigator — High-Level Design

## Outcome

Provide a bounded, testable Next.js + TypeScript modular monolith that turns validated user context and reviewed event-pack data into deterministic, source-backed roadmaps.

## Authority and classification

### Decided constraints

- Canonical IDs are `expecting_child`, `job_loss`, and `move_home`; the first two are complete hackathon flows and `move_home` remains stretch-only. `docs/planning/01-implementation-plan.md#classification-and-authority`
- The MVP is a Next.js + TypeScript modular monolith with versioned event packs, a server-side AI boundary, browser-local persistence, and a pure deterministic compiler. `docs/technical-product-direction.md#6-architecture-direction`
- Zod validates AI and domain state; GPT may only interpret stated facts, choose allowlisted questions, and draft bounded explanations. The compiler alone selects tasks, sources, timing, labels, and diffs. `docs/instructions/architecture-and-domain.md#ownership-boundaries`
- Only reviewed IL content is user-facing. The MVP has no authentication, product database, queues, background workers, integrations, live-web retrieval, determinations, advice, or sensitive-data storage. `AGENTS.md#non-negotiable-scope`
- Source-card review owner is the project owner/human reviewer, with a dated disposition recorded per source card.
- Normal mode uses live GPT-5.6 Structured Outputs; seeded demo mode and controlled fallback use validated deterministic fixtures.

### Proposed implementation decisions

The designs below are approved architecture recommendations for the implementation packages in `docs/planning/01-implementation-plan.md`.

### Open question

Final numerical per-session/per-IP guard thresholds may be reassessed after measured local and preview validation; the initial limits in this HLD are the approved operating limits.

## 1. Repository and module structure

**Recommendation:** One Next.js application with dependency-restricted internal modules.

```text
src/
  domain-contracts/     # Zod schemas, inferred types, JSON Schema export
  event-packs/          # loader, validator, reviewed pack data
  roadmap-compiler/     # pure rule, timing, compile, diff functions
  ai-orchestrator/      # server-only structured-output routes and fallback
  persistence/          # local envelope, validation, reset
  telemetry/            # redaction and structured telemetry builders
  web-app/              # App Router, components, client state
  test-fixtures/        # contexts, expected roadmaps, model samples
tests/
  unit/
  e2e/
```

- **Alternatives:** Separate workspaces/packages; an undifferentiated `lib/` folder.
- **Rationale:** Internal modules make contracts inspectable without monorepo, publishing, or service-management overhead.
- **Trade-offs:** Modules are not independently deployable; lint/import rules and review must preserve boundaries.
- **Acceptance evidence:** Compiler unit tests run without Next.js; client code cannot import server-only modules; compiler has no React/Next imports.
- **ADR:** No; this realizes the already-decided modular monolith.

## 2. Contracts and validation boundaries

**Recommendation:** Zod schemas in `domain-contracts` are the runtime contract source; TypeScript types are inferred from them. Validate every untrusted transition and separate immutable catalog tasks from local progress.

```ts
type EventId = "expecting_child" | "job_loss" | "move_home";
type JurisdictionCode = "IL";

type ValidatedState = {
  eventId: EventId;
  jurisdiction: JurisdictionCode;
  context: UserContext;
  packVersion: string;
};

type CatalogTask = {
  id: string;
  title: string;
  priority: number;
  timing: Timing;
  rationale: string;
  sourceIds: string[];
  verificationLabel: string;
  dependsOn: string[];
};

type LocalProgress = {
  taskStatusById: Record<string, "reviewed" | "complete">;
};
```

| Boundary | Input | Required handling |
|---|---|---|
| Browser → route | Confirmation or answer | Parse and reject invalid input; preserve prior valid state |
| AI → app | Structured model output | Parse, allowlist, validate fact values, then accept or fallback |
| Pack loader → compiler | Event pack and IL profile | Parse once, validate cross-references, fail closed |
| Compiler → UI | Roadmap and diff | Validated immutable catalog data only |
| Local storage → browser | Versioned envelope | Parse; reset scoped envelope on any mismatch |

The compiler/event pack never owns user completion state. UI joins `CatalogTask` data with `LocalProgress` by task ID; local progress never changes selected tasks or a compiler `TaskDiff`.

- **Alternatives:** TypeScript-only contracts; status as a task field; validation only at API edges.
- **Rationale:** Zod protects model, storage, and Git-authored inputs. A local progress overlay prevents mutable user state from contaminating catalog truth.
- **Trade-offs:** More initial schemas and join logic; schema changes need fixture updates.
- **Acceptance evidence:** Invalid fixtures fail; model output cannot mutate state before parsing; changing local progress leaves compiler output/diff unchanged.
- **ADR:** Yes — ADR 0002.

## 3. Event packs: representation, loading, and validation

**Recommendation:** Store reviewed packs as Git-versioned JSON and load them through an explicit registry. JSON minimizes parser variability and maps directly to Zod and fixtures.

```ts
type EventPack = {
  id: EventId;
  version: string;
  jurisdiction: "IL";
  metadata: { title: string };
  facts: FactDefinition[];
  questions: QuestionDefinition[];
  sourceCards: SourceCard[];
  tasks: TaskDefinition[];
  baseTaskIds: string[];
  rules: RoadmapRule[];
  safety: SafetyPolicy;
  demoScenarios: DemoScenario[];
};

const eventPackRegistry = {
  expecting_child: () => import("./il/expecting_child.json"),
  job_loss: () => import("./il/job_loss.json"),
} satisfies Partial<Record<EventId, () => Promise<unknown>>>;
```

`move_home` has no registry entry until its approved scope gate passes. The loader returns a frozen `ValidatedEventPack` only after schema and cross-reference checks. It rejects duplicate IDs, unknown base task IDs, absent source references, invalid rules, and missing safety metadata.

- **Alternatives:** YAML; database/CMS; runtime directory scanning.
- **Rationale:** Git JSON plus registry is deterministic, reviewable, bundler-safe, and needs no admin system.
- **Trade-offs:** Less editor-friendly than YAML/CMS; source updates require commits.
- **Acceptance evidence:** Invalid base-task/source/fact/rule fixtures fail; a valid pack compiles base tasks without matching rules.
- **ADR:** Yes — ADR 0002.

## 4. Rule expression, precedence, conflicts, and errors

**Recommendation:** Use a constrained JSON expression tree. Rules select or modify catalog tasks only; they never define tasks, URLs, or policy content.

```ts
type Condition =
  | { all: Condition[] }
  | { any: Condition[] }
  | { not: Condition }
  | { fact: string; equals: string | boolean | number }
  | { fact: string; exists: boolean }
  | { fact: string; in: Array<string | boolean | number> };

type RoadmapRule = {
  id: string;
  priority: number; // integer
  when: Condition;
  effect: {
    includeTaskIds?: string[];
    excludeTaskIds?: string[];
    overrides?: Array<{
      taskId: string;
      priority?: number;
      timing?: Timing;
      rationaleKey?: string;
    }>;
  };
};
```

Compiler order:

1. Validate pack, declared facts, references, integer priorities, and overrides.
2. Validate supplied fact values against declared fact schemas.
3. Start with `baseTaskIds`.
4. Apply matching inclusions.
5. Apply matching exclusions.
6. Apply valid overrides to surviving tasks.
7. Deterministically sort by timing bucket, task priority, then stable task ID.

Semantics:

- `all: []` is `true`; `any: []` is `false`.
- Missing facts satisfy only `{ exists: false }`; they do not satisfy `equals`, `in`, or `exists: true`.
- Rules evaluate by descending integer priority; stable rule ID is tie-breaker only.
- Different same-priority overrides of the same task field reject the pack as a conflict.
- Overrides of excluded or unknown tasks reject the pack.

```ts
type PackValidationError = {
  code:
    | "UNKNOWN_TASK" | "UNKNOWN_SOURCE" | "UNKNOWN_FACT"
    | "INVALID_FACT_VALUE" | "INVALID_CONDITION" | "INVALID_PRIORITY"
    | "CONFLICTING_OVERRIDE" | "INVALID_OVERRIDE_TARGET" | "CYCLE";
  path: string;
  message: string;
};
```

- **Alternatives:** Prompt-encoded rules; arbitrary JavaScript predicates; lexical-order or last-write-wins behavior.
- **Rationale:** Expression trees are auditable, serializable, deterministic, and cannot execute arbitrary code; rejection avoids silent policy conflicts.
- **Trade-offs:** Less expressive than arbitrary code; new operators require contract/compiler changes.
- **Acceptance evidence:** Tests cover every operator, empty collections, missing facts, fact-type rejection, priority/tie-breaking, conflicts, inclusion/exclusion, overrides, and stable output.
- **ADR:** Yes — ADR 0002.

## 5. Timing model

**Recommendation:** Use a typed timing union with user-facing label keys separate from deterministic ordering.

```ts
type Timing =
  | { kind: "planned"; anchor: "due_date"; window: "before" | "around" | "after"; offsetDays?: number; labelKey: string }
  | { kind: "event_relative"; anchor: "event_date"; window: "immediate" | "within_days" | "after_days"; offsetDays?: number; labelKey: string }
  | { kind: "milestone"; milestone: string; window: "before" | "after" | "around"; labelKey: string }
  | { kind: "general"; labelKey: string };
```

`expecting_child` uses planned timing, `job_loss` uses event-relative timing, and approved `move_home` uses milestone timing. Unknown anchors compile to general verification-oriented labels; the compiler never estimates dates.

- **Alternatives:** Free-text timing; absolute timestamps only; event-specific fields.
- **Rationale:** A generic union expresses distinct event dynamics without false precision or event-specific services.
- **Trade-offs:** Catalog label keys must be maintained; some future timing shapes need schema extension.
- **Acceptance evidence:** Fixture coverage for each kind; unknown anchor produces no fabricated date; sorting is stable.
- **ADR:** Yes — ADR 0002.

## 6. Compiled roadmap and task-diff contracts

**Recommendation:** Emit immutable compiler data and catalog-derived change explanations.

```ts
type CompiledRoadmap = {
  schemaVersion: 1;
  eventId: EventId;
  jurisdiction: "IL";
  packVersion: string;
  contextCompleteness: number;
  steps: CatalogTask[];
  nextQuestion?: AllowlistedQuestion;
};

type TaskChange = {
  taskId: string;
  kind: "added" | "removed" | "changed";
  changedFields?: Array<"timing" | "priority" | "rationale" | "sources">;
  reason: {
    type: "context_answer" | "rule_match" | "rule_no_longer_matches";
    factId?: string;
    ruleId?: string;
    messageKey: string;
  };
};

type TaskDiff = {
  fromRoadmapVersion?: string;
  toRoadmapVersion: string;
  changes: TaskChange[];
};
```

`messageKey` resolves approved catalog copy; GPT cannot author authoritative explanations. Progress state is excluded from `TaskDiff`. Stale local progress entries are removed during validated reconciliation when a catalog task disappears.

- **Alternatives:** Client-side diffing; prose-only explanations; duplicate prior/next roadmaps.
- **Rationale:** Compiler ownership keeps change explanations reliable while UI receives simple renderable data.
- **Trade-offs:** Catalog templates add content work; future localization needs label management.
- **Acceptance evidence:** Exact fixture diffs and keys; progress-only updates produce no diff; context edits never create unexplained highlights.
- **ADR:** Yes — ADR 0002.

## 7. Server-side GPT-5.6 Structured Outputs and guarding

**Recommendation:** Use three server-only operations behind shared validation, guard, timeout, retry, fallback, and redaction wrappers.

```text
POST /api/ai/extract-event
POST /api/ai/select-next-question
POST /api/ai/draft-explanation
```

```ts
type ExtractEventOutput = {
  eventId: EventId;
  confidence: number;
  facts: Array<{ factId: string; value: string | boolean | number }>;
};
type SelectQuestionOutput = { questionId: string };
type DraftExplanationOutput = { message: string };
```

Extraction filters unknown fact IDs, validates each retained value against the active pack fact schema, rejects invalid retained values, and leaves absent facts unknown. Event/question IDs must be active-pack allowlisted.

Only live GPT calls consume guard quota. Fixtures, compiler runs, pack loading, and client-only interactions do not. Before a live call, every applicable limit is enforced:

| Scope | 10-minute sliding window | Hourly cap |
|---|---:|---:|
| Session, all AI operations | 15 | 40 |
| IP, all AI operations | 100 | 250 |
| Session, extraction | 3 | 6 |
| Session, question selection | 8 | 20 |
| Session, explanation | 6 | 16 |
| IP, each individual operation | 60 | 150 |

```ts
type LiveAiOperation = "extract" | "select_question" | "explain";
type RateLimitKey = { sessionId: string; clientIp?: string; operation: LiveAiOperation };
type GuardDecision = { allowed: true } | { allowed: false; retryAfterSeconds: number; reason: "rate_limited" };
```

- Preview/production uses shared server-side guard storage.
- Local development uses a clearly labelled in-memory guard fallback.
- Session IDs are opaque random browser-local values with no personal data.
- Only trusted deployment-provided client-IP headers are used in deployed environments.
- Normal mode uses live GPT; seeded demo and fallback use validated deterministic fixtures.
- Configure initial output caps as extraction `300`, question selection `100`, explanation `180`.
- Use a 10-second total timeout, one transient retry, and at most one structured repair attempt.
- For upstream `429`, use at most one randomized exponential-backoff retry only if it remains within total timeout and request budget.
- On local guard rejection, do not call OpenAI or retry: return `429` with `Retry-After`, preserve last validated state, and show a calm degraded-state/fallback response where applicable.

Telemetry records request ID, operation, event ID, validation/fallback outcome, latency, token counts, estimated cost, compiler duration, task count, and deployment version. It excludes raw stories, prompts, outputs, documents, secrets, and sensitive context.

- **Alternatives:** Browser API calls; generic chat endpoint; model-selected roadmaps; live-only demos; shared database/authentication for limits.
- **Rationale:** Narrow schemas and server controls maintain trust boundaries without introducing product persistence or infrastructure beyond the need for shared deployed limits.
- **Trade-offs:** More route/prompt maintenance; local in-memory guards are intentionally not production-equivalent.
- **Acceptance evidence:** Tests cover allowlists, invalid/unknown facts, all guard windows, fixture non-consumption, trusted-IP behavior, no model call after rejection, timeout, retry/repair limits, upstream-429 cutoff, fallback, and redaction.
- **ADR:** No; it implements the approved server-side model boundary and operating controls.

## 8. Browser-local persistence and reset

**Recommendation:** Persist one scoped envelope in `localStorage`, without MVP migrations.

```ts
type PersistedPlan = {
  schemaVersion: 1;
  savedAt: string;
  eventId: EventId;
  packVersion: string;
  context: UserContext;
  progress: LocalProgress;
  lastRoadmap?: CompiledRoadmap;
};
```

On load, parse and validate against the active schema and pack. On malformed data, unsupported version, schema mismatch, or pack incompatibility, remove only `life-navigator:plan:v1`, initialize a blank plan, and show a short reset notice. Do not retain raw conversation history, prompts, documents, or credentials.

- **Alternatives:** State migrations; IndexedDB; server account/database; raw transcript persistence.
- **Rationale:** Safe reset is simplest for an anonymous hackathon MVP and limits data exposure.
- **Trade-offs:** Outdated local plans are lost after contract changes; acceptable without accounts.
- **Acceptance evidence:** Tests cover valid restore, malformed JSON, every mismatch, scoped-only deletion, reset notice, and reset action.
- **ADR:** No; local-only persistence is already decided.

## 9. Test fixtures and seeded journeys

**Recommendation:** Keep fixtures beside contracts and run deterministic E2E journeys in seeded mode.

```text
src/test-fixtures/
  event-packs/
  contexts/
  expected-roadmaps/
  model-responses/
tests/unit/
  domain-contracts/ roadmap-compiler/ event-packs/ ai-orchestrator/
tests/e2e/
  expecting-child.seeded.spec.ts
  job-loss.seeded.spec.ts
```

Vitest covers schema/cross-reference validation, base tasks, all rules and timing, conflicts, exact selection/diffs, local-progress isolation, unknown facts, and incomplete profile rejection. Playwright seeded mode uses approved structured fixtures, clean storage, and exercises intake, question rationale, task/source inspection, edit/diff, local progress, reset, persistence mismatch notice, and fallback.

- **Alternatives:** Manual-only demo; live-model-only E2E; snapshot-only UI tests.
- **Rationale:** Deterministic journeys prove the product without model/network variance and enable rehearsal.
- **Trade-offs:** Fixtures can drift; shared schemas and route contract tests mitigate drift.
- **Acceptance evidence:** Both seeded flows pass; compiler matrix is table-driven; ten clean rehearsals complete before recording.
- **ADR:** No.

## 10. Security, privacy, and failure boundaries

**Recommendation:** Treat browser input and AI output as untrusted, packs as trusted only after validation, and compiler output as the sole trusted planning authority.

| Boundary | Control |
|---|---|
| Secrets | OpenAI key server-side only; never in browser, pack, logs, or fixtures |
| Data minimization | Send active event, relevant facts, and allowlisted IDs only |
| Progress | Local non-authoritative overlay; cannot affect task selection |
| Source safety | Human reviewer records dated source-card disposition; missing/unreviewed content fails closed |
| Rate/cost | Pre-request multi-scope guard counts live calls only |
| Privacy | No raw stories, prompts, outputs, documents, or sensitive context in telemetry |
| Failure | Preserve valid state; calm degraded message and deterministic fallback where applicable |
| External links | Render reviewed publisher/review metadata and verification framing |

- **Alternatives:** Trust client checks; permissive partial packs; transcript logging; live-web fallback.
- **Rationale:** These boundaries meet navigation-only scope and keep demos reliable.
- **Trade-offs:** Less diagnostic content and flexibility; demands disciplined review and fixtures.
- **Acceptance evidence:** Secret scan; redaction tests; invalid-pack tests; AI failure tests; manual verification that raw model prose cannot define a task/source.
- **ADR:** No; create one only if authentication, retention, or product data storage is introduced later.

## Flow

```text
Browser input/local progress
  → route validation
  → optional guarded AI structured operation
  → Zod validation + active-pack allowlist
  → validated context
  → pack loader + validation
  → deterministic compiler
  → immutable CompiledRoadmap + TaskDiff
  → validated UI render + local progress envelope
```

## Done when

- Contracts, pack loader, compiler, AI routes, persistence, and tests can be implemented with the interfaces above.
- ADR 0002 is accepted and referenced by implementation work.
- No design element adds policy content, jurisdictions, product storage, integrations, or autonomous action.
