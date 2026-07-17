---
title: action-route-intro-visibility-and-timing-labels-2026-07-17
type: note
permalink: openai-hackathon/implementation/action-route-intro-visibility-and-timing-labels-2026-07-17
tags:
- implementation
- ux
- accessibility
---

# Action Route intro visibility and timing labels — 2026-07-17

The intro now remains visible after its brief character reveal until the user
chooses Continue or Skip. A normal no-plan reload presents it again; a valid
restored plan or explicit `?demo=seeded` bypasses it, while in-app reset does
not replay it. Task drawer timing now comes from a generic mapper over the
validated timing union, so internal `labelKey` values never reach the user.

No event-pack, source, rule, compiler, or AI behavior changed. Passed diff
check, lint, typecheck, 53 Vitest tests, 14 Chromium journeys, and production
build. Related: [[action-route-intro-conversation-correction-2026-07-17]].
