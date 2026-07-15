# Candidate event-proposal template

**Candidate-only, unapproved, non-production.** Do not place this document or
its values in a runtime event pack.

```md
# Candidate event proposal: <candidate_event_id>

## Status and scope
- Status: `candidate_only` / `needs_human_review`
- Jurisdiction and language: `IL` / English
- Canonical runtime event ID: <existing ID or `none — do not add`>
- Purpose and user need: <proposal, not a policy claim>
- Non-goals: <no eligibility decision, advice, autonomous action, or live product retrieval>

## Event metadata and context facts
| Draft fact ID | Type | Sensitive | Why it matters | Evidence state |
| --- | --- | --- | --- | --- |
| <id> | string/boolean/number | yes/no | <candidate impact> | supported/unknown |

## Candidate rules and task templates
| Draft rule ID | Explicit condition | Effect | Uncertainty / source dependency |
| --- | --- | --- | --- |
| <id> | <contract-shaped condition> | include/exclude/override <task ID> | <unknown or source card ID> |

| Draft task ID | Action summary | Typed timing | Candidate source IDs | Dependencies | Verification state | Safety note |
| --- | --- | --- | --- | --- | --- |
| <id> | <bounded proposal> | <contract-shaped timing> | <candidate IDs> | <IDs/unknown> | verify/unknown | <no conclusion> |

## Candidate source references
- List source-card IDs and the exact claim or task they may support.
- Record missing, conflicting, stale, or inaccessible evidence as `unknown`.

## Eligibility and dependency uncertainty
- <Do not infer eligibility. List verification questions or human-review needs.>

## Safety notes
- <No legal, medical, tax, financial, or eligibility conclusion.>
- <No false urgency, deadline, or policy claim without approved evidence.>

## Proposed minimal question set
| Question ID | Fact ID | Candidate question | Decision-changing effect | Unknown/skip behavior | Evidence state |
| --- | --- | --- | --- | --- | --- |
| <id> | <id> | <approved-copy pending> | task selection/timing/ordering/wording/verification/follow-up | fact remains absent | supported/unknown |

## Human-review decisions required
- Source dispositions and review owner/date
- Claim, task, rule, timing, question, and safety-copy approval
- Contract-change decision for any draft metadata beyond runtime schemas
- Separate authorization for any approved-pack implementation
```
