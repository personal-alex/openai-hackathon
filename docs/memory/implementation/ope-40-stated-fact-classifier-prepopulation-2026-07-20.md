---
title: ope-40-stated-fact-classifier-prepopulation-2026-07-20
type: note
permalink: openai-hackathon/implementation/ope-40-stated-fact-classifier-prepopulation-2026-07-20
---

# OPE-40 stated-fact classifier pre-population — 2026-07-20

- Active-pack classifier candidates allowlist fact keys and catalog-owned option values. Current runtime pack fact keys: expecting_child = event_stage, birth_location, birth_setting, first_name_in_hospital_notice, family_path; job_loss = employment_stage, event_date, work_arrangement, employment_service_registration, employment_end_confirmation, unemployment_claim_status, initial_focus, employment_information_status; relocate_il_us = its pack-declared facts.
- Provider prompts and JSON schemas use statedFacts, instructing models to extract only direct user statements, never infer/default/guess, and to omit absent facts. Server validation strips unknown, cross-event, duplicate, wrong-type, and unsupported-option values before they reach UI state.
- The initial classifier result is provisional. Confirmation displays pack-authored plain-language question/option labels; a user correction updates the provisional context, and only confirmed context reaches the existing selector. The selector skips questions only for fact keys present in that confirmed context.
- The legacy Linear example job_loss.separation_type does not exist in the approved runtime pack; OPE-40 uses the approved employment_stage key without adding policy/content.
- Safety boundary remains unchanged: deterministic compiler/event packs, not model prose, own tasks, sources, timing, verification/safety labels, and eligibility-adjacent outcomes.

Related: [[CURRENT_STATE]], [[docs/CODEX_COLLABORATION]], [[implementation/m9-ope-33-live-classifier-intake-2026-07-18]], [[implementation/m9-natural-language-event-classification-hints-2026-07-18]]


## Gemini compatibility follow-up — 2026-07-20

- Live Gemini was configured locally and rejected the OPE-40 dynamic multi-pack fact-ID enum plus value union with HTTP 400. The gateway correctly surfaced this as unavailable rather than accepting an unsafe result.
- Gemini now requests only string fact items in its provider schema; the shared event-scoped validator still strips unknown/cross-event/duplicate/wrong-type/unsupported values. All currently active runtime intake facts are string-valued.
- Recognition metadata adds the bounded phrases I got a job offer from a company in the USA for relocate_il_us and my workplace or factory is closing for job_loss. They identify a candidate event only; direct Gemini verification returned relocation offer/purpose and job-loss notice facts, respectively.

Related: [[CURRENT_STATE]], [[docs/CODEX_COLLABORATION]]