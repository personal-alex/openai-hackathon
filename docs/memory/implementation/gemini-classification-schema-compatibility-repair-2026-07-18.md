---
title: gemini-classification-schema-compatibility-repair-2026-07-18
type: note
permalink: openai-hackathon/implementation/gemini-classification-schema-compatibility-repair-2026-07-18
tags:
- implementation
- gemini
- classification
- incident-repair
---

# Gemini classification schema compatibility repair

- **Date:** 2026-07-18
- **Incident:** Production entry classification returned neutral clarification for all scenarios after the relocation deployment.
- **Cause:** Gemini returned HTTP 400 (`INVALID_ARGUMENT`) for the adapter's response JSON schema. The adapter safely mapped that provider failure to `unavailable`; the UI then showed its neutral fallback.
- **Fix:** Gemini structured output now permits only an allowlisted string event ID plus internal `unsupported` sentinel and an always-empty facts array. The adapter maps the sentinel to the existing unsupported clarification. Entry classification remains unable to write decision-changing planning facts.
- **Evidence:** Direct configured-Gemini calls classified `expecting_child`, `job_loss`, and `relocate_il_us`; a tourist-visa statement returned unsupported. Typecheck, lint, focused Gemini unit tests, and production build passed.

## Related

- [[implementation/relocate-il-us-hackathon-pack-activation-2026-07-18]]
- [[docs/adr/0004-hackathon-il-us-relocation-exception]]
