# Candidate proposal reviewer gate

**A checked box is a human decision record, not an automated approval.** Keep a
proposal out of the catalog until every applicable item has a named reviewer,
date, and recorded disposition.

## Reviewer checklist

- [ ] The proposal is Israel-only and English-only; it neither expands the
  supported event portfolio nor activates a new `EventIdSchema` value.
- [ ] Every candidate source card has stable ID, title, publisher, canonical URL,
  access/review dates, claim scope, applicability, limitations, review owner, and
  review status.
- [ ] Each claimed fact is directly supported, bounded, current enough for the
  use, and has no invented deadline, policy fact, source, or eligibility result.
- [ ] Each task/rule has stable IDs, typed facts/timing, explicit source and
  dependency references, verification framing, and safety metadata.
- [ ] Each question demonstrably changes selection, timing, ordering, wording,
  verification state, or a documented follow-up; no curiosity-only question remains.
- [ ] Unknown/skip remains unknown and no model prose is treated as catalog truth.
- [ ] The draft contains no legal, medical, tax, financial, or eligibility conclusion.
- [ ] Draft metadata exceeding `SourceCardSchema` remains outside runtime content.
- [ ] Required contract and product safety reviewers have approved the exact
  source cards and dependent content with dated dispositions.
- [ ] A separately authorized implementation task will translate only approved
  content and run `validateEventPack`, `validateApprovedEventPack`, and focused
  Vitest checks.

## Gate record

```md
- Proposal ID/version:
- Reviewer(s) and roles:
- Review date:
- Source-card dispositions: approved / rejected / needs_review (per card)
- Catalog-content decision: approved for implementation / rejected / needs revision
- Required contract change: none / link to approved decision
- Implementation authorization: issue or explicit authorization; otherwise `not authorized`
- Remaining uncertainties and owner:
```

If any source is `needs_review` or `rejected`, if a claim is unsupported, or if
implementation authorization is absent, the outcome is **not catalog-approved**.
