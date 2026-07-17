# Candidate evidence ledger — `expecting_child`

**Packet status:** `candidate_only` / `needs_human_review`. Access dates are
recorded per card. A dated, scope-limited human review decision below applies
only to the four primary newborn-registration/certificate cards; it does not
approve a runtime pack or the rest of this packet.
All statements below are bounded observations about prospective sources, not
approved content, current-policy assertions, advice, or eligibility outcomes.

## Source-use rule for this packet

Kol Zchut cards below are secondary rights-information sources. They may help a
reviewer locate terminology, processes, and prospective underlying sources, but
they are not an eligibility or legal determination. Each remains
`needs_review`, and none may by itself support a material user-facing claim
about eligibility, payment amount, deadline, a mandatory filing step, a required
document, or legal entitlement. The linked primary source card must be reviewed
for any such claim; otherwise the claim is `unresolved` and excluded.

## Candidate source card: `ec_nii_maternity_allowance_overview`

- Status: `needs_review` (candidate only; not approved for a product pack)
- Title: Maternity Allowance
- Publisher: National Insurance Institute of Israel
- Canonical URL: https://www.btl.gov.il/English%20Homepage/Benefits/Maternity%20Insurance/Maternity%20Allowance/Pages/default.aspx
- Access date: 2026-07-15
- Review date: not reviewed
- Supported-claim summary: The page describes a maternity-allowance service,
  points readers to conditions and submission information, and says an employer
  Form 100 may be used for automatic payment processing in the described path.
- Applicable event IDs: `expecting_child`
- Applicable task IDs: `ec_review_maternity_allowance_path`
- Limitations: Dynamic public information; it does not establish a particular
  person's entitlement, qualifying period, payment, employer obligation, or
  correct action. Linked forms and exceptions were not independently reviewed.
- Review owner: unassigned
- Review status: `needs_review`
- Evidence notes: Page sections “Maternity Allowance” and “How to obtain a
  maternity allowance for the mother or the father.”
- Follow-up: Human reviewer must assess currency, the exact Form 100 workflow,
  exceptions, and neutral safety copy.

## Candidate source card: `ec_nii_maternity_allowance_conditions`

- Status: `needs_review` (candidate only; not approved for a product pack)
- Title: Conditions of entitlement — Maternity Allowance
- Publisher: National Insurance Institute of Israel
- Canonical URL: https://www.btl.gov.il/English%20Homepage/Benefits/Maternity%20Insurance/Maternity%20Allowance/Pages/Conditionsofentitlement.aspx
- Access date: 2026-07-15
- Review date: not reviewed
- Supported-claim summary: The page describes conditions and qualifying-period
  information for maternity allowance, including separate discussion for
  salaried and self-employed people.
- Applicable event IDs: `expecting_child`
- Applicable task IDs: `ec_review_maternity_allowance_path`
- Limitations: Eligibility is fact-specific and the page contains time-sensitive
  exceptions. This card supports only a prompt to review the official page; it
  supports no automated determination, conclusion, duration, amount, or
  deadline.
- Review owner: unassigned
- Review status: `needs_review`
- Evidence notes: Page sections “You are working as salaried employee or
  self-employed” and qualifying-period detail.
- Follow-up: Domain/legal reviewer must decide whether any conditions can be
  represented safely and which facts, if any, are appropriate to ask.

## Candidate source card: `ec_nii_birth_grant`

- Status: `needs_review` (candidate only; not approved for a product pack)
- Title: Birth grant
- Publisher: National Insurance Institute of Israel
- Canonical URL: https://www.btl.gov.il/English%20Homepage/Benefits/Pages/BirthGrant.aspx
- Access date: 2026-07-15
- Review date: not reviewed
- Supported-claim summary: The page describes a birth-grant service, describes
  several circumstances, and distinguishes generally automatic payment from
  cases where it says a claim is required.
- Applicable event IDs: `expecting_child`
- Applicable task IDs: `ec_review_birth_grant_information`
- Limitations: Amounts, conditions, and process details are volatile and
  fact-specific. This card does not support entitlement, payment, submission,
  residency, birth-location, or medical conclusions.
