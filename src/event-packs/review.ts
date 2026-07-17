import { type ContractValidationResult, type EventPack, validateEventPack } from "@/domain-contracts";

/**
 * Runtime tasks may use only source cards that a human reviewer has approved.
 * Candidate or rejected material cannot back a sourced task in an active pack.
 */
export function validateApprovedEventPack(input: unknown): ContractValidationResult<EventPack> {
  const validation = validateEventPack(input);
  if (!validation.success) return validation;

  const errors = [
    ...(validation.data.testOnly ? ["test-only event packs cannot be approved runtime content"] : []),
    ...validation.data.tasks.flatMap((task) => task.sourceIds.flatMap((sourceId) => {
      const sourceCard = validation.data.sourceCards.find((source) => source.id === sourceId);
      if (!sourceCard) return [`task ${task.id} references an unknown source card ${sourceId}`];
      return sourceCard.disposition === "approved" || sourceCard.disposition === "approved_for_hackathon"
        ? []
        : [`task ${task.id} cannot use source card ${sourceCard.id} with disposition ${sourceCard.disposition}`];
    }))
  ];

  return errors.length === 0 ? validation : { success: false, errors };
}
