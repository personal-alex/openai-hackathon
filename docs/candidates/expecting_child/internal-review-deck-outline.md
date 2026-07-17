# Internal review-deck outline — `expecting_child` candidate packet

**Internal review artifact only.** This is not user-facing content, a runtime
pack, approval record, legal/medical/eligibility guidance, or a source of truth.

## Slide 1 — Review decision requested

- Candidate-only Israel / English `expecting_child` research packet.
- Decide whether each source, claim boundary, task, fact, question, safety note,
  and future implementation path is accepted, rejected, or needs revision.
- Current outcome: no approval; every source is `needs_review`.

## Slide 2 — Evidence posture and source hierarchy

- Primary candidates: National Insurance Institute, Population and Immigration
  Authority, and Ministry of Health cards in `evidence-ledger.md`.
- Secondary candidates: the three Kol Zchut cards. They aid terminology and
  process discovery only; they are not eligibility or legal determinations.
- A secondary card alone never supports a material payment, deadline, filing,
  document, entitlement, or eligibility claim. Require the linked reviewed
  primary source or mark the claim `unresolved`.
- Kol Zchut pages used here are Hebrew-language; approve any English rendering
  separately or exclude it.

## Slide 3 — Candidate transition model

- Candidate typed fact: `event_stage` with explicitly confirmed value
  `birth_occurred`.
- Dates, estimates, schedules, elapsed time, and inferred milestones are not
  evidence of the transition.
- Post-transition operational candidate tasks are unselected while the fact is
  unknown or has another value.
- Ordinary prenatal intake does not need to ask whether birth occurred. The
  intended future UX is a user-controlled update such as “Update your life
  event: the birth has occurred”; this is proposal-only, not implemented.
- Only after explicit confirmation may the neutral name-registration question
  be asked or post-transition verification tasks be surfaced.
- Review whether the proposed fact/update is appropriate, minimal, and safe.

## Slide 4 — Candidate task/source relationships

- Pre-transition: an explicitly recorded `not_shared` contact fact may surface
  an optional, non-urgent qualified-professional planning follow-up; it does
  not characterize care status and needs clinical/safety review.
- Post-transition: route-neutral Population Authority name-registration
  verification and narrow NII birth-grant-information review require the
  confirmed transition fact.
- Kol Zchut is supplemental provenance only; primary cards remain required.
- Direct primary support for a birth-notification procedure is unresolved and
  must not become product content without review.

## Slide 5 — Required human dispositions

- Assign a named reviewer and date to every source card.
- Re-check source currency, scope, English accessibility, linked official/legal
  sources, and all material claims.
- Approve/reject task wording, sources, timing, rules, questions, safety copy,
  and scenario boundaries.
- Confirm that no hospital or other registration-route assumption enters the
  name-registration candidate, and either review a direct primary procedure or
  leave that procedure unresolved and excluded.
- Decide whether the medical-adjacent prompt is retained and who approves it.

## Slide 6 — Implementation gate

- Do not create a runtime pack from this deck or packet.
- Exclude rejected, unresolved, and `needs_review` material.
- Only a separately authorized implementation task may translate dated,
  human-approved content into a runtime pack and run pack validation, compiler
  tests, and seeded journey checks.
