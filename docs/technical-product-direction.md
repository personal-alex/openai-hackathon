# Life Navigator — Hackathon Technical & Product Direction

**Status:** Decision record and planning brief  
**Audience:** Product, UX, architecture, engineering, QA, content, and AI agents  
**Scope:** OpenAI Build Week hackathon implementation, with a deliberate path to a real-world MVP

---

## 1. Purpose

This document records the agreed direction for building **Life Navigator**: an Israel-first, source-backed application that turns a major life event into an evolving, explainable action roadmap.

Use this document as the primary input for:

- A Linear project plan, milestones, issues, and acceptance criteria
- A high-level design (HLD) and technical decision records
- UX information architecture, user flows, wireframes, and usability reviews
- Content design, source-card curation, and safety review
- Repository structure, tests, deployment, and demo/submission evidence

This is a decision brief, not an HLD. It specifies the intended product boundary, architecture direction, development tooling, and the trade-offs that later artifacts must respect.

---

## 2. Product thesis

When a life event happens, people encounter disconnected institutions, dense terminology, deadlines, and contradictory information. Life Navigator starts with a human statement, gathers only context that changes the plan, and creates a persistent roadmap of what to do next, when, why, and where to verify it.

**The primary product artifact is the roadmap, not the chat response.** Conversation is an input and explanation mechanism.

### Design principles

1. **Life event first.** Users describe what happened; they do not need to know the responsible agency.
2. **Roadmap over prose.** The durable output is an inspectable, time-organized plan.
3. **Decision-changing questions only.** Ask a minimal, intentional sequence of questions.
4. **Ground important guidance.** Tasks link to curated official source cards and show publisher/review information.
5. **Explain every meaningful change.** Users can see why a question was asked and why a task appears, changes, or disappears.
6. **Calm and bounded.** The product offers educational planning support, not legal, medical, tax, financial advice, or an eligibility determination.
7. **Human remains in control.** The product never submits forms, books appointments, or acts autonomously.
8. **Reuse must be demonstrated, not merely claimed.** Multiple events execute through the same engine and contracts.

---

## 3. Hackathon outcome

Build a working, public, reliable web application that visibly demonstrates:

- Natural-language event intake
- Schema-validated event and context state
- Minimal context gathering with a visible rationale per question
- A live, persistent roadmap that updates after each answer
- Source-backed and explainable tasks
- Deterministic change detection when context changes
- A reusable Life Event Engine proven across multiple life-event categories
- Genuine, traceable Codex-assisted development and GPT-5.6 usage

The target is a flawless, rehearsable 90-second product flow and a public video under three minutes. Technical depth must be legible to judges without degrading the consumer experience.

---

## 4. Product scope

### Jurisdiction and language

- **Jurisdiction:** Israel only for hackathon scope
- **UI and submission language:** English only
- **Hebrew localization:** Explicitly out of hackathon scope; all judge-facing materials and the product demo are English
- **Persistence:** Anonymous, browser-local only

### Event portfolio

| Event | Category | Implementation level | Product purpose |
|---|---|---:|---|
| Expecting a child | Family / health-adjacent / benefits | Full interactive flow | Proves long-horizon planning across preparation, employment, benefits, registration, and post-birth administration |
| I lost my job | Employment / income disruption | Full interactive flow | Proves urgent, high-stakes sequencing and materially different decision rules |
| I’m moving home | Civic / household logistics | Optional, only after the two full flows meet quality gates | May provide a third category proof, but is not committed hackathon scope |

### Scope rules

- The two full flows are the minimum product bar.
- Moving home is a **stretch goal**. Do not start it until the two deep flows, tests, demo reliability, and submission evidence pass their quality gates. If included, it must be a real engine-powered flow, not a static mockup.
- Do **not** implement bereavement in the hackathon version. It requires trauma-informed interaction, specialized content review, and a different safety standard.
- Do **not** add more jurisdictions, account systems, institution integrations, reminders, benefit calculators, appointments, or form submission.

---

## 5. Experience requirements

