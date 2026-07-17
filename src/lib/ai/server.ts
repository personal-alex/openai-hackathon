import "server-only";
import { activeEventPacks } from "@/event-packs/registry";
import { getLlmConfig } from "./config";
import { createLlmGateway } from "./gateway";
import type { ClassificationCandidate, LlmGateway } from "./contracts";

/** The only classification candidates offered to a provider come from validated active packs. */
export function getClassificationCandidates(): readonly ClassificationCandidate[] {
  return activeEventPacks.map((pack) => ({
    id: pack.id,
    label: pack.metadata.title,
    recognitionHints: [pack.metadata.title],
    facts: pack.facts.map((fact) => ({ id: fact.id, valueType: fact.valueType }))
  }));
}

/** Provider wiring is completed by provider adapter issues; no route imports a vendor adapter directly. */
export function getClassificationGateway(): LlmGateway {
  return createLlmGateway(getLlmConfig());
}
