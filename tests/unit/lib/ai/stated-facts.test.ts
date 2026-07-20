import { describe, expect, it } from "vitest";
import { classificationCandidateFromPack, validateEventClassification } from "@/lib/ai/contracts";
import { expectingChildPack } from "@/event-packs/expecting-child";
import { jobLossPack } from "@/event-packs/job-loss";
import { relocateIlUsPack } from "@/event-packs/relocate-il-us";

const candidates = [
  classificationCandidateFromPack(expectingChildPack),
  classificationCandidateFromPack(jobLossPack),
  classificationCandidateFromPack(relocateIlUsPack)
];

describe("classifier stated-fact boundary", () => {
  it.each([
    ["expecting_child", { factId: "event_stage", value: "not_yet_born" }],
    ["job_loss", { factId: "employment_stage", value: "ended" }],
    ["relocate_il_us", { factId: "relocation_purpose", value: "employment" }]
  ] as const)("keeps an explicitly stated %s fact", (eventId, statedFact) => {
    expect(validateEventClassification({ eventId, statedFacts: [statedFact] }, candidates)).toEqual({
      kind: "classified",
      classification: { eventId, statedFacts: [statedFact] }
    });
  });

  it("strips unknown, cross-event, duplicate, and unsupported-option facts without rejecting the recognized event", () => {
    expect(validateEventClassification({
      eventId: "expecting_child",
      statedFacts: [
        { factId: "event_stage", value: "not_yet_born" },
        { factId: "event_stage", value: "birth_occurred" },
        { factId: "employment_stage", value: "ended" },
        { factId: "birth_location", value: "not_a_catalog_option" }
      ]
    }, candidates)).toEqual({
      kind: "classified",
      classification: { eventId: "expecting_child", statedFacts: [{ factId: "event_stage", value: "not_yet_born" }] }
    });
  });

  it("keeps absent facts absent rather than defaulting them", () => {
    expect(validateEventClassification({ eventId: "job_loss", statedFacts: [] }, candidates)).toEqual({
      kind: "classified",
      classification: { eventId: "job_loss", statedFacts: [] }
    });
  });
});
