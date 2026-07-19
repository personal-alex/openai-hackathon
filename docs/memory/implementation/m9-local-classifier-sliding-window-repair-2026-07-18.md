---
title: m9-local-classifier-sliding-window-repair-2026-07-18
type: note
permalink: openai-hackathon/implementation/m9-local-classifier-sliding-window-repair-2026-07-18
tags:
- life-navigator
- m9
- classification
- rate-limit
---

# M9 local classifier sliding-window repair

- Corrected the development-only classification control: it now expires opaque session/IP attempt timestamps under ten-minute and hourly windows instead of retaining a permanent process-lifetime count.
- Defaults implement the approved extraction guard limits: session extraction 3/10 min and 6/hour; session all 15/40; IP extraction 60/150; IP all 100/250. IP keys are used only when the trusted deployment path supplies one.
- The browser distinguishes an HTTP 429 local classifier limit from an unsupported event. The ordinary `We're having a baby` phrase remains a live-classifier request and is covered in the browser fixture.

Related: [[CURRENT_STATE]], [[docs/CODEX_COLLABORATION]], [[implementation/m9-natural-language-event-classification-hints-2026-07-18]].