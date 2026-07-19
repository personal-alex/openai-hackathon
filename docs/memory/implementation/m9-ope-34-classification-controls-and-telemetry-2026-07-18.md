---
title: m9-ope-34-classification-controls-and-telemetry-2026-07-18
type: note
permalink: openai-hackathon/implementation/m9-ope-34-classification-controls-and-telemetry-2026-07-18
tags:
- implementation
- m9
- llm-gateway
---

# M9 OPE-34 — classification controls and privacy-safe telemetry

- Gateway composition enforces max input length plus opaque session (`3` classifier / `5` total default) and per-IP (`30` default) caps before a provider call. `LLM_IP_CLASSIFICATION_CAP` joins the central server-only config.
- Telemetry records approved metadata only: request ID, timestamp, operation, provider/model, latency, optional token/cost fields, validation/fallback outcome, retry count, and deployment version. It does not retain raw statements, prompts, model output, session IDs, IPs, or secrets.
- The supplied local in-memory counter implementation is an injectable development baseline; a shared deployed store remains a production deployment concern.
- Focused evidence: 4 tests prove threshold blocking, oversize non-consumption, IP isolation, and raw-text stripping.

Related: [[m9-ope-30-classification-gateway-contract-2026-07-18]]