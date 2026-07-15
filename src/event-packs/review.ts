import { type ContractValidationResult, type EventPack, validateEventPack } from "@/domain-contracts";

/**
 * Product packs may contain only source cards that a human reviewer has approved.
 * Candidate or rejected material belongs in the curation workflow, not a pack.
 */
export function validateApprovedEventPack(input: unknown): ContractValidationResult<EventPack> {
  const validation = validateEventPack(input);
  if (!validation.success) return validation;

  const errors = validation.data.sourceCards.flatMap((sourceCard) =>
    sourceCard.disposition === "approved"
      ? []
      : [`source card ${sourceCard.id} is ${sourceCard.disposition}; approved packs require an approved disposition`]
  );

  return errors.length === 0 ? validation : { success: false, errors };
}
