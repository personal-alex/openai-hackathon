---
title: action-route-workspace-2026-07-17
type: note
permalink: openai-hackathon/implementation/action-route-workspace-2026-07-17
tags:
- implementation
- ux
- accessibility
- roadmap
---

# Action Route workspace — 2026-07-17

Implemented a shared Action Route presentation for both active Israel event
packs. Conversation now collects only seeded, validated facts; the persistent
route renders immutable compiler output, approved source metadata,
verification labels, typed timing lanes, compiler diffs, and browser-local
progress. A neutral route preview is shown before event confirmation so no
catalog task appears prematurely. Task details are keyboard-accessible and
return focus to their trigger; mobile keeps conversation first with a route
jump. The first-load editorial intro is skipped for valid restored plans and
does not replay after a same-session reset.

No event-pack, source-card, rule, compiler, contract, AI, or policy content
changed. Passed diff check, lint, typecheck, 53 Vitest tests, 9 Chromium
journeys, production build, plus desktop and 390px manual browser inspection.
Related: [[generic-roadmap-clarity-2026-07-17]] and
[[shared-timing-lanes-and-intro-exit-2026-07-17]].
