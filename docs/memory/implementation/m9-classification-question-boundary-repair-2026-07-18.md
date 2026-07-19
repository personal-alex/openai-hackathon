---
title: m9-classification-question-boundary-repair-2026-07-18
type: note
permalink: openai-hackathon/implementation/m9-classification-question-boundary-repair-2026-07-18
tags:
- life-navigator
- m9
- classification
- safety
- ux
---

# M9 classification-to-question boundary repair

- Entry classification may identify an active event but never hydrates planning context from model-returned facts. Decision-changing facts are set only through approved question controls.
- This prevents a type-valid but inferred model value (for example `event_stage`) from skipping the first expecting-child question and rendering an empty route.
- Provider instructions clarify that recognition hints survive punctuation/contraction variation, require `facts: []` for entry unless an approved value is literally stated, and Ollama uses temperature 0.
- Direct local checks classified ASCII and typographic apostrophe variants of `we're having a baby!` as `expecting_child` with no facts.

Related: [[CURRENT_STATE]], [[docs/CODEX_COLLABORATION]], [[implementation/m9-natural-language-event-classification-hints-2026-07-18]].