---
title: m9-ope-31-openai-classifier-adapter-2026-07-18
type: note
permalink: openai-hackathon/implementation/m9-ope-31-openai-classifier-adapter-2026-07-18
tags:
- implementation
- m9
- llm-gateway
---

# M9 OPE-31 — OpenAI classifier adapter

- The OpenAI Responses adapter uses strict JSON-schema output, temperature `0`, bounded text plus allowlisted candidate metadata only, `AbortController` timeout, and one retry for timeout/408/429/5xx.
- Configuration is server-only and injected at the composition root: `OPENAI_API_KEY` and `OPENAI_CLASSIFIER_MODEL`; UI/domain code receives only `classified` or neutral `clarification` results.
- Runtime validation rejects unallowlisted event IDs, facts, or fact types. Unsupported/invalid responses do not retry through a semantic fallback.
- Focused evidence: 6 mocked adapter tests (success, invalid schema, timeout, 429, 5xx, unsupported) plus typecheck/lint.

Related: [[m9-ope-30-classification-gateway-contract-2026-07-18]]

- Final implementation uses the official `openai@6.48.0` SDK with SDK retries disabled (`maxRetries: 0`) so the gateway's configured one bounded transient retry is the only retry policy.
