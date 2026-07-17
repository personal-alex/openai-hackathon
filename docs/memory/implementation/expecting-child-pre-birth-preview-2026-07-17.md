---
title: expecting-child-pre-birth-preview-2026-07-17
type: note
permalink: openai-hackathon/implementation/expecting-child-pre-birth-preview-2026-07-17
tags:
- implementation
- ux
- expecting_child
- accessibility
---

# Expecting-child pre-birth preview — 2026-07-17

The active `expecting_child` flow now treats `event_stage = not_yet_born` as a catalog-derived presentation mode: it shows a clearly labelled after-birth planning preview using existing approved task IDs, source cards, canonical links, and rationale keys. It does not set or simulate `birth_occurred`, activate post-birth tasks, or infer an outcome. Facts that rule out the routine path select existing bounded verification previews instead.

The acknowledgement-only interstitial was removed; the first decision-changing question opens directly with supportive copy. Task-card headers are semantic disclosure buttons with `aria-expanded`, Enter/Space support, visible focus, 44px targets, and independent source/status controls. The product remains educational planning support only and performs no external action or eligibility/legal/medical/tax/financial/citizenship/parentage/registration determination.

Cross-links: [CURRENT_STATE.md](CURRENT_STATE.md), [CODEX_COLLABORATION.md](docs/CODEX_COLLABORATION.md), and `src/roadmap-compiler/presentation.ts`.