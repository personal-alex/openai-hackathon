import { describe, expect, it } from "vitest";
import type { CatalogTask, Timing } from "@/domain-contracts";
import { groupTasksByTimingLane, timingLaneFor } from "@/app/timing-lanes";

function task(id: string, priority: number, timing: Timing): CatalogTask {
  return {
    id,
    title: id,
    actionSummary: "Generic presentation test task.",
    priority,
    timing,
    rationale: "test.rationale",
    sourceIds: [],
    verificationLabel: "Verify before acting",
    dependsOn: []
  };
}

describe("generic timing-lane presentation", () => {
  it("maps validated timing variants into stable generic lanes", () => {
    expect(timingLaneFor({ kind: "event_relative", anchor: "event_date", window: "immediate", labelKey: "timing.now" })).toMatchObject({ id: "immediate", label: "Immediate" });
    expect(timingLaneFor({ kind: "planned", anchor: "due_date", window: "before", labelKey: "timing.before" })).toMatchObject({ id: "preparation", label: "Preparation" });
    expect(timingLaneFor({ kind: "general", labelKey: "timing.general" })).toMatchObject({ id: "ongoing", label: "Ongoing" });
    expect(timingLaneFor({ kind: "event_relative", anchor: "event_date", window: "after_days", labelKey: "timing.later" })).toMatchObject({ id: "later", label: "Later" });
  });

  it("orders lanes consistently and preserves priority as the within-lane order", () => {
    const grouped = groupTasksByTimingLane([
      task("ongoing", 3, { kind: "general", labelKey: "timing.general" }),
      task("now_second", 2, { kind: "event_relative", anchor: "event_date", window: "immediate", labelKey: "timing.now" }),
      task("later", 1, { kind: "planned", anchor: "due_date", window: "after", labelKey: "timing.later" }),
      task("now_first", 1, { kind: "milestone", milestone: "event_stage", window: "after", labelKey: "timing.now" })
    ]);

    expect(grouped.map(({ id, label }) => ({ id, label }))).toEqual([
      { id: "immediate", label: "Immediate" },
      { id: "ongoing", label: "Ongoing" },
      { id: "later", label: "Later" }
    ]);
    expect(grouped[0]?.tasks.map(({ id }) => id)).toEqual(["now_first", "now_second"]);
  });

  it("uses the non-deadline fallback when a timing value is unavailable to presentation", () => {
    expect(timingLaneFor(undefined)).toEqual({ id: "unscheduled", label: "When ready" });
  });
});
