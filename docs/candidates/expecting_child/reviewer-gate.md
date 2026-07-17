# Reviewer gate — candidate `expecting_child` packet

**Current outcome: not catalog-approved.** Every source card is
`needs_review`, all content is candidate-only, and no implementation is
authorized.

## Checklist

- [ ] The packet remains Israel-only and English-only, uses only the existing
  `expecting_child` ID, and does not activate a registry or user flow.
- [ ] Each evidence card has a stable ID, title, publisher, canonical URL,
  access/review date, claim scope, applicability, limitations, owner, and
  disposition.
- [ ] A named reviewer re-opened each URL and assessed currency, primary-source
  authority, accessibility, and the exact bounded claim.
- [ ] Each Kol Zchut card is treated as a secondary rights-information source;
  any material claim has a separately reviewed primary official/legal source or
  is excluded as unresolved.
- [ ] No source-derived task asserts eligibility, entitlement, payment, benefit
  amount, deadline, legal duty, medical need, diagnosis, or care instruction.
- [ ] Each retained task/rule has approved stable IDs, typed facts/timing,
  source and dependency references, verification framing, and safety metadata.
- [ ] Each retained question has a documented effect on selection, timing,
  ordering, wording, verification state, or an explicit follow-up; skips and
  unknowns remain unknown.
- [ ] The candidate confirmed-transition representation is approved, rejected,
  or revised; `due_date` must not be used as proof of birth. Ordinary prenatal
  intake must not require a birth-occurrence question; only an explicit
  statement or user-controlled status update may set the transition fact.
- [ ] The newborn-name question and task are route-neutral and make no hospital,
  GovID, parentage, documents, citizenship/residency, or registration-path
  assumption. The direct primary birth-notification / registration procedure is
  either reviewed or remains excluded as `unresolved`.
- [ ] The prenatal-contact follow-up is approved only as an optional,
  non-urgent response to an explicitly recorded `not_shared` fact; it must not
  characterize missing information as a care failure, risk, exception, or
  medical urgency.
- [ ] The NII post-transition candidate is limited to reviewing official
  birth-grant information and makes no broader NII, entitlement, payment, or
  process claim.
- [ ] A qualified reviewer decides whether medical-adjacent material is in scope
  and approves any related boundary/escalation wording.
- [ ] Draft metadata stays outside runtime content until an authorized
  implementation translates approved values to the existing schemas.
- [ ] The implementation task, if opened, will validate the exact runtime data
  with `validateEventPack` and `validateApprovedEventPack`, then add focused
  tests and seeded demo evidence.

## Required disposition record

| Candidate source ID | Human reviewer | Review date | Disposition | Currency/claim notes |
| --- | --- | --- | --- | --- |
| `ec_nii_maternity_allowance_overview` | unassigned | not reviewed | `needs_review` | — |
| `ec_nii_maternity_allowance_conditions` | unassigned | not reviewed | `needs_review` | — |
| `ec_nii_birth_grant` | unassigned | not reviewed | `needs_review` | — |
| `ec_piba_newborn_name` | unassigned | not reviewed | `needs_review` | — |
| `ec_moh_prenatal_follow_up` | unassigned | not reviewed | `needs_review` | — |
| `ec_kolzchut_maternity_allowance` | unassigned | not reviewed | `needs_review` | Secondary only; NII primary cards required. |
| `ec_kolzchut_birth_grant` | unassigned | not reviewed | `needs_review` | Secondary only; NII primary card required. |
| `ec_kolzchut_birth_notification` | unassigned | not reviewed | `needs_review` | Direct primary procedure unresolved. |

## Gate record

- Proposal ID/version: `expecting_child_candidate_packet_v1`
- Reviewer(s) and roles: unassigned
- Review date: not reviewed
- Source-card dispositions: all `needs_review`
- Catalog-content decision: needs revision; not approved for implementation
- Required contract change: none authorized. The post-birth stage issue is an
  open content/modeling question, not permission to alter contracts.
- Implementation authorization: not authorized
- Remaining uncertainties and owner: all source currency, claim, safety,
  fact/rule/timing, clinical-boundary, stage-modeling, Kol Zchut primary-source
  mapping, and implementation decisions belong to named human reviewers/project
  owner.

Any `needs_review`/`rejected` source, unresolved ambiguity, or missing separate
implementation authorization keeps this packet out of the catalog.
