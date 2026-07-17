# Internal review-deck outline — `expecting_child` candidate packet

**Internal review artifact only.** This is not user-facing content, a runtime
pack, approval record, legal/medical/eligibility guidance, or a source of truth.

## Slide 1 — Review decision requested

- Candidate-only Israel / English `expecting_child` research packet.
- Decide whether each source, claim boundary, task, fact, question, safety note,
  and future implementation path is accepted, rejected, or needs revision.
- Current outcome: scope-approved primary evidence for the routine
  Israeli-hospital registration path; no catalog/runtime approval.

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
- Primary reviewed scope: `ec_piba_birth_registry_procedure`,
  `ec_piba_newborn_name`, `ec_piba_birth_certificate`, and
  `ec_moh_birth_certificate_parents`. This is candidate evidence only.

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
- Only after explicit confirmation may the hospital-routing question be asked
  or post-transition verification tasks be surfaced.
- Review whether the proposed fact/update is appropriate, minimal, and safe.

## Slide 4 — Candidate task/source relationships

- Pre-transition: an explicitly recorded `not_shared` contact fact may surface
  an optional, non-urgent qualified-professional planning follow-up; it does
  not characterize care status and needs clinical/safety review.
- Post-transition: ask “Was the child born in an Israeli hospital?” `true`
  selects the reviewed routine path; `false` or unknown selects only a scoped
  verification-required state.
- The routine-path candidate wording distinguishes the hospital birth notice
  from the Authority’s Population Registry entry. A missing first name selects
  only a conditional official-service action; birth-certificate follow-up is
  optional.
- Kol Zchut is supplemental provenance only; primary cards remain required.
- The direct primary procedure is approved with scope for a routine birth in an
  Israeli hospital. Do not generalise it to special paths.

## Slide 5 — Required human dispositions

- Assign a named reviewer and date to every source card.
- Re-check source currency, scope, English accessibility, linked official/legal
  sources, and all material claims.
- Approve/reject task wording, sources, timing, rules, questions, safety copy,
  and scenario boundaries.
- Confirm special-case exclusion/deferment: birth outside Israel, home or
  non-recognised-institution birth, disputed parentage, late registration,
  corrections, adoption, and surrogacy. Law-office/embassy sources,
  correction-consent claims, and household-status updates are excluded.
- Decide whether the medical-adjacent prompt is retained and who approves it.

## Slide 6 — Implementation gate

- Do not create a runtime pack from this deck or packet.
- Exclude rejected, unresolved, and `needs_review` material.
- Only a separately authorized implementation task may translate dated,
  human-approved content into a runtime pack and run pack validation, compiler
  tests, and seeded journey checks.
