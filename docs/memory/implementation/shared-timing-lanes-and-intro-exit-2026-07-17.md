---
title: shared-timing-lanes-and-intro-exit-2026-07-17
type: note
permalink: openai-hackathon/implementation/shared-timing-lanes-and-intro-exit-2026-07-17
tags:
- implementation
- ux
- accessibility
- timing
---

# Shared timing lanes and intro exit reliability — 2026-07-17

Implemented a main-thread-only shared presentation change. The landing intro now starts the landing transition before the fading overlay finishes, makes the overlay non-interactive during exit, and supports Escape; browser helpers wait for actual intro removal before interacting with Continue.

Added `src/app/timing-lanes.ts`, a pure event-agnostic mapper from validated `Timing.kind` / `Timing.window` into Immediate, Preparation, Ongoing, Later, and When ready lanes. Compiler priority orders tasks inside a lane. No new contract field is required; task-specific custom lane names would need a separate approved contract. No candidate job-loss content, runtime activation, source, rule, fixture, or policy wording changed.

Passed diff check, lint, typecheck, 44 Vitest tests, production build, and 13 fresh-production Chromium journeys. Related: [[generic-roadmap-clarity-2026-07-17]].