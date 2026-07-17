---
title: active-question-focus-and-route-prominence-2026-07-17
type: note
permalink: openai-hackathon/implementation/active-question-focus-and-route-prominence-2026-07-17
tags:
- implementation
- ux
- roadmap
- verified
---

# Active-question focus and route prominence

- **Date:** 2026-07-17
- **Decision:** Keep the structured conversation focused on its active allowlisted question through a bounded auto-following viewport; older turns remain available by scrolling above it. Respect reduced motion by avoiding smooth scrolling.
- **Route behavior:** Within the generic five-item route preview, validated compiler-diff items are promoted so newly added answer-gated official-route tasks remain visible beside practical planning tasks. This does not inspect event, task, jurisdiction, source, or eligibility identifiers.
- **Scope:** No event-pack, source-card, rule, compiler, contract, or AI behavior changed. The job-loss catalog continues to provide practical next-role guidance by default and only adds official-route review from explicit approved facts.
- **Evidence:** [commit 16250a9](https://github.com/personal-alex/openai-hackathon/commit/16250a9), [CURRENT_STATE.md](CURRENT_STATE.md), [Codex collaboration record](docs/CODEX_COLLABORATION.md); typecheck, lint, 53 Vitest tests, 15 serial Chromium journeys, build, and diff check passed.

## Related

- [[action-route-workspace-2026-07-17]]
- [[action-route-intro-visibility-and-timing-labels-2026-07-17]]
- [[job-loss-pack-integration-2026-07-17]]
