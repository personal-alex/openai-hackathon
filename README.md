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

## Deployment

No Vercel configuration is necessary for this baseline. After a project is
linked and configured for Node 24, deploy with `vercel --prod`.

## Codex and GPT-5.6 Collaboration

Completed, verifiable Codex use at bootstrap time covers the implementation
planning, HLD, ADR, UX decision package, and repository setup. Human review
owns all product, safety, and source decisions. The approved future GPT-5.6
role is bounded to structured interpretation of stated facts, allowlisted
question selection, and bounded explanations; it is not implemented here and
does not select authoritative tasks, sources, timing, or eligibility outcomes.

See [the Codex collaboration record](docs/CODEX_COLLABORATION.md).

Primary-thread `/feedback` session ID: _To be recorded after feedback is
submitted._
