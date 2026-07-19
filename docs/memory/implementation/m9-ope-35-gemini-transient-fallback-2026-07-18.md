---
title: m9-ope-35-gemini-transient-fallback-2026-07-18
type: note
permalink: openai-hackathon/implementation/m9-ope-35-gemini-transient-fallback-2026-07-18
tags:
- implementation
- m9
- llm-gateway
---

# M9 OPE-35 — Gemini transient fallback

- `LLM_FALLBACK_PROVIDER=gemini` enables a classification-only Gemini REST fallback with `GEMINI_API_KEY` and `GEMINI_CLASSIFIER_MODEL` server-side.
- Fallback happens only after OpenAI `unavailable`, `rate_limited`, `timeout`, or `provider_error`; unsupported and Zod-invalid output are returned as clarification without a second-model attempt.
- Gemini uses JSON response constraints and revalidates event/fact allowlists before state can change. Telemetry uses `provider=gemini` and records the original transient fallback reason, never the request text or provider output.
- Focused evidence covers constrained successful Gemini output, malformed output, and generic transient-only fallback routing.

Related: [[m9-ope-31-openai-classifier-adapter-2026-07-18]], [[m9-ope-34-classification-controls-and-telemetry-2026-07-18]]