- Review owner: unassigned
- Review status: `needs_review`
- Evidence notes: Page sections “Conditions of entitlement” and “How to submit
  a claim.” The page itself says its general information is not a binding
  version of the law.
- Follow-up: Re-review each potentially relevant exception and decide whether
  this source should be excluded from the first product pack.

## Candidate source card: `ec_piba_birth_registry_procedure`

- Status: `candidate_only` — reviewed primary evidence; not a product-pack card
- Title: Procedure for registering a birth in Israel (Procedure 2.2.0001)
- Publisher: Population and Immigration Authority, State of Israel
- Canonical URL: https://www.gov.il/BlobFolder/policy/birth_registry_in_israel_procedure/he/2.2.0001.pdf
- Access date: 2026-07-17
- Review date: 2026-07-17
- Supported-claim summary: For the reviewed scope of a routine birth in an
  Israeli hospital, and only where the newborn is eligible for Population
  Registry entry, the hospital submits the live-birth notification. That
  notification is not itself a Population Registry entry; an authorised
  Population and Immigration Authority registration clerk completes the entry.
- Applicable event IDs: `expecting_child`
- Applicable task IDs: `ec_register_newborn_population_registry`,
  `ec_verify_special_registration_path` (verification framing only)
- Jurisdiction: `IL`
- Lifecycle state: `candidate_only`; human-reviewed for the stated scope;
  never mapped to a runtime source card
- Limitations: The reviewed claim is limited to a routine birth in an Israeli
  hospital and applies only where the newborn is eligible for Population
  Registry entry. It does not mean every newborn born in an Israeli hospital
  automatically receives an Israeli ID, and it does not establish eligibility,
  parentage, citizenship, residency, documents, service availability, or a
  process for birth outside Israel, home/non-recognised-institution birth,
  disputed parentage, late registration, corrections, adoption, or surrogacy.
- Review owner: Project owner (worktree directive)
- Review status: `approved` with scope `routine birth in an Israeli hospital`
- Evidence notes: Procedure §§1.1–1.3 distinguishes a hospital notice from
  registry entry; §3.1 covers hospital notices; §4.26.2 says only authorised
  Authority registration makes the newborn an ID-number holder.
- Follow-up: Keep special-case procedures excluded until separately reviewed.

## Candidate source card: `ec_piba_newborn_name`

- Status: `candidate_only` — reviewed primary evidence; not a product-pack card
- Title: Register the newborn’s name, child born in Israel (free)
- Publisher: Population and Immigration Authority, State of Israel
- Canonical URL: https://www.gov.il/he/service/naming_baby
- Access date: 2026-07-17
- Review date: 2026-07-17
- Supported-claim summary: If a first name was not recorded in the hospital
  birth notification, the parent(s) may register it through the Authority’s
  official name-registration service. This is a conditional action, not a
  default mandatory manual-registration step.
- Applicable event IDs: `expecting_child`
- Applicable task IDs: `ec_register_missing_newborn_first_name`
- Jurisdiction: `IL`
- Lifecycle state: `candidate_only`; human-reviewed for the stated scope;
  never mapped to a runtime source card
- Limitations: This card does not establish that a given person can use an
  online route, is a parent, meets a documentation requirement, or has a
  completed registration. It does not support a general birth-registration
  process claim.
- Review owner: Project owner (worktree directive)
- Review status: `approved` with scope `conditional first-name action after a routine Israeli-hospital notice`
- Evidence notes: Official service title and its stated conditional service
  scope.
- Follow-up: Review any special route separately before adding process detail.

## Candidate source card: `ec_piba_birth_certificate`

- Status: `candidate_only` — reviewed primary evidence; not a product-pack card
- Title: Issue a birth certificate for people born in Israel (free)
- Publisher: Population and Immigration Authority, State of Israel
- Canonical URL: https://www.gov.il/he/service/birth_certificate
- Access date: 2026-07-17
- Review date: 2026-07-17
- Supported-claim summary: Once the hospital notice is received, parents may
  obtain a free birth certificate through the official service. This is an
  optional follow-up, not a prerequisite to the child’s registry entry.
