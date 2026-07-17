import {
  type CatalogTask,
  type CompiledRoadmap,
  type Condition,
  type EventPack,
  type TaskDiff,
  type Timing,
  type UserContext,
  validateContextForPack
} from "@/domain-contracts";

export function matchesCondition(condition: Condition, facts: UserContext["facts"]): boolean {
  if ("all" in condition) return condition.all.every((entry) => matchesCondition(entry, facts));
  if ("any" in condition) return condition.any.some((entry) => matchesCondition(entry, facts));
  if ("not" in condition) return !matchesCondition(condition.not, facts);
  const value = facts[condition.fact];
  if ("exists" in condition) return condition.exists ? value !== undefined : value === undefined;
  if (value === undefined) return false;
  if ("equals" in condition) return value === condition.equals;
  return condition.in.includes(value);
}

function timingOrder(timing: Timing): number {
  return { event_relative: 0, planned: 1, milestone: 2, general: 3 }[timing.kind];
}

function knownTiming(timing: Timing, facts: UserContext["facts"]): Timing {
  if (timing.kind === "planned" && facts[timing.anchor] === undefined) return { kind: "general", labelKey: timing.labelKey };
  if (timing.kind === "event_relative" && facts[timing.anchor] === undefined) return { kind: "general", labelKey: timing.labelKey };
  if (timing.kind === "milestone" && facts[timing.milestone] === undefined) return { kind: "general", labelKey: timing.labelKey };
  return timing;
}

function isTaskApplicable(task: EventPack["tasks"][number], facts: UserContext["facts"]): boolean {
  if (!task.applicability || task.applicability.kind === "always") return true;
  return task.applicability.requiredFacts.every(({ factId, equals }) => facts[factId] === equals);
}

function taskToCatalog(task: EventPack["tasks"][number], facts: UserContext["facts"]): CatalogTask {
  const { rationaleKey, timing, ...taskFields } = task;
  return { ...taskFields, timing: knownTiming(timing, facts), rationale: rationaleKey };
}

function assertNoConflictingOverrides(pack: EventPack, facts: UserContext["facts"]): void {
  const fields = new Map<string, string>();
  for (const rule of pack.rules.filter((rule) => matchesCondition(rule.when, facts))) {
    for (const override of rule.effect.overrides ?? []) {
      for (const field of ["priority", "timing", "rationaleKey"] as const) {
        const value = override[field];
        if (value === undefined) continue;
        const key = `${rule.priority}:${override.taskId}:${field}`;
        const serialized = JSON.stringify(value);
        const existing = fields.get(key);
        if (existing !== undefined && existing !== serialized) throw new Error(`conflicting same-priority override: ${key}`);
        fields.set(key, serialized);
      }
    }
  }
}

/** Pure deterministic compilation; callers must supply an approved, validated pack. */
export function compileRoadmap(pack: EventPack, context: unknown): CompiledRoadmap {
  const contextValidation = validateContextForPack(pack, context);
  if (!contextValidation.success) throw new Error(`invalid context: ${contextValidation.errors.join("; ")}`);
  const facts = contextValidation.data.facts;
  assertNoConflictingOverrides(pack, facts);

  const tasks = new Map(pack.tasks.map((task) => [task.id, task]));
  const selected = new Set(pack.baseTaskIds);
  const matchingRules = pack.rules.filter((rule) => matchesCondition(rule.when, facts));

  for (const rule of matchingRules) for (const taskId of rule.effect.includeTaskIds ?? []) selected.add(taskId);
  for (const rule of matchingRules) for (const taskId of rule.effect.excludeTaskIds ?? []) selected.delete(taskId);

  const overridden = new Map(
    [...selected]
      .map((id) => tasks.get(id)!)
      .filter((task) => isTaskApplicable(task, facts))
      .map((task) => [task.id, { ...task }])
  );
  for (const rule of [...matchingRules].sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id))) {
    for (const override of rule.effect.overrides ?? []) {
      const task = overridden.get(override.taskId);
      if (!task) throw new Error(`override target is not selected: ${override.taskId}`);
      overridden.set(override.taskId, { ...task, ...override });
    }
  }

  const steps = [...overridden.values()]
    .map((task) => taskToCatalog(task, facts))
    .sort((a, b) => timingOrder(a.timing) - timingOrder(b.timing) || a.priority - b.priority || a.id.localeCompare(b.id));

  return {
    schemaVersion: 1,
    eventId: pack.id,
    jurisdiction: pack.jurisdiction,
    packVersion: pack.version,
    contextCompleteness: pack.facts.length === 0 ? 1 : Object.keys(facts).length / pack.facts.length,
    steps
  };
}

export function diffRoadmaps(previous: CompiledRoadmap | undefined, next: CompiledRoadmap): TaskDiff {
  const previousTasks = new Map(previous?.steps.map((task) => [task.id, task]) ?? []);
  const nextTasks = new Map(next.steps.map((task) => [task.id, task]));
  const changes: TaskDiff["changes"] = [];
  for (const [taskId, task] of nextTasks) {
    const prior = previousTasks.get(taskId);
    if (!prior) changes.push({ taskId, kind: "added", reason: { type: "rule_match", messageKey: "roadmap.task_added" } });
    else {
      const changedFields = ([
        ["timing", prior.timing, task.timing], ["priority", prior.priority, task.priority], ["rationale", prior.rationale, task.rationale], ["sources", prior.sourceIds, task.sourceIds]
      ] as const).filter(([, before, after]) => JSON.stringify(before) !== JSON.stringify(after)).map(([field]) => field);
      if (changedFields.length) changes.push({ taskId, kind: "changed", changedFields, reason: { type: "context_answer", messageKey: "roadmap.task_changed" } });
    }
  }
  for (const taskId of previousTasks.keys()) if (!nextTasks.has(taskId)) changes.push({ taskId, kind: "removed", reason: { type: "rule_no_longer_matches", messageKey: "roadmap.task_removed" } });
  return { fromRoadmapVersion: previous?.packVersion, toRoadmapVersion: next.packVersion, changes: changes.sort((a, b) => a.taskId.localeCompare(b.taskId)) };
}
