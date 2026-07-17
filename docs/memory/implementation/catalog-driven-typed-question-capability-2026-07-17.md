---
title: catalog-driven-typed-question-capability-2026-07-17
type: note
permalink: openai-hackathon/implementation/catalog-driven-typed-question-capability-2026-07-17
tags:
- implementation
- architecture
- accessibility
---

# Catalog-driven typed-question capability — 2026-07-17

Main branch commit `f065967` adds a reusable validated question-presentation boundary for choice and typed text/date/number questions. Catalog data owns prompt, optional description, rationale, answer mode, typed constraints, format help, and validation wording; the generic renderer owns only neutral interaction controls and native accessible semantics. Skipped facts remain absent and invalid typed values do not mutate local context.

The `expecting_child` presentation data was migrated without changing facts, source cards, tasks, rules, or deterministic selection. AI question selection now receives only allowlist metadata, never presentation prose. ADR: [0003 catalog-driven question presentation](docs/adr/0003-catalog-driven-question-presentation.md). Evidence: `git diff --check`, lint, typecheck, 45 Vitest tests, production build, and 13 Chromium journeys passed.

This is a prerequisite for the pending job-loss candidate branch adaptation; it does not activate or alter job-loss content. Cross-links: [CURRENT_STATE](CURRENT_STATE.md), [Codex collaboration record](docs/CODEX_COLLABORATION.md), and [ADR 0003](docs/adr/0003-catalog-driven-question-presentation.md).