- Applicable event IDs: `expecting_child`
- Applicable task IDs: `ec_obtain_birth_certificate_optional`
- Jurisdiction: `IL`
- Lifecycle state: `candidate_only`; human-reviewed for the stated scope;
  never mapped to a runtime source card
- Limitations: This card does not establish personal access, identity,
  eligibility, processing time, delivery method, or any use for a certificate.
- Review owner: Project owner (worktree directive)
- Review status: `approved` with scope `optional certificate follow-up after notice receipt`
- Evidence notes: Official service title and no-fee service framing.
- Follow-up: Do not add a deadline, access-method claim, or prerequisite claim
  without separate review.

## Candidate source card: `ec_moh_birth_certificate_parents`

- Status: `candidate_only` — reviewed primary evidence; not a product-pack card
- Title: Birth certificate: what parents need to know
- Publisher: Ministry of Health, State of Israel
- Canonical URL: https://me.health.gov.il/parenting/raising-children/after-childbirth/leaving-the-hospital/birth-certificate-parents/
- Access date: 2026-07-17
- Review date: 2026-07-17
- Supported-claim summary: The Ministry page provides supplementary official
  context that a birth certificate can be obtained after the hospital notice is
  received; it supports only the optional certificate follow-up.
- Applicable event IDs: `expecting_child`
- Applicable task IDs: `ec_obtain_birth_certificate_optional`
- Jurisdiction: `IL`
- Lifecycle state: `candidate_only`; human-reviewed for the stated scope;
  never mapped to a runtime source card
- Limitations: This supplementary page does not establish registry entry,
  eligibility, personal access, timing, or a requirement to obtain a
  certificate.
- Review owner: Project owner (worktree directive)
- Review status: `approved` with scope `supplementary optional certificate context`
- Evidence notes: “What happens immediately after birth” and birth-certificate
  sections; the official Authority service remains the primary action source.
- Follow-up: Do not use this page for a registry-process claim.

## Candidate source card: `ec_moh_prenatal_follow_up`

- Status: `needs_review` (candidate only; not approved for a product pack)
- Title: What Happens to Your Body During Each Stage: First Trimester
- Publisher: Ministry of Health, State of Israel
- Canonical URL: https://me.health.gov.il/en/parenting/family-planning/healthy-pregnancy-and-preventing-risks/body-during-pregnancy/first-trimester/
- Access date: 2026-07-15
- Review date: not reviewed
- Supported-claim summary: The page describes prenatal follow-up and says that
  an OB-GYN and HMO services can provide professional follow-up and guidance.
- Applicable event IDs: `expecting_child`
- Applicable task IDs: `ec_confirm_prenatal_care_contact`
- Limitations: Medical content is dynamic and individual circumstances matter.
  This card does not support diagnosis, a care schedule, tests, supplements,
  treatment, urgency assessment, or medical advice in the product.
- Review owner: unassigned
- Review status: `needs_review`
- Evidence notes: “Medical prenatal follow-up” and “Prenatal medical
  follow-ups” sections.
- Follow-up: A qualified clinical/safety reviewer must decide whether this
  category belongs in scope and approve any escalation wording.

## Candidate source card: `ec_kolzchut_maternity_allowance`

- Status: `needs_review` (candidate only; not approved for a product pack)
- Title: דמי לידה (זכות) [Maternity allowance]
- Publisher: Kol Zchut
- Canonical URL: https://www.kolzchut.org.il/he/%D7%93%D7%9E%D7%99_%D7%9C%D7%99%D7%93%D7%94
- Access date: 2026-07-17
- Review date: not reviewed
- Supported-claim summary: Secondary terminology and process map for the
  maternity-allowance topic. The page points readers to National Insurance
  information and forms, and distinguishes the topic from employment leave.
- Applicable event IDs: `expecting_child`
- Applicable task IDs: `ec_review_maternity_allowance_path` (supplemental
  research only; not sufficient task support)
- Linked official/legal sources where present: National Insurance information
  and calculator links on the page; corresponding candidate primary cards:
  `ec_nii_maternity_allowance_overview` and
  `ec_nii_maternity_allowance_conditions`.
