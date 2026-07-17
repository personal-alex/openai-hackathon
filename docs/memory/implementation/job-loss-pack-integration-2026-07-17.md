---
title: job-loss-pack-integration-2026-07-17
type: note
permalink: openai-hackathon/implementation/job-loss-pack-integration-2026-07-17
tags:
- implementation
- event-pack
- job-loss
- integration
---

# Reviewed Israel job-loss pack integration

- Date: 2026-07-17
- Decision: The human-reviewed `job_loss@il-job-loss-v1` pack is integrated and runtime-registered beside `expecting_child@il-expecting-child-v1`.
- Provenance: Worktree `codex/job-loss-deck-audit`, adaptation/cleanup `212b7aa..8214c50`, mechanical update `8c19dc4`; master merge `f9dffbdc6319215db8961c5a8d931e9e41448b5d`.
- Prerequisites: generic typed-question and reviewed-source work in `f065967`, `b8989db`, and `268cb0e`.
- Evidence: 53 Vitest tests, 13 seeded Chromium journeys, lint, typecheck, build, and diff checks passed. Linear [[OPE-17]], [[OPE-19]], and [[OPE-20]] are Done; the [[Life Navigator]] project has an on-track two-pack update.
- Boundaries: sourced tasks require reviewed source-card dispositions; source-free tasks are labelled practical guidance. The product makes no individual eligibility, legal, tax, financial, severance, benefit, payment, or employment-outcome determination.
- Deferred: source freshness review before public release; reviewed special-route coverage for resignation and non-salaried arrangements.
- Links: [[CURRENT_STATE]], [[docs/CODEX_COLLABORATION]], [[src/event-packs/job-loss]], [[docs/candidates/job_loss/evidence-ledger]], [[docs/reviews/job-loss-il-skill-vs-reference-deck]], [[tests/unit/event-packs/job-loss-runtime]], and [[tests/e2e/scaffold]].