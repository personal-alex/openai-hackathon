import { type EventId, type EventPack } from "@/domain-contracts";
import { validateApprovedEventPack } from "./review";
import { expectingChildPack } from "./expecting-child";
import { jobLossPack } from "./job-loss";
import { relocateIlUsPack } from "./relocate-il-us";

function registerApprovedPack(pack: EventPack): EventPack {
  const validation = validateApprovedEventPack(pack);
  if (!validation.success) throw new Error(`refusing to register invalid active pack ${pack.id}: ${validation.errors.join("; ")}`);
  return validation.data;
}

/** Deliberately registered runtime catalog. Candidate and test-only packets never enter this map. */
export const activeEventPacks = [
  registerApprovedPack(expectingChildPack),
  registerApprovedPack(jobLossPack),
  registerApprovedPack(relocateIlUsPack)
];
export const activeEventPacksById = new Map<EventId, EventPack>(activeEventPacks.map((pack) => [pack.id, pack]));
export const activeSourceCards = activeEventPacks.flatMap((pack) => pack.sourceCards);

export function getActiveEventPack(eventId: EventId): EventPack | undefined {
  return activeEventPacksById.get(eventId);
}
