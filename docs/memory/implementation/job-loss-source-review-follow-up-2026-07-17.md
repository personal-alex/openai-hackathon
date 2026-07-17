---
title: job-loss-source-review-follow-up-2026-07-17
type: note
permalink: openai-hackathon/implementation/job-loss-source-review-follow-up-2026-07-17
tags:
- life-navigator
- job-loss
- sources
- hackathon
---

Product-owner follow-up approved the Israeli Employment Service registration, unemployment-benefit, and Employment Service endpoint cards for bounded Hackathon use. The runtime pack now adds these three official cards only as corroboration for existing registration, claim-route, records, and follow-instructions tasks. Kol Zchut is approved as an authoritative public-rights cross-check while retaining publisher provenance as Kol Zchut; because the product is English-only, its Hebrew content is not used for new runtime copy without a separately approved English rendering. No eligibility, deadline, payment, or document determination was added. Tests: 48 Vitest tests, TypeScript, ESLint, production build, and five seeded Playwright journeys passed.
 Follow-up: product owner authorized online translation where an approved Hebrew source lacks an English page. The review protocol now requires the translation to be documented and checked against the original; original canonical URL and publisher remain visible. Google Translate was used to validate the Kol Zchut employment-end overview phrasing. This does not relax the bounded-claim, no-determination, or English-only runtime requirements.
 Latest product-owner direction: for Hackathon scope, use online translation when an approved source lacks an English version and auto-approve the cards. The evidence ledger now marks all listed job-loss cards approved_for_hackathon. This changes review disposition only; cards remain absent from runtime unless a bounded task mapping is intentionally added.
 Product owner mapped the approved Ministry of Labor notice, severance, and disciplinary-hearing cards to the explicit notice_given state. Runtime now shows bounded notice/severance and conditional hearing review tasks before employment ends, while withholding Employment Service registration, claim-route, and post-end records tasks. Validation passed: 48 Vitest tests, TypeScript, ESLint, build, and six seeded Playwright journeys.