---
title: m9-ope-30-classification-gateway-contract-2026-07-18
type: note
permalink: openai-hackathon/implementation/m9-ope-30-classification-gateway-contract-2026-07-18
tags:
- implementation
- m9
- llm-gateway
- verified
---

# M9 OPE-30 — classification gateway contract

- Provider-neutral `LlmGateway.classifyEvent()` now owns the route-to-provider boundary; UI/domain code receives either validated event/fact data or a neutral clarification reason.
- Server-only environment names are centralized: `LLM_PROVIDER`, `LLM_MODEL`, `LLM_TIMEOUT_MS`, `LLM_MAX_INPUT_CHARS`, `LLM_MAX_OUTPUT_TOKENS`, `LLM_MAX_RETRIES`, `LLM_SESSION_CLASSIFICATION_CAP`, `LLM_SESSION_TOTAL_CAP`, `OLLAMA_BASE_URL`, `OLLAMA_CLASSIFIER_MODEL`, `OPENAI_CLASSIFIER_MODEL`, `GEMINI_CLASSIFIER_MODEL`, and `LLM_FALLBACK_PROVIDER`.
- Local default: `LLM_PROVIDER=ollama`, `OLLAMA_BASE_URL=http://127.0.0.1:11434`, `OLLAMA_CLASSIFIER_MODEL=qwen3.5:9b`. Provider adapters are deliberately separate from the facade.
- User-approved M9 revision: seeded demo now uses the live classification path; deterministic compiler behavior remains downstream of confirmation.
- Evidence: commit `caa3959`; diff check, typecheck, lint, 56 Vitest tests, and production build passed.

Related: [[active-question-focus-and-route-prominence-2026-07-17]]