---
title: relocate-il-us-hackathon-pack-activation-2026-07-18
type: note
permalink: openai-hackathon/implementation/relocate-il-us-hackathon-pack-activation-2026-07-18
tags:
- implementation
- event-pack
- relocate-il-us
- safety
---

# Approved `relocate_il_us` hackathon pack activation

- **Date:** 2026-07-18
- **Decision:** The project owner authorized the reviewed `relocate_il_us_candidate_packet.zip` handoff as an English-only, hackathon/demo-only runtime scenario for relocating from Israel to the United States.
- **Implementation:** Registered `relocate_il_us` through the existing validated event-pack registry, live classification candidates, seeded scenario, deterministic roadmap compiler, source inspection UI, and local progress flow. The pack contains no base tasks: unknown or skipped facts compile to no implied action.
- **Contract:** ADR 0004 records the narrow exception. `IL_US` is a pack jurisdiction while source cards preserve `IL`/`US` provenance. Planned timing can use any declared pack fact; validation rejects undeclared planned anchors.
- **Safety:** No country selector or U.S.-only product was added. The pack is `approved_for_hackathon` only and makes no immigration, visa, admission, residency, tax, filing, work authorization, benefit, or eligibility determination. The deterministic compiler remains the task/source/timing authority.
- **Evidence:** `npm run typecheck`, `npm run lint`, `npm run test` (84 tests), full Playwright E2E (20 journeys against an isolated production build), `npm run build`, and `git diff --check` passed.

## Related

- [[docs/adr/0004-hackathon-il-us-relocation-exception]]
- [[docs/technical-product-direction]]
- [[implementation/guided-route-entry-and-roadmap-hierarchy-2026-07-18]]
