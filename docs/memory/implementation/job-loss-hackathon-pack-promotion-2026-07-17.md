---
title: job-loss-hackathon-pack-promotion-2026-07-17
type: note
permalink: openai-hackathon/implementation/job-loss-hackathon-pack-promotion-2026-07-17
tags:
- job-loss
- event-pack
- hackathon
- promotion
---

# Job-loss Hackathon pack promotion — 2026-07-17

- Product-owner authorization promoted `job_loss@il-job-loss-v1` through an objective source-card completeness gate.
- Four bounded NII cards are `approved_for_hackathon` and map to registration, official claim-route review, nonstandard-route verification, and records-preservation tasks. All other candidate cards remain needs-review or excluded and have no runtime reference.
- Pack behavior requires explicit `employment_stage = ended` for post-end tasks, explicit salaried status for the standard route, preserves unknown facts, and labels source-free resume/profile/outreach/support cards as practical planning guidance.
- Added job-loss pack validation/compiler tests and a seeded job-loss journey with a generic date answer control; updated registry and approval gate to accept `approved_for_hackathon` cards.
- Retained no-calculation/no-determination safety boundaries for benefit, payment, legal, tax, pension, severance, document, and deadline outcomes.
- Commit `11f9d319522c7a80ddeb57f4084cc3d7af0c7570` pushed to `origin/codex/job-loss-deck-audit`. Unit verification passed: lint, typecheck, 8 Vitest files / 48 tests, production build, and diff checks.