### Experience direction

Do not freeze an information architecture, screen layout, device priority, or interaction pattern in this document. The UX/product-flow agent must explore and recommend those choices later.

The non-negotiable product dynamics are: event-led entry, minimal decision-changing questions, persistent user-controlled state, a roadmap that visibly adapts to context, inspectable rationale and provenance, safe guidance boundaries, and an understandable explanation of changes. The signature moment remains a small amount of context producing a visibly more useful plan.

### Required user capabilities

1. Enter a free-text life-event statement.
2. Confirm or correct the recognized event.
3. Answer one decision-changing question at a time.
4. See the roadmap refresh without a page reload.
5. Open every task to inspect action, timing, rationale, source, review metadata, status, and safety/verification label.
6. Mark tasks as reviewed or complete.
7. Change an answer and see affected tasks highlighted with a plain-language change explanation.
8. Reset the plan and launch a seeded demo scenario.

### Example event dynamics

- **Expecting a child:** timing is generally planned and progressive; questions influence preparation, employer/leave prompts, and administrative tasks.
- **Job loss:** timing is urgent and event-relative; questions influence next steps related to registration, documents, and verification paths.
- **Moving home:** timing is milestone-based; questions influence municipal/utility/household preparation prompts.

### Trust and safety UX

- Persistent disclaimer near roadmap and before external actions
- Clear difference between confirmed user facts, inferred facts, general planning prompts, and actions requiring verification
- External links labeled with publisher name
- Source cards display a review date
- No false precision, eligibility conclusions, or urgency language unless supported by a reviewed source
- Status cannot depend on colour alone
- Reset/Delete plan clearly removes local browser state

---

## 6. Architecture direction

### Decision

Build a single **Next.js + TypeScript** application with a server-side model boundary, versioned event packs, a deterministic roadmap compiler, and browser-local persistence.

This is intentionally a **modular monolith**. It optimizes for time to market, demo reliability, low infrastructure cost, and a clear production evolution path.

### Non-negotiable separation of responsibility

| Responsibility | Owner | Constraint |
|---|---|---|
| Interpret event language and extract stated facts | GPT-5.6 | Structured output only; unknown facts remain unknown |
| Select next question | GPT-5.6 or deterministic selector | May select only allowlisted question IDs from the active event pack |
| Draft bounded plain-language explanation | GPT-5.6 | Cannot invent task IDs, source URLs, or eligibility claims |
| Validate state and model responses | Zod + TypeScript | Invalid results are rejected/repaired before application state changes |
| Select tasks, sources, timing, confidence labels, and changes | Deterministic Roadmap Compiler | Uses only approved event-pack content and context rules |
| Render roadmap | React UI | Renders validated, approved data only; never raw model prose as a task definition |

### Core flow

```text
User statement
  -> Event interpreter (GPT-5.6 structured output)
  -> Schema validation
  -> Event/context state
  -> Next-question selector (allowlisted)
  -> User answer
  -> Deterministic Roadmap Compiler
  -> Validated roadmap + task diff
  -> Persistent two-pane UI
```

### Domain packages / modules

Design code so these modules can later be separated without rewriting their contracts:

- `domain-contracts`: Zod schemas, TypeScript types, JSON Schema export
- `event-packs`: source-controlled event configurations and reviewed content
- `roadmap-compiler`: pure functions for rule evaluation, timing, task selection, and diffs
- `ai-orchestrator`: server-only GPT-5.6 requests, schema parsing, fallbacks, and redacted telemetry
- `web-app`: Next.js UI, local state, route handlers, accessibility, and demo mode
- `test-fixtures`: seed contexts, expected roadmaps, model samples, and acceptance scenarios

---

## 7. Event pack contract

The **event pack** is the core platform artifact. Adding an event must primarily mean authoring and validating data plus rules—not implementing a bespoke page or prompt chain.

A pack contains:

