# Life Navigator

> A source-backed planning companion for major life events. It turns validated
> context into a clear, explainable roadmap of what to consider next, when to
> act, why each step matters, and where to verify current information.

## Status

The product architecture separates generic life-event semantics from
jurisdiction-specific profiles. Hackathon scope is English-only and ships
reviewed Israel (`IL`) content only, with complete flows for `expecting_child`
and `job_loss`. The current repository state is bootstrap-only; no product flow
is implemented yet.

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

Seeded demo mode is an approved future product capability. This bootstrap has
no event packs, model calls, or product flow; its placeholder page only confirms
that the application shell runs.

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
source, and policy-content decisions. Only reviewed, source-backed `IL` content
may be exposed in the hackathon product. This repository currently contains no
live event content, source URLs, integrations, authentication, database, or
live-web retrieval.

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
