---
title: expecting-child-candidate-integration-2026-07-17
type: note
permalink: openai-hackathon/implementation/expecting-child-candidate-integration-2026-07-17
tags:
- life-navigator
- expecting-child
- candidate-review
- integration
---

# Expecting-child candidate integration — 2026-07-17

Main-thread review approved integration of branch `codex/il-expecting-child-candidate-pack`, including reviewed source commits `877b8c1af58c707126b1db3cc12e23f55d80b650` and `6449d3fca6845f05001684c3b59f96b761134a2e`.

Approved scope: **Approved with scope: routine birth in an Israeli hospital.** The system-led routine-path statement applies only where the newborn is eligible for entry in Israel’s Population Registry; it does not mean every newborn born in an Israeli hospital automatically receives an Israeli ID.

The merge contains candidate authoring documents and a generic test-only confirmed-transition proof. It does not activate a runtime `expecting_child` pack, source-card registry, production route, compiler input, or user-facing roadmap. Special cases remain excluded/deferred: birth outside Israel, home/non-recognised-institution birth, disputed parentage, late registration, corrections, adoption, and surrogacy.

Cross-links: [[CURRENT_STATE]]; [[docs/CODEX_COLLABORATION]]; [[docs/candidates/expecting_child/reviewer-gate]]; [[docs/adr/0002-event-pack-contract-and-roadmap-compiler]].