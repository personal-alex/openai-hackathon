---
title: m9-natural-language-event-classification-hints-2026-07-18
type: note
permalink: openai-hackathon/implementation/m9-natural-language-event-classification-hints-2026-07-18
tags:
- life-navigator
- m9
- classification
- safety
---

# M9 natural-language event-classification hints

- Live event classification candidates now receive optional, bounded catalog-owned `recognitionHints`; they are non-policy metadata and not compiler input.
- The active Israel `expecting_child` pack includes `having a baby` and `pregnant`, so ordinary statements such as “We’re having a baby” are explicitly represented in the structured classifier prompt.
- Classification remains limited to registered event IDs and explicitly stated allowlisted facts. Tasks, sources, timing, rules, verification, and eligibility remain deterministic catalog/compiler outputs.

Related: [[CURRENT_STATE]], [[docs/CODEX_COLLABORATION]], [[implementation/m9-ope-30-classification-gateway-contract-2026-07-18]].