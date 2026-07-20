# Life Navigator

> A source-backed planning companion for major life events. It turns validated
> context into a clear, explainable roadmap of what to consider next, when to
> act, why each step matters, and where to verify current information.

## Status

The product architecture separates generic life-event semantics from
jurisdiction-specific profiles. Hackathon scope is English-only and ships
reviewed Israel (`IL`) content, plus one owner-approved, hackathon-only
`relocate_il_us` cross-border pack. Baseline complete flows are
`expecting_child` and `job_loss`; the relocation pack is not a U.S.-only
product or country selector. The repository includes the deterministic roadmap
MVP and its bounded event-classification gateway; it does not make eligibility
decisions or perform external actions.

## Setup

Use Node 24 and npm 11 (see [`.nvmrc`](.nvmrc) and `package.json`).

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the local Next.js development server. |
| `npm run build` | Create a production build. |
| `npm run start` | Serve a production build. |
| `npm run lint` | Run ESLint. |
| `npm run typecheck` | Run TypeScript without emitting files. |
| `npm run test` | Run Vitest once. |
| `npm run test:e2e` | Run Playwright's scaffold smoke test. |
| `npm run test:e2e:install` | Install Playwright Chromium locally. |

## Demo mode

Seeded demo uses the same live event-classification route as the standard entry
path, then runs the validated deterministic compiler after the user confirms the
recognized event. Tests mock the gateway; a local demo needs a configured local
or deployed provider. Unsupported or unavailable classification returns a
neutral clarification prompt rather than an empty route.

## Local Ollama classifier

The local development classifier defaults to `qwen3.5:9b` and is deliberately
limited to a loopback Ollama daemon. Install and start it before exercising the
live classification path:

```sh
ollama pull qwen3.5:9b
ollama serve
```

This 9B model can require substantial RAM and may be slow on lower-spec hardware.
It is not contacted from Vercel or other deployed environments; configure a
reviewed remote provider there instead.

## Classification controls and deployment

All classifier settings are server-only and documented in [`.env.example`](.env.example).
The gateway bounds input, output, timeout, retries, opaque-session calls, and
per-IP calls before any provider request. It emits metadata-only telemetry: no
event statement, prompt, model output, session ID, IP address, or credential is
logged.

For Vercel Preview/Production, configure a reviewed remote provider and set a
provider spend alert before exposing the URL. Keep the alert below the approved
hackathon budget, review any unexpected provider usage in deployment logs, and
set `LLM_FALLBACK_PROVIDER=gemini` only when both server-side credentials are
available and intentionally reviewed.

## Architecture and decisions

- [Implementation plan](docs/planning/01-implementation-plan.md)
- [High-level design](docs/architecture/01-hld.md)
- [Event-pack and roadmap compiler ADR](docs/adr/0002-event-pack-contract-and-roadmap-compiler.md)
- [UX product flows](docs/ux/01-product-flows.md)
- [Technical and product direction](docs/technical-product-direction.md)

The approved HLD remains the module map until implementation work creates real
code. This baseline intentionally creates no empty module directories.

## Safety, source review, and limitations

Life Navigator is planned as educational planning support, not legal, medical,
tax, financial, or eligibility advice. Human review owns product, safety,
source, and policy-content decisions. Only reviewed, source-backed catalog
content may be exposed in the hackathon product. `relocate_il_us` is approved
only for the hackathon/demo and remains verification-oriented; it is not legal,
tax, immigration, residency, or eligibility advice. The repository has no
integrations, authentication, database, or live-web retrieval.

## License

This private repository is shared only for hackathon judging and internal
collaboration. No license is granted for copying, modification, distribution,
or commercial use. See [LICENSE](LICENSE).

## Supported hackathon scenarios

- `expecting_child` — reviewed Israel family-registration planning.
- `job_loss` — reviewed Israel employment-transition planning.
- `relocate_il_us` — owner-approved, hackathon-only verification planning for
  relocating from Israel to the United States.

Start the app, enter “I’m relocating from Israel to the U.S.”, confirm the
suggested event, and answer the decision-changing questions. The deterministic
compiler will show only the source-backed verification tasks supported by the
facts you provide. See [ADR 0004](docs/adr/0004-hackathon-il-us-relocation-exception.md)
for the scenario’s boundary.

## Adding an event pack

New life events follow a controlled research, human-review, validation, and
explicit-registration process. See [Adding a Life Navigator event pack](docs/adding-an-event-pack.md)
before proposing or implementing event-pack content.

## Deployment

No Vercel configuration is necessary for this baseline. After a project is
linked and configured for Node 24, deploy with `vercel --prod`.

## Codex and GPT-5.6 Collaboration

Life Navigator was built with Codex using GPT-5.6 throughout most of the
hackathon lifecycle. GPT-5.6 supported problem discovery, product framing,
architecture and implementation planning, repository scaffolding,
implementation, debugging, test generation and repair, UI refinement,
refactoring, documentation, and submission preparation.

Codex and GPT-5.6 accelerated the implementation of the validated domain
contracts, event-pack architecture, deterministic roadmap compiler,
classification gateway, source-backed scenario packs, test fixtures,
end-to-end coverage, and deployment preparation. Isolated Git worktrees were
used for bounded life-event discovery, evidence-ledger and reviewer-gate
preparation, candidate event-pack authoring, and internal review-deck work.
Remote/mobile access was used to monitor the primary Codex session, review
results, provide context, approve actions, and redirect work while away from
the workstation.

Human review owns product scope, system architecture, trust and safety
boundaries, source-review standards, policy wording, integration decisions,
and final code review. The product's trusted decisions remain deterministic:
validated event packs and the roadmap compiler—not model prose—select
user-visible tasks, timing, sources, safety labels, and never make eligibility
outcomes.

The deployed application may use a separately configured runtime classifier;
this development-collaboration record does not claim that GPT-5.6 is the live
production runtime provider.

See [the Codex collaboration record](docs/CODEX_COLLABORATION.md).

Primary-thread `/feedback` session ID: `019f6502-98b3-7270-89f4-6bd83e370589`

This ID identifies the long-running primary Codex thread in which the majority
of Life Navigator’s core implementation work was completed. See
[`docs/CODEX_COLLABORATION.md`](docs/CODEX_COLLABORATION.md) for the dated,
verifiable collaboration record.
