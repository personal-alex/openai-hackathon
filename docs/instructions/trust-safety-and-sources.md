# Trust, Safety, and Source Instructions

Read this file before creating or changing event packs, source cards, task
content, rules, safety wording, or Israel-specific guidance.

## Hackathon content boundary

- Ship reviewed Israel content only; do not expose a second jurisdiction journey.
- The two complete flows are `expecting_child` and `job_loss`.
- The product provides educational planning support, not eligibility outcomes or
  legal, medical, tax, or financial advice.
- No user data collection beyond demo-required context; do not log raw stories,
  documents, or sensitive details.

## Event-pack requirements

- Store content in Git as versioned YAML or JSON after the representation is
  approved.
- Use stable IDs and explicit conditions, never natural-language rule logic in
  prompts.
- Every question states the decision it can change and why it is asked.
- Every task includes stable ID, action summary, timing window, rationale,
  source references, status, and verification/confidence label.
- Validate required task, source, and safety metadata before use.

## Source-card requirements

Every high-stakes claim must point to a reviewed source card containing:

- Publisher
- Canonical URL
- Review date
- Scope
- Supported-claim summary

Do not invent Israeli policy facts, deadlines, benefit criteria, source URLs, or
source summaries. Escalate missing or unreviewed content for human approval.
Phrase uncertain user-specific guidance as a verification prompt, not a
conclusion.

## Portability proof

A non-production jurisdiction-template fixture may prove contract portability.
It must contain no real advice, source claims, or user-selectable country flow.
Incomplete profiles must fail validation safely.
