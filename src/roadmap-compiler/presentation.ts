import { type CatalogTask, type CompiledRoadmap, type EventPack, type UserContext, validateContextForPack } from "@/domain-contracts";
import { compileRoadmap, matchesCondition } from "./index";

export type RoadmapPresentation = {
  mode: "active" | "preview";
  roadmap: CompiledRoadmap;
};

/**
 * A preview projects existing catalog tasks without writing or simulating a
 * confirmed transition. Active compilation remains the sole authority for
 * post-birth tasks.
 */
export function compileRoadmapPresentation(pack: EventPack, context: unknown): RoadmapPresentation {
  const validation = validateContextForPack(pack, context);
  if (!validation.success) throw new Error(`invalid context: ${validation.errors.join("; ")}`);
  if (validation.data.facts.event_stage !== "not_yet_born") return { mode: "active", roadmap: compileRoadmap(pack, validation.data) };

  const steps: CatalogTask[] = pack.tasks
    .filter((task) => task.preview && matchesCondition(task.preview.when, validation.data.facts))
    .map((task) => {
      const { rationaleKey, preview, ...catalogFields } = task;
      return { ...catalogFields, timing: task.timing, rationale: preview!.rationaleKey };
    })
    .sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id));

  return {
    mode: "preview",
    roadmap: { schemaVersion: 1, eventId: pack.id, jurisdiction: pack.jurisdiction, packVersion: pack.version, contextCompleteness: Object.keys(validation.data.facts).length / pack.facts.length, steps }
  };
}