```ts
type LifeEventDefinition = {
  id: "expecting_child" | "job_loss" | "move_home";
  version: string;
  jurisdiction: JurisdictionCode;
  metadata: EventMetadata;
  facts: FactDefinition[];
  questions: QuestionDefinition[];
  sourceCards: SourceCard[];
  tasks: TaskDefinition[];
  rules: RoadmapRule[];
  safety: SafetyPolicy;
  demoScenarios: DemoScenario[];
};
```

### Required event-pack qualities

- Every question declares what decision it may change and why it is asked.
- Every task has a stable ID, timing window, action summary, rationale template, source references, status, and verification/confidence label.
- Every high-stakes claim references a source card with publisher, canonical URL, review date, scope, and supported claim summary.
- Rules use stable IDs and explicit conditions, not natural-language instructions embedded in prompts.
- Event-pack validation fails if required source metadata, task anatomy, or safety fields are missing.
- Event packs are versioned in Git and covered by fixtures/tests.
- Jurisdiction-specific policy, source cards, timing conventions, and wording are separated from event-generic concepts wherever practical.

### Jurisdiction portability proof

The hackathon product supports **Israel only**. Do not add a second jurisdictional user journey, unreviewed sources, or an unsupported country selector merely to make an architectural claim.

Instead, make portability inspectable in the implementation:

- Separate generic event semantics from a `JurisdictionProfile` / jurisdiction overlay containing sources, timing rules, local terminology, and safety wording.
- Ship reviewed `IL` content only.
- Include a **non-production, non-user-selectable jurisdiction-template fixture** in tests/documentation. It contains no real advice or source claims and proves that a new profile must satisfy the same schema and compiler contract.
- Add a contract test showing that the same generic event context compiles through an IL profile, and that an incomplete profile is rejected safely at validation time.
- Document the real-world onboarding path: jurisdiction owner, legal/content review, source curation, localization, test fixtures, and release approval.

This demonstrates a credible productization path without pretending that Life Navigator already supports another jurisdiction.

---

## 8. Technology choices

| Area | Hackathon choice | Why now | Upgrade path |
|---|---|---|---|
| Application | Next.js, TypeScript, App Router | One deployable codebase for UI and secure server routes | Retain; split BFF/domain services only when integration or team boundaries require it |
| UI | Tailwind CSS, shadcn/ui, React Hook Form | High-quality accessible primitives quickly | Formal design tokens, component package, accessibility test suite |
| Domain validation | Zod + discriminated unions | Shared runtime validation and strong TypeScript ergonomics | Publish schema artifacts; version and migrate contracts |
| Event data | YAML or JSON committed to Git | Reviewed, finite, deterministic, no admin system required | Store the same schema in Postgres/CMS with editorial approvals |
| Roadmap logic | Pure TypeScript deterministic compiler | Testable and explainable; protects safety and demo reliability | Extract as a service/package if multi-client or partner use cases emerge |
| AI | GPT-5.6 Structured Outputs behind Next.js route handlers | Useful natural-language UX without giving model control over trusted content | Evals, prompt/version registry, caching, rate limits, human review workflows |
| Client persistence | `localStorage` (or IndexedDB only if necessary) | Meets anonymous session requirement at zero infra cost | Supabase Auth + Postgres for saved, cross-device plans |
| Tests | Vitest plus Playwright | Fast rule coverage and end-to-end demo assurance | CI gates, accessibility regression, model-eval regression suites |
| Hosting | Vercel + GitHub | Low-friction preview and production deployment | Paid managed tier or container deployment when required |
| Observability | Redacted server logs and deployment logs | Enough for hackathon debugging without collecting personal data | Structured tracing, alerting, retention controls, audit trails |

### Explicitly excluded technologies

- Vector database or open-web RAG
- A graph database
- Autonomous multi-agent runtime
- Authentication and backend database in hackathon critical path
- Third-party government API integration
- Background queues, notification infrastructure, calendars, or email
- Live web retrieval during user flow

These may become appropriate later, but they add operational cost and failure modes without advancing the hackathon’s core proof.

---

## 9. Codex development strategy

