# Reviewer gate — candidate `expecting_child` packet

**Current outcome: not catalog-approved.** The dated decision below approves
only the defined routine Israeli-hospital scope of four primary evidence cards.
All content remains candidate-only, other sources remain `needs_review`, and no
implementation is authorized.

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
- [x] Human review decision recorded on 2026-07-17: **Approved with scope:
  routine birth in an Israeli hospital.** The reviewed primary procedure
  distinguishes the hospital birth notice from the Population Registry entry;
  it does not approve a runtime pack. The system-led statement applies only
  where the newborn is eligible for entry in Israel’s Population Registry; it
  does not mean every newborn born in an Israeli hospital automatically
  receives an Israeli ID.
- [x] The candidate asks “Was the child born in an Israeli hospital?” only after
  explicit `event_stage = birth_occurred`. `true` may show the reviewed routine
  path; `false` or unknown must route to verification-required state.
- [x] The conditional first-name action is limited to a missing name in the
  hospital notice. It is not a default manual-registration requirement.
- [x] Birth-certificate wording is optional, follows notice receipt, and is not
  a prerequisite to the registry entry.
- [ ] Special-case process content remains excluded/deferred: birth outside
  Israel, home/non-recognised-institution birth, disputed parentage, late
  registration, corrections, adoption, and surrogacy.
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
| `ec_piba_birth_registry_procedure` | Project owner (worktree directive) | 2026-07-17 | `approved` with scope | Approved with scope: routine birth in an Israeli hospital. Hospital notice is distinct from registry entry; the system-led statement applies only where the newborn is eligible for Population Registry entry, not to every newborn born in an Israeli hospital. |
| `ec_piba_newborn_name` | Project owner (worktree directive) | 2026-07-17 | `approved` with scope | Conditional first-name action only. |
| `ec_piba_birth_certificate` | Project owner (worktree directive) | 2026-07-17 | `approved` with scope | Optional certificate after notice receipt. |
| `ec_moh_birth_certificate_parents` | Project owner (worktree directive) | 2026-07-17 | `approved` with scope | Supplementary optional-certificate context only. |
| `ec_moh_prenatal_follow_up` | unassigned | not reviewed | `needs_review` | — |
| `ec_kolzchut_maternity_allowance` | unassigned | not reviewed | `needs_review` | Secondary only; NII primary cards required. |
| `ec_kolzchut_birth_grant` | unassigned | not reviewed | `needs_review` | Secondary only; NII primary card required. |
| `ec_kolzchut_birth_notification` | unassigned | not reviewed | `needs_review` | Secondary discovery only; excluded from default normal path. |

## Gate record

- Proposal ID/version: `expecting_child_candidate_packet_v1`
- Reviewer(s) and roles: Project owner (worktree directive), scope review
- Review date: 2026-07-17
- Source-card dispositions: four primary registration/certificate cards
  `approved` with recorded scope; all remaining cards `needs_review`
- Catalog-content decision: needs revision; not approved for implementation
- Required contract change: none authorized. The existing confirmed-transition
  contract is used only in candidate/test-only artifacts.
- Implementation authorization: not authorized
- Remaining uncertainties and owner: all source currency, claim, safety,
  fact/rule/timing, clinical-boundary, special-case routing, remaining
  source-card dispositions, and implementation decisions belong to named human
  reviewers/project owner.

Any `needs_review`/`rejected` source, unresolved ambiguity, or missing separate
implementation authorization keeps this packet out of the catalog.
