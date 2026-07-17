import type { CatalogTask, Timing } from "@/domain-contracts";

export type TimingLaneId = "immediate" | "preparation" | "ongoing" | "later" | "unscheduled";

export type TimingLane = {
  id: TimingLaneId;
  label: string;
  tasks: CatalogTask[];
};

type TimingLaneDefinition = {
  id: TimingLaneId;
  label: string;
  matches: (timing: Timing) => boolean;
};

/** Generic presentation configuration: it never inspects event, task, or jurisdiction IDs. */
const timingLaneDefinitions: readonly TimingLaneDefinition[] = [
  { id: "immediate", label: "Immediate", matches: (timing) => timing.kind === "event_relative" && timing.window === "immediate" || timing.kind === "milestone" && timing.window === "after" },
  { id: "preparation", label: "Preparation", matches: (timing) => timing.kind === "planned" && timing.window === "before" || timing.kind === "milestone" && timing.window === "before" || timing.kind === "event_relative" && timing.window === "within_days" },
  { id: "ongoing", label: "Ongoing", matches: (timing) => timing.kind === "general" },
  { id: "later", label: "Later", matches: (timing) => timing.kind === "planned" && (timing.window === "around" || timing.window === "after") || timing.kind === "milestone" && timing.window === "around" || timing.kind === "event_relative" && timing.window === "after_days" },
  { id: "unscheduled", label: "When ready", matches: () => true }
];

export function timingLaneFor(timing: Timing | undefined): Pick<TimingLaneDefinition, "id" | "label"> {
  if (!timing) return { id: "unscheduled", label: "When ready" };
  const lane = timingLaneDefinitions.find((definition) => definition.matches(timing));
  return lane ? { id: lane.id, label: lane.label } : { id: "unscheduled", label: "When ready" };
}

export function groupTasksByTimingLane(tasks: CatalogTask[]): TimingLane[] {
  const lanes = new Map<TimingLaneId, TimingLane>();
  for (const task of tasks) {
    const lane = timingLaneFor(task.timing);
    const group = lanes.get(lane.id);
    if (group) group.tasks.push(task);
    else lanes.set(lane.id, { ...lane, tasks: [task] });
  }
  return timingLaneDefinitions.flatMap((definition) => {
    const lane = lanes.get(definition.id);
    if (!lane) return [];
    return [{ ...lane, tasks: [...lane.tasks].sort((left, right) => left.priority - right.priority || left.id.localeCompare(right.id)) }];
  });
}