Codex use is a first-class delivery workstream, not a note added near submission. The hackathon rules require a working project built with Codex and GPT-5.6, a README explaining collaboration, and the `/feedback` session ID for the project thread where most core functionality was built. The rules also score technological implementation equally with design, impact, and idea quality, and use it as the first tiebreaker.

### Evidence and operating discipline

1. Start one **primary Codex project thread before implementation planning** and retain it through scaffolding, core build, test/repair, deployment, and submission documentation.
2. Use Codex to turn this direction into a project plan: propose milestones, break them into issues, identify dependencies and risks, then have the team review and accept the plan.
3. Use Codex for repository scaffolding: application structure, contracts, test harness, CI, environment-template files, contributor documentation, and initial event-pack fixtures. The team owns architecture, safety, content, and final review decisions.
4. Preserve the `/feedback` session ID associated with the majority of core implementation.
5. Make dated, atomic commits that map to requirements, tests, and reviewed outputs.
6. Maintain a `CODEX_COLLABORATION.md` or README section recording: task, Codex contribution, team decision/review, artifact/commit, and test evidence.
7. Never claim a Codex contribution that cannot be demonstrated in session evidence, commit history, code, or video.

### Project planning and scaffolding proof

The first demonstrable Codex loop should be visible in the repository:

- Codex converts approved product direction into an initial implementation plan and issue backlog.
- The team accepts/rejects/reprioritizes the plan and records the decisions.
- Codex scaffolds the monorepo/module boundaries and schema-first contracts.
- Codex generates initial fixture-driven tests from accepted contracts.
- The team iterates with Codex on failures and makes final design/safety calls.

This creates evidence of genuine engineering collaboration rather than merely using Codex to generate isolated components.

### Current MCP baseline: basic-memory

`basic-memory` is the **only MCP currently configured locally**. Its project boundary is `openai-hackathon`, as defined in `AGENTS.md`.

All agents working in this repository must follow `AGENTS.md`:

- At the start of a session, use `basic-memory` to retrieve recent activity and build task context.
- Read and write only within the `openai-hackathon` basic-memory project.
- After significant tasks, decisions, bug fixes, or architectural changes, append a specific, cross-linked update to basic-memory.
- Do not overwrite historical notes except to make a clearly marked correction.
- Update `CURRENTSTATE.md` and basic-memory after significant scope or domain-model decisions.

Use basic-memory to preserve the rationale behind the event-pack model, scope gates, source review decisions, cost controls, implementation milestones, and unresolved risks. This is a real, project-relevant Codex/MCP workflow.

### Skills and additional MCPs

Do not commit to tools that are not installed. Treat the following as a prioritized **installation/evaluation backlog**, not a hackathon dependency:

| Priority | Candidate | Intended use | Adoption gate |
|---:|---|---|---|
| 1 | Repository-local `event-pack-authoring` skill | Create/validate event packs and missing metadata | Adopt if it is invoked while creating both full event packs |
| 2 | Repository-local `roadmap-rule-testing` skill | Produce and maintain fixture-based compiler tests | Adopt if it reduces test-authoring/repair time and generated tests are reviewed |
| 3 | Repository-local `source-card-review` skill | Lint provenance, safety fields, and review dates | Adopt after the team defines the source-card schema |
| 4 | Playwright/browser MCP | Run seeded journeys against local/preview environments | Install only if available and stable; otherwise use Playwright scripts in CI |
| 5 | GitHub MCP | Issue/PR workflow and traceability | Install only if it materially improves the team's actual workflow |

Skills must be small, repository-versioned, and tied to concrete outputs. Do not install a plugin or MCP merely to list it in a submission.

### Optional internal plugin

Only after core product and evidence are complete, consider packaging the validated event-pack workflow as an internal Codex plugin, e.g. `life-navigator-event-authoring`, exposing `validate_event_pack`, `lint_source_cards`, `generate_rule_test_matrix`, `preview_roadmap`, and `diff_roadmaps`.

