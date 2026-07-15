---
title: roadmap-compiler-planning-brief-2026-07-15
type: note
permalink: openai-hackathon/planning/roadmap-compiler-planning-brief-2026-07-15
tags:
- planning
- roadmap-compiler
- spec-review
---

# Roadmap compiler planning brief — 2026-07-15

Prepared a read-only planning brief for the deterministic roadmap compiler. No repository files or Linear tasks were created or modified.

## Traceability
- [[technical-product-direction]] §6 assigns task/source/timing/confidence/change selection to the deterministic compiler and specifies pure TypeScript functions for rules, timing, selection, and diffs.
- [[technical-product-direction]] §7 defines the event-pack contract, validation, IL-only boundary, jurisdiction fixture, and compiler contract testing.
- [[domain-model]] defines the structured, explainable roadmap and provenance invariants.
- [[ADR 0001]] preserves LifeEvent-first, platform reuse, uncertainty, and no eligibility-adjudication constraints.
- [[CURRENT_STATE]] still lists application stack and schemas as open, so exact public compiler API/schema, rule language/evaluation semantics, and error/result contracts remain open questions.

No product decision was made; the brief separates decided constraints, proposals, and open questions for team approval.


## Approved implementation plan (2026-07-15)

The team approved [[01-implementation-plan]] at `docs/planning/01-implementation-plan.md`. It sets canonical event IDs to `expecting_child`, `job_loss`, and `move_home`; sequences an HLD decision package followed immediately by UX/product-flow decisions before contracts and compiler work; and requires candidate curation, human source/safety review, then implementation for each full event pack. The plan makes `move_home` conditional on documented core quality gates. The illustrative event-ID union in [[technical-product-direction]] was aligned; [[CURRENT_STATE]] and [[CODEX_COLLABORATION]] received concise references. No application code, Linear task, commit, push, or pull request was created.


## Approved HLD and compiler contract (2026-07-15)

The team approved [[01-hld]] and [[0002-event-pack-contract-and-roadmap-compiler]]. The accepted design uses Zod validation at user, AI, event-pack, compiler, and persistence boundaries; selects roadmap tasks in the order base tasks → inclusions → exclusions → valid overrides → deterministic sort; uses typed timing and immutable catalog roadmap/diff data with browser-local progress overlay; and limits GPT to guarded structured operations. [[CURRENT_STATE]] and [[CODEX_COLLABORATION]] now reference the approval. No application code, Linear task, commit, push, or pull request was created.


## Approved UX product flows (2026-07-15)

The team approved [[01-product-flows]] for expecting_child and job_loss. It defines event-led confirmation, one-question interactions, deterministic roadmap/diff presentation, local progress overlay, accessibility, degraded states, and seeded demos. The design is independently branded; after confirmed expecting_child, acknowledgement is optional/skippable with approved neutral continuation copy. Remaining work is human-reviewed event-pack, source-card, safety-policy, and acknowledgement-content curation. [[CURRENT_STATE]] and [[CODEX_COLLABORATION]] now reference the approval. No application code, Linear task, commit, push, or pull request was created.


## P0-01 repository delivery baseline complete (2026-07-15)

P0-01 (Linear OPE-5) completed the local Next.js/TypeScript bootstrap with Node 24/npm 11 constraints, a committed npm lockfile, lint/typecheck/Vitest/Playwright harnesses, CI, and a minimal non-product app shell. Local verification passed: `npm ci`, lint, typecheck, unit test, build, Playwright Chromium installation, and end-to-end smoke test. [[CURRENT_STATE]] and [[CODEX_COLLABORATION]] record the same evidence. The initial commit/push remains pending; P0-02 is in progress. No event content, compiler, live AI, database, authentication, or product flow was added.


## P0-01 push and P2-01 validated contracts (2026-07-15)

P0-01 initial commit `2f04320` is now pushed to `origin/master`; [[CURRENT_STATE]] and [[CODEX_COLLABORATION]] record that completion. P2-01 (Linear OPE-9) adds the shared [[01-hld]]/[[0002-event-pack-contract-and-roadmap-compiler]] Zod contract boundary for event packs, context facts, tasks, sources, timing, rules, roadmaps, diffs, and local progress. Cross-reference and pack-scoped fact validation fail closed; no policy content, compiler, AI integration, or product flow was added. Lint, typecheck, two-file/six-test Vitest matrix, build, and Playwright smoke test passed.


## P2-02 source-review and event-pack authoring workflow (2026-07-15)

P2-02 (Linear OPE-10) adds [[event-pack-authoring]] and a fail-closed product-pack review gate. Candidate curation, project-owner/human-review disposition, and implementation of approved content are separate; source cards now require a named reviewer and non-approved cards are rejected. No event-policy, source, safety-copy, or event-pack content was added. Lint, typecheck, two-file/seven-test Vitest matrix, build, and Playwright smoke test passed. [[CURRENT_STATE]] and [[CODEX_COLLABORATION]] contain the corresponding evidence.