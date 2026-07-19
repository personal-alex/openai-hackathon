---
title: m9-ope-32-ollama-classifier-adapter-2026-07-18
type: note
permalink: openai-hackathon/implementation/m9-ope-32-ollama-classifier-adapter-2026-07-18
tags:
- implementation
- m9
- llm-gateway
---

# M9 OPE-32 — Ollama classifier adapter

- Local default is `qwen3.5:9b` at `OLLAMA_BASE_URL=http://127.0.0.1:11434` via native `/api/chat`.
- The request uses a schema `format`, system `/no_think`, `think: false`, `stream: false`, and the configured output cap. Candidate/fact allowlists are revalidated after parsing.
- Ollama is loopback-only and returns typed `unavailable` without a fetch on Vercel or a non-local base URL. Local daemon failures are neutral clarifications, not crashes.
- README documents `ollama pull qwen3.5:9b`, `ollama serve`, and hardware caveats; Ollama values must not be deployed to Vercel.
- Focused evidence: 4 mocked adapter tests plus typecheck/lint/diff check.

Related: [[m9-ope-30-classification-gateway-contract-2026-07-18]]