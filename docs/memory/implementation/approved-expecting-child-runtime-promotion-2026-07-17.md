---
title: approved-expecting-child-runtime-promotion-2026-07-17
type: note
permalink: openai-hackathon/implementation/approved-expecting-child-runtime-promotion-2026-07-17
tags:
- implementation
- event-pack
- expecting_child
- safety
---

# Approved expecting-child runtime promotion — 2026-07-17

The human-approved Israel `expecting_child` candidate scope was promoted to the active `il-expecting-child-v1` runtime catalog. The active source cards are `ec_piba_birth_registry_procedure`, `ec_piba_newborn_name`, `ec_piba_birth_certificate`, `ec_moh_birth_certificate_parents`, and `ec_piba_birth_abroad_registration`; all use canonical official URLs and validated IDs.

Routine content applies only to a confirmed `birth_occurred` + Israel + hospital + `routine_birth` path, and only where the newborn is eligible for Population Registry entry. It does not infer or determine eligibility, ID issuance, citizenship, residency, parentage, registration outcome, or any external action. Birth abroad, non-hospital birth, and adoption/surrogacy/parentage-verification replace the routine route with bounded verification states. Late registration, corrections, household/family-status claims, unreviewed document checklists, and benefit/payment claims remain deferred.

Evidence recorded in [CURRENT_STATE.md](CURRENT_STATE.md) and [CODEX_COLLABORATION.md](docs/CODEX_COLLABORATION.md): lint, typecheck, 38 unit tests, production build, and five Playwright journeys passed.