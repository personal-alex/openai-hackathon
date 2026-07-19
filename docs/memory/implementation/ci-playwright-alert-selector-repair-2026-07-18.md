---
title: ci-playwright-alert-selector-repair-2026-07-18
type: note
permalink: openai-hackathon/implementation/ci-playwright-alert-selector-repair-2026-07-18
tags:
- life-navigator
- ci
- playwright
- testing
---

# CI Playwright alert selector repair

- Inspected failed GitHub Actions CI run 29637103505. The rate-limit journey had one remaining strict-selector failure because `getByRole('alert')` matched the form error and Next’s route announcer.
- Scoped both assertions to `.conversation-composer`, the stable form boundary already used by related tests.
- Verified: diff check, typecheck, lint, 75 Vitest tests, 19/19 Chromium Playwright journeys, and production build.

Related: [[docs/CODEX_COLLABORATION]], [[implementation/m9-classification-question-boundary-repair-2026-07-18]].