# Synthetic future-event example draft

**Entirely synthetic, fictional, unapproved, non-production, and not a
source/policy claim.** This demonstrates proposal shape only. `fictional_future_event`
is not a canonical event ID, is not in `EventIdSchema`, and must never be put in
a registry or shown to users.

```md
# Candidate event proposal: fictional_future_event

## Status and scope
- Status: `candidate_only` / `needs_human_review`
- Jurisdiction and language: `IL` / English
- Canonical runtime event ID: none — do not add
- Purpose and user need: Synthetic example only; no real user need or policy claim.
- Non-goals: No determination, advice, action, retrieval, or runtime activation.

## Event metadata and context facts
| Draft fact ID | Type | Sensitive | Why it matters | Evidence state |
| --- | --- | --- | --- | --- |
| fictional_preference_known | boolean | no | Synthetic only: might choose generic wording or a follow-up | unknown |

## Candidate rules and task templates
| Draft rule ID | Explicit condition | Effect | Uncertainty / source dependency |
| --- | --- | --- | --- |
| fictional_rule | `{ fact: "fictional_preference_known", exists: true }` | include `fictional_verify_information` | unknown; no real source |

| Draft task ID | Action summary | Typed timing | Candidate source IDs | Dependencies | Verification state | Safety note |
| --- | --- | --- | --- | --- | --- |
| fictional_verify_information | Synthetic placeholder: verify information with an eventual approved source | `{ kind: "general", labelKey: "fictional.verify" }` | fictional_source | none | verify | Not advice or an eligibility result |

## Candidate source references
- `fictional_source`: no URL, publisher, or claim; deliberately unsupported and `needs_review`.

## Eligibility and dependency uncertainty
- Unknown. No eligibility analysis is proposed.

## Safety notes
- Synthetic placeholder only. No deadline, benefit, legal, medical, tax, or financial conclusion.

## Proposed minimal question set
| Question ID | Fact ID | Candidate question | Decision-changing effect | Unknown/skip behavior | Evidence state |
| --- | --- | --- | --- | --- | --- |
| fictional_preference_question | fictional_preference_known | Synthetic placeholder question | If known, it could include one synthetic verification reminder; otherwise record a documented follow-up | Fact remains absent; no inference | unknown |

## Human-review decisions required
- All source, claim, task, rule, question, safety, contract, and implementation decisions remain required.
```

This draft must fail the approval gate: its source is unsupported and
`needs_review`, and the event is not a runtime canonical ID.