- Limitations: Hebrew-language secondary source; translation/accessibility and
  currency require review. It is not an eligibility or legal determination and
  cannot alone support any material user-facing benefit, payment, qualifying,
  deadline, filing, document, or entitlement claim.
- Review owner: unassigned
- Review status: `needs_review`
- Evidence notes: Page lead, “official information” link, National Insurance
  calculator/form links, and linked maternity-leave terminology.
- Follow-up: Compare every retained material claim with the two NII primary
  cards; mark it `unresolved` if no reviewed primary source supports it.

## Candidate source card: `ec_kolzchut_birth_grant`

- Status: `needs_review` (candidate only; not approved for a product pack)
- Title: מענק לידה (זכות) [Birth grant]
- Publisher: Kol Zchut
- Canonical URL: https://www.kolzchut.org.il/he/%D7%9E%D7%A2%D7%A0%D7%A7_%D7%9C%D7%99%D7%93%D7%94
- Access date: 2026-07-17
- Review date: not reviewed
- Supported-claim summary: Secondary topic map for birth-grant terminology and
  for locating National Insurance information about the subject.
- Applicable event IDs: `expecting_child`
- Applicable task IDs: `ec_review_birth_grant_information` (supplemental
  research only; not sufficient task support)
- Linked official/legal sources where present: National Insurance links on the
  page; corresponding candidate primary card: `ec_nii_birth_grant`.
- Limitations: Hebrew-language secondary source; amounts, conditions, process
  detail, and exceptions are volatile. It is not an eligibility or legal
  determination and cannot alone support a material claim about payment, filing,
  documents, deadlines, or entitlement.
- Review owner: unassigned
- Review status: `needs_review`
- Evidence notes: Page opening material and National Insurance references.
- Follow-up: Retain only material claims that are separately supported and
  reviewed in `ec_nii_birth_grant`; otherwise mark them `unresolved`.

## Candidate source card: `ec_kolzchut_birth_notification`

- Status: `needs_review` (candidate only; not approved for a product pack)
- Title: רישום הודעת לידה של תינוק שנולד בארץ (הליך) [Registering a birth
  notification for a baby born in Israel]
- Publisher: Kol Zchut
- Canonical URL: https://www.kolzchut.org.il/he/%D7%A8%D7%99%D7%A9%D7%95%D7%9D_%D7%94%D7%95%D7%93%D7%A2%D7%AA_%D7%9C%D7%99%D7%93%D7%94_%D7%A9%D7%9C_%D7%AA%D7%99%D7%A0%D7%95%D7%A7_%D7%A9%D7%A0%D7%95%D7%9C%D7%93_%D7%91%D7%90%D7%A8%D7%A5
- Access date: 2026-07-17
- Review date: not reviewed
- Supported-claim summary: Secondary terminology/process map for birth
  notification and population-registration research.
- Applicable event IDs: `expecting_child`
- Applicable task IDs: none — excluded from default normal-path content
- Linked official/legal sources where present: Related reviewed primary cards:
  `ec_piba_birth_registry_procedure` and `ec_piba_newborn_name`.
- Limitations: Hebrew-language secondary source and potentially distinct from
  newborn-name registration. It is not an eligibility or legal determination
  and cannot alone support any claim about who must register, documents,
  procedure, timing, parentage, or entitlement.
- Review owner: unassigned
- Review status: `needs_review`
- Evidence notes: Page lead and its legislation/procedure references.
- Follow-up: Retain only as secondary discovery context; do not re-link it to
  the routine-hospital task or use it as standalone support.

## Evidence gaps and exclusions

- No reviewed source in this packet supports a determination of residency,
  employment qualification, leave, benefit amount, payment, claim outcome, or
  medical need.
- No deadline, legal requirement, medical schedule, personal recommendation,
  or Hebrew-to-English interpretation is proposed as product truth.
- The routine Israeli-hospital registration path is reviewed and scope-approved
  in this candidate packet. Birth outside Israel, home or non-recognised-
  institution birth, disputed parentage, late registration, corrections,
  adoption, and surrogacy remain excluded/deferred rather than unknown normal
  paths.
- Kol Zchut pages are discovery aids only in this packet. Their Hebrew-language
  material has no approved English product rendering or standalone claim use.
