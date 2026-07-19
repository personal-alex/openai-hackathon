---
title: m9-ope-33-live-classifier-intake-2026-07-18
type: note
permalink: openai-hackathon/implementation/m9-ope-33-live-classifier-intake-2026-07-18
tags:
- implementation
- m9
- llm-gateway
---

# M9 OPE-33 — live classifier intake

- Standard and `?demo=seeded` event entry now POST to `/api/ai/extract-event`; seeded mode no longer bypasses classification. The deterministic compiler still runs only after explicit event confirmation.
- A browser-local opaque random session ID (`life-navigator.classifier-session.v1`) accompanies requests and contains no personal data.
- The UI receives only `classified` or a neutral clarification state. Unsupported, unavailable, invalid, or rate-limited results preserve the empty preview and ask the user to clarify or choose a supported example.
- Playwright intercepts the network classifier in tests, covering job-loss/expecting-child confirmation, unsupported clarification, and seeded-mode route usage; post-confirmation route behavior remains existing compiler behavior.

Related: [[m9-ope-30-classification-gateway-contract-2026-07-18]]