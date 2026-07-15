# Testing and Demo Instructions

Read this file before changing tests, demo mode, fallbacks, deployment readiness,
or release/submission evidence.

## Required test posture

- Use Vitest for domain contracts, validators, compiler rules, and fixtures.
- Use Playwright for seeded end-to-end journeys.
- The compiler must be pure and deterministic; identical validated inputs must
  produce identical output.
- Add or update tests for every approved rule, task, source-card, compiler, or
  behavior change.

## Minimum compiler evidence

Fixtures must cover:

- Both full event flows: `expecting_child` and `job_loss`
- Exact selected task IDs, timing, sources, statuses, and labels
- Context changes that produce explainable task diffs
- Unknown facts that do not cause unsupported inference
- Safe rejection of incomplete jurisdiction profiles

## Demo reliability

- Provide seeded scenarios, reset behavior, and controlled fallback behavior.
- Do not rely on live third-party retrieval during the demo path.
- Use deterministic fixtures or cached validated model responses for rehearsed
  scenarios.
- Redact logs and never expose API keys or personal data.
- Before recording, complete at least ten clean seeded end-to-end runs.

## Change evidence

For material changes, record the test command/result or demo evidence in the
commit/PR and, when applicable, `docs/CODEX_COLLABORATION.md`.