This remains optional. A reliable product and a truthful, well-documented basic-memory/Codex workflow are higher priority than building developer tooling for its own sake.

## 10. TCO, token management, and observability

### Hackathon infrastructure

- GitHub private repository shared with `testing@devpost.com` and `build-week-event@openai.com`
- Vercel deployment for the Next.js web app and server route handlers
- OpenAI API key stored only as a server-side environment variable
- Static, Git-versioned event packs and source cards
- Browser-local plan persistence
- `basic-memory` MCP for project knowledge and decision continuity during development

### Operating assumption

Plan for approximately **10 concurrent active users** during judging/demo traffic. This is a low-volume product demonstration, but it must have a visible budget and observability posture because OpenAI service charges beyond hackathon credits are the entrant's responsibility.

### Token and cost controls

- Define a configurable per-request token budget for extraction, question selection, and explanation calls.
- Send only the active event, relevant facts, and allowlisted candidate IDs; do not send the full repository corpus or unneeded conversation history.
- Cap input size, output tokens, retries, and maximum model calls per user interaction.
- Use structured outputs to reduce repair/retry loops.
- In seeded demo mode, use deterministic fixtures or cached validated responses for rehearsed paths.
- Add an application-level per-session and per-IP request limit suitable for 10 active users.
- Surface a controlled fallback roadmap if the model is unavailable, exceeds budget, or returns invalid data.
- Keep model name, limits, and cost assumptions in environment/configuration—not scattered through application code.

### Minimum observability

Implement privacy-preserving structured telemetry from day one. Do not log raw user stories, personally identifying text, documents, or sensitive event context.

Record at least:

| Signal | Purpose |
|---|---|
| Request ID and timestamp | Trace an interaction without retaining personal content |
| Event type and jurisdiction code | Detect usage distribution and unsupported routing |
| Model operation (`extract`, `next_question`, `explain`) | Locate cost and failure sources |
| Input/output token counts, latency, retry count | Monitor budget and user experience |
| Validation success/failure and fallback reason | Prove model safety boundary and repair reliability |
| Compiler duration and selected task-count | Detect rules/performance regressions |
| Estimated cost per request/session and aggregate budget consumption | Keep spend visible against the hackathon allowance |
| Deployment version / commit SHA | Correlate issues with releases |

Provide a simple developer-only budget/health view or exportable structured log summary. It need not be a production observability platform; it must make spend, failures, and fallback behavior inspectable during the demo and final testing.

### Demo reliability requirements

- Seeded child-expectation and job-loss scenarios
- A clear reset action
- Fallback behavior if model output is invalid, unavailable, rate-limited, or over budget
- No dependency on live third-party retrieval
- At least ten clean, repeated end-to-end runs before recording
- A documented emergency demo procedure that does not expose API keys or private user data

## 11. Production evolution roadmap

### Phase 0 — Hackathon

- Two complete Israel-only event packs: expecting a child and job loss
- Moving-home event only if its explicit quality gate is reached
- A non-production jurisdiction-template fixture and portability contract tests
- Anonymous local persistence
- Curated source cards in Git
- GPT-5.6 structured extraction/question/explanation
- Deterministic compiler and test fixtures
- Vercel deployment

### Phase 1 — Real-world MVP

Trigger: validated demand for saved plans, iterative content updates, and a controlled pilot.

- Add Supabase/Postgres and authentication for opt-in cross-device plans
- Move event packs/source cards to a reviewed editorial workflow
- Add audit fields, source review scheduling, and content owner roles
- Add analytics with explicit privacy policy and minimal collection
- Build structured model evaluations and test datasets
- Introduce rate limits, abuse protection, monitoring, and error alerts
- Conduct accessibility and user research with target Israeli users

### Phase 2 — Product readiness

Trigger: repeat engagement and a trusted, sustainable content operation.

- Role-based content management and approval workflows
- Source-change monitoring and review reminders
- Budget dashboards, token-cost anomaly alerts, and retention-controlled telemetry
- Notification/reminder capability only after consent and policy review
- More event packs and potentially more jurisdictions, each with localized source ownership
- Secure account deletion/export and privacy controls
- Professional review/handoff paths for high-stakes domains
- Product analytics, experimentation, and user-support operations

### Phase 3 — Platform and integrations

Trigger: partnerships, institution collaboration, or clearly validated workflow demand.

- Separate domain services only where operationally justified
- Carefully permissioned integrations with agencies/partners
- Audit-grade policy and eligibility logic only with domain-expert review
- Potential API/SDK for approved event-pack authoring and partner channels
- Multi-tenant/admin capabilities if Life Navigator becomes a platform offering

### Evolution constraints

- Preserve event-pack contracts as the stable extension mechanism.
- Do not replace deterministic roadmap selection with a fully generative system.
- Every added life event needs scoped safety review, source ownership, tests, and a demo/acceptance scenario.
- Do not add sensitive personal data collection unless it is necessary, consented, secured, and justified by user value.

---

## 12. Quality gates

### Product acceptance

- A user can understand the value proposition in 30 seconds.
- Each full event asks at least three purposeful context questions.
- Roadmap visibly changes after meaningful answers.
- Every demo task exposes action, timing, rationale, source, status, and verification label.
- Changing a context answer highlights affected roadmap items and explains the change.
- Reset clears local state.
- The experience makes no eligibility, medical, legal, tax, financial, or benefits determination.

### Technical acceptance

- All user/model/domain state conforms to Zod schemas.
- UI renders only catalog-approved task and source references.
- Roadmap compiler is pure, deterministic, and covered by table-driven tests.
- Event packs pass validation and source-card linting.
- A Playwright seeded happy path passes for every event.
- Server logs are redacted and do not contain personal text or sensitive documents.
- Demo mode works without a fragile live dependency.

### Submission acceptance

- Public, working deployment
- Judge-accessible repository and README
- Public YouTube video under three minutes with spoken audio
- Video explains product, GPT-5.6 role, Codex collaboration, and technical choices
- README states setup, test/demo instructions, architecture, safety boundaries, sources, limitations, Codex evidence, and GPT-5.6 use
- Primary Codex `/feedback` session ID included
- Project provenance and hackathon-period work are clear

---

## 13. Planning guidance for AI agents

### Linear planning agent

Create epics in this order:

1. **Foundation and evidence:** repository, primary Codex session, CI, deployment, README skeleton, commit conventions
2. **Domain engine:** contracts, event-pack format, compiler, diff algorithm, validation
3. **Child-expectation flow:** curated content, rules, UI, source details, fixtures/tests
4. **Job-loss flow:** curated content, rules, UI, source details, fixtures/tests
5. **Observability and cost controls:** token budgets, redacted telemetry, rate limits, fallback and health view
6. **Optional moving-home flow:** only after an explicit scope-gate decision confirms all core quality gates pass
7. **AI boundary:** structured outputs, error/fallback paths, redacted logs, safe prompt contracts
8. **Experience design:** capabilities, explainability, task status, reset, accessibility; UX agent chooses interaction pattern later
9. **Codex workflow and evidence:** basic-memory practice, planning/scaffolding evidence, skills evaluation, README documentation
10. **Demo and submission:** seeded modes, rehearsal, video, final README and proof package

For each issue, include: user/product outcome, explicit scope boundary, implementation notes, acceptance criteria, test evidence, and dependency.

### HLD agent

Create diagrams and interfaces for:

- Client/UI state and local persistence, without prescribing layout
- Server-side AI orchestration boundary
- Shared schema validation boundary
- Event-pack loading/validation
- Roadmap compiler inputs/outputs
- Source-card provenance
- Jurisdiction profile / event-generic contract separation
- Failure, budget-exceeded, and fallback paths
- Token/cost telemetry, redaction, and deployment secrets

Do not introduce a database, agents, RAG, queues, or microservices unless the HLD frames them as future options rather than hackathon dependencies.

### UX/product-flow agent

Design flows for:

- Event selection/intake and confidence confirmation
- Sequential questions with “Why am I being asked?”
- Roadmap empty, draft, and personalized states
- Task inspection, sources, and disclaimer
- Context edit and “what changed” explanation
- Complete/review task statuses
- Reset/delete state
- Error/degraded AI response that preserves a useful deterministic roadmap

Recommend interaction patterns and information architecture from these capabilities; do not assume a predefined pane layout. Use a consistent interaction grammar across events, while letting task timing and visual tone reflect each event’s urgency.

### Content/safety agent

For every source card, capture:

- Stable ID
- Title
- Publisher
- Canonical URL
- Access/review date
- Supported claim summary
- Applicable event/task IDs
- Safety notes and limitations
- Owner/reviewer

Prefer “review whether this applies” to any claim of entitlement or eligibility. Never copy extensive source text into model prompts.

---

## 14. Decision log

| Decision | Rationale | Consequence |
|---|---|---|
| Israel-only | Enables credible curated content and safety language | Defer global/multi-jurisdiction claims |
| Two deep events plus one small event | Shows platform breadth without sacrificing quality | Moving home must remain intentionally narrow |
| Versioned event packs | Makes extensibility concrete and reviewable | Requires contracts, validation, and tests early |
| Deterministic compiler | Ensures explanation, safety, tests, and reliable demos | Model cannot be treated as the rules engine |
| GPT-5.6 structured outputs | Provides natural language understanding while constraining risk | Requires schema/error handling and a server boundary |
| Local-only persistence | Matches MVP privacy and time-to-market needs | No account-backed plans in hackathon release |
| No RAG/live search | Avoids unreviewed/stale guidance and fragile demo dependencies | Content curation is an explicit product responsibility |
| Codex skills/MCP for development | Makes Codex contribution repeatable and demonstrable | Must support real work and be preserved as evidence |
| Modular monolith | Fastest coherent delivery with low TCO | Service decomposition deferred until justified |

---

## 15. Resolved assumptions and remaining decisions

### Resolved

| Topic | Decision |
|---|---|
| Source and safety approval | The project team owns final sign-off for Israeli official sources and safety wording |
| Language | English only; Hebrew is intentionally deferred beyond hackathon scope |
| Repository access | Private GitHub repository shared with `testing@devpost.com` and `build-week-event@openai.com` |
| Traffic assumption | Design controls and monitoring for about 10 concurrent active users |
| MCP baseline | `basic-memory` only, limited to the `openai-hackathon` project according to `AGENTS.md` |
| Project provenance | Completely new project; keep dated evidence from the submission period |
| Moving home | Optional only after core quality gates pass |

### Remaining

1. What are the explicit scope-gate criteria and deadline for deciding whether to add moving home?
2. What per-request, per-session, and total budget thresholds should trigger warning, throttling, and deterministic fallback?
3. Which model operations require live calls during public judging versus validated deterministic demo fixtures?
4. What minimal information architecture does the UX/product-flow agent recommend to make evolving roadmap dynamics comprehensible?
5. Which optional skills/MCPs, if any, are actually installed after the core basic-memory workflow is operating?
6. Who performs the final source-card review within the project team, and what is the review checklist?

## 16. Definition of done

The hackathon build is complete only when:

- Expecting a child and job loss run through the same contracts and roadmap compiler and are polished, source-backed, explainable flows.
- A jurisdiction-template fixture and contract tests make portability visible without claiming unsupported jurisdiction coverage.
- Moving home is included only if it is a working, intentionally smaller proof of extensibility and does not compromise core quality.
- The application passes seeded end-to-end tests and repeated manual demos.
- The AI cannot inject arbitrary tasks, sources, or determinations into the roadmap.
- Budget caps, redacted telemetry, and deterministic fallback behavior work under the defined traffic assumption.
- The app is deployed and resettable.
- Codex/GPT-5.6 use is truthful, concrete, and evidenced in the repository, README, primary feedback session, basic-memory history, and video.
- Scope expansion has not compromised the coherent end-to-end user experience.
