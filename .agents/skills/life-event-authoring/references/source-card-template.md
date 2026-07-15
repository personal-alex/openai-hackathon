# Candidate source-card template

**Proposal-only metadata — not a runtime `SourceCardSchema` object and not
approved catalog content.** Complete one record for each candidate source.

```md
## Candidate source card: <stable_candidate_source_id>

- Status: `needs_review` (candidate only; not approved for a product pack)
- Title: <source title or `unknown`>
- Publisher: <publisher or `unknown`>
- Canonical URL: <canonical URL or `unknown`>
- Access date: <YYYY-MM-DD or `unknown`>
- Review date: <YYYY-MM-DD or `not reviewed`>
- Supported-claim summary: <bounded claim, or `unknown`>
- Applicable event IDs: <canonical IDs only, or `candidate_future_event` marked non-runtime>
- Applicable task IDs: <candidate stable IDs or `none`>
- Limitations: <what this source does not establish, currency/access caveats>
- Review owner: <named human owner or `unassigned`>
- Review status: `needs_review` | `approved` | `rejected`
- Evidence notes: <location within source; no inferred policy fact>
- Follow-up: <missing evidence, conflicting source, or `none`>
```

Map only approved data to the current runtime fields: `id`, `publisher`,
`canonicalUrl`, `reviewedOn`, `reviewer`, `disposition`, `scope`, and
`supportedClaimSummary`. `title`, access/review scheduling, applicability,
limitations, and review ownership/status may exceed the current contract and
remain draft-review metadata until a separately approved contract change.
