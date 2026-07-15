# Life Navigator — Agent Instructions

## Authority

Read `CURRENT_STATE.md` first. Treat `docs/technical-product-direction.md` as
the primary decision record; a newer approved ADR may supersede it. If approved
records conflict, identify the conflict and ask rather than guessing.

## Session and memory

- Use basic-memory only in project `openai-hackathon`.
- At session start, retrieve recent activity and build task context.
- After an accepted material decision/change, append a specific memory update.
- Never store secrets, raw user stories, personal data, or sensitive context.

## Non-negotiable scope

- Israel-only, English-only hackathon product.
- Complete flows: `expecting_child` and `job_loss`; `move_home` is stretch-only.
- No second jurisdiction, authentication, integrations, autonomous actions,
  eligibility decisions, advice, live-web retrieval, or sensitive-data storage.
- Unknown facts remain unknown; do not invent policy facts or sources.

## Required architecture boundary

- Validate all AI and domain state with Zod and TypeScript.
- GPT may interpret stated facts, choose allowlisted questions, and draft bounded
  explanations only.
- The deterministic compiler selects approved tasks, sources, timing, and diffs.
- The UI renders validated catalog data, never authoritative raw model prose.

## Task-specific instructions

Read the relevant instruction file before working in its area:

- Planning, HLD, UX, task drafts, and Linear: invoke `$life-navigator-sdd`.
- Architecture, contracts, and compiler:
  `docs/instructions/architecture-and-domain.md`.
- Event packs and source cards:
  `docs/instructions/trust-safety-and-sources.md`.
- Tests, seeded demos, and release checks:
  `docs/instructions/testing-and-demo.md`.
- Material Codex evidence:
  `docs/instructions/codex-collaboration.md`.

## Change discipline

For an accepted material scope, safety, domain, or architecture decision, update
`CURRENT_STATE.md`, basic-memory, relevant specifications/tests, and an ADR when
the decision has lasting architectural consequences. Create or update Linear
only after explicit user authorization.
