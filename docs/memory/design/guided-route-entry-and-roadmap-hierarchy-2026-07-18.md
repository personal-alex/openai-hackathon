---
title: guided-route-entry-and-roadmap-hierarchy-2026-07-18
type: note
permalink: openai-hackathon/design/guided-route-entry-and-roadmap-hierarchy-2026-07-18
tags:
- ux
- roadmap
- accessibility
- verified
---

# Guided-route entry and roadmap hierarchy refinement

- Decision: retain the Life Navigator motto animation as an intentional product pitch, then automatically enter the landing experience three seconds after the complete statement resolves; keep Skip intro and reduced-motion support.
- Generic UI: replace implementation-facing “Supported seeded scenarios” with supported quick-start scope, elevate the compiler-selected first task as “Start here,” group remaining validated tasks with existing timing lanes, and offer an in-question route-update anchor when a TaskDiff exists.
- Boundaries: no event-pack, source card, rule, compiler selection, or model-authoritative content changed.
- Evidence: `git diff --check`, typecheck, lint, 75 Vitest tests, 19 Chromium journeys, and production build passed.

Related: [[CURRENT_STATE]] · [[docs/CODEX_COLLABORATION]] · [[DESIGN]] · [[impeccable/critique/2026-07-18T10-22-01Z__src-app-page-tsx]]