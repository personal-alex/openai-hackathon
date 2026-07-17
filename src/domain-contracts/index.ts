import { z } from "zod";

export const eventIds = ["expecting_child", "job_loss", "move_home"] as const;
export const EventIdSchema = z.enum(eventIds);
export const JurisdictionCodeSchema = z.literal("IL");
export const StableIdSchema = z.string().regex(/^[a-z][a-z0-9_]*$/, "Use a stable snake_case ID.");
export const MessageKeySchema = z.string().regex(/^[a-z][a-z0-9_.-]*$/, "Use a stable message key.");

export const FactValueTypeSchema = z.enum(["string", "boolean", "number"]);
export const FactValueSchema = z.union([z.string().min(1), z.boolean(), z.number().finite()]);
export const FactDefinitionSchema = z.object({
  id: StableIdSchema,
  valueType: FactValueTypeSchema,
  labelKey: MessageKeySchema,
  sensitive: z.boolean().default(false),
  /** A transition gate may reference only facts explicitly authored for that purpose. */
  factRole: z.enum(["context", "confirmed_transition"]).optional()
}).strict();

export const UserContextSchema = z.object({
  facts: z.record(StableIdSchema, FactValueSchema)
}).strict();

export const TimingSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("planned"),
    anchor: z.literal("due_date"),
    window: z.enum(["before", "around", "after"]),
    offsetDays: z.number().int().nonnegative().optional(),
    labelKey: MessageKeySchema
  }).strict(),
  z.object({
    kind: z.literal("event_relative"),
    anchor: z.literal("event_date"),
    window: z.enum(["immediate", "within_days", "after_days"]),
    offsetDays: z.number().int().nonnegative().optional(),
    labelKey: MessageKeySchema
  }).strict(),
  z.object({
    kind: z.literal("milestone"),
    milestone: StableIdSchema,
    window: z.enum(["before", "around", "after"]),
    labelKey: MessageKeySchema
  }).strict(),
  z.object({ kind: z.literal("general"), labelKey: MessageKeySchema }).strict()
]);

export const QuestionDefinitionSchema = z.object({
  id: StableIdSchema,
  factId: StableIdSchema,
  promptKey: MessageKeySchema,
  rationaleKey: MessageKeySchema,
  answerType: FactValueTypeSchema,
  allowSkip: z.boolean()
}).strict();

export const SourceCardSchema = z.object({
  id: StableIdSchema,
  title: z.string().min(1),
  publisher: z.string().min(1),
  canonicalUrl: z.url(),
  jurisdiction: JurisdictionCodeSchema,
  reviewedOn: z.iso.date(),
  reviewer: z.string().min(1),
  disposition: z.enum(["approved", "rejected", "needs_review"]),
  scope: z.string().min(1),
  supportedClaimSummary: z.string().min(1),
  limitations: z.string().min(1),
  verificationWording: z.string().min(1),
  safetyClassification: z.enum(["verification_required", "informational"])
}).strict();

export const TaskApplicabilitySchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("always") }).strict(),
  z.object({
    kind: z.literal("confirmed_transition"),
    requiredFacts: z.array(z.object({ factId: StableIdSchema, equals: FactValueSchema }).strict()).min(1)
  }).strict()
]);

export const TaskDefinitionSchema = z.object({
  id: StableIdSchema,
  title: z.string().min(1),
  actionSummary: z.string().min(1),
  priority: z.number().int(),
  timing: TimingSchema,
  rationaleKey: MessageKeySchema,
  /** Empty only for generic verification boundaries that make no source claim. */
  sourceIds: z.array(StableIdSchema),
  verificationLabel: z.string().min(1),
  dependsOn: z.array(StableIdSchema),
  /** Presentation-only preview metadata; it never changes active task applicability. */
  preview: z.object({
    when: z.lazy(() => ConditionSchema),
    rationaleKey: MessageKeySchema
  }).strict().optional(),
  /** Omitted applicability means the task is always eligible for rule selection. */
  applicability: TaskApplicabilitySchema.optional()
}).strict();

export type Condition =
  | { all: Condition[] }
  | { any: Condition[] }
  | { not: Condition }
  | { fact: string; equals: string | boolean | number }
  | { fact: string; exists: boolean }
  | { fact: string; in: Array<string | boolean | number> };

export const ConditionSchema: z.ZodType<Condition> = z.lazy(() => z.union([
  z.object({ all: z.array(ConditionSchema) }).strict(),
  z.object({ any: z.array(ConditionSchema) }).strict(),
  z.object({ not: ConditionSchema }).strict(),
  z.object({ fact: StableIdSchema, equals: FactValueSchema }).strict(),
  z.object({ fact: StableIdSchema, exists: z.boolean() }).strict(),
  z.object({ fact: StableIdSchema, in: z.array(FactValueSchema).min(1) }).strict()
]));

export const RuleOverrideSchema = z.object({
  taskId: StableIdSchema,
  priority: z.number().int().optional(),
  timing: TimingSchema.optional(),
  rationaleKey: MessageKeySchema.optional()
}).strict();

export const RoadmapRuleSchema = z.object({
  id: StableIdSchema,
  priority: z.number().int(),
  when: ConditionSchema,
  effect: z.object({
    includeTaskIds: z.array(StableIdSchema).optional(),
    excludeTaskIds: z.array(StableIdSchema).optional(),
    overrides: z.array(RuleOverrideSchema).optional()
  }).strict()
}).strict();

export const SafetyPolicySchema = z.object({
  disclaimerKey: MessageKeySchema,
  externalLinkNoticeKey: MessageKeySchema,
  acknowledgementKeys: z.record(EventIdSchema, MessageKeySchema).optional()
}).strict();

export const DemoScenarioSchema = z.object({
  id: StableIdSchema,
  labelKey: MessageKeySchema,
  initialFacts: UserContextSchema
}).strict();

export const EventPackSchema = z.object({
  id: EventIdSchema,
  version: z.string().min(1),
  jurisdiction: JurisdictionCodeSchema,
  metadata: z.object({ title: z.string().min(1) }).strict(),
  facts: z.array(FactDefinitionSchema),
  questions: z.array(QuestionDefinitionSchema),
  sourceCards: z.array(SourceCardSchema),
  tasks: z.array(TaskDefinitionSchema),
  baseTaskIds: z.array(StableIdSchema).min(1),
  rules: z.array(RoadmapRuleSchema),
  safety: SafetyPolicySchema,
  demoScenarios: z.array(DemoScenarioSchema),
  /** Test-only packs are allowed for contract proof but never for approved runtime content. */
  testOnly: z.literal(true).optional()
}).strict();

export const ProgressStatusSchema = z.enum(["reviewed", "complete"]);
export const LocalProgressSchema = z.object({
  progressStatusByTaskId: z.record(StableIdSchema, ProgressStatusSchema)
}).strict();

export const CatalogTaskSchema = TaskDefinitionSchema.extend({ rationale: z.string().min(1) }).omit({ rationaleKey: true });
export const CompiledRoadmapSchema = z.object({
  schemaVersion: z.literal(1),
  eventId: EventIdSchema,
  jurisdiction: JurisdictionCodeSchema,
  packVersion: z.string().min(1),
  contextCompleteness: z.number().min(0).max(1),
  steps: z.array(CatalogTaskSchema),
  nextQuestion: QuestionDefinitionSchema.optional()
}).strict();

export const TaskChangeSchema = z.object({
  taskId: StableIdSchema,
  kind: z.enum(["added", "removed", "changed"]),
  changedFields: z.array(z.enum(["timing", "priority", "rationale", "sources"])).optional(),
  reason: z.object({
    type: z.enum(["context_answer", "rule_match", "rule_no_longer_matches"]),
    factId: StableIdSchema.optional(),
    ruleId: StableIdSchema.optional(),
    messageKey: MessageKeySchema
  }).strict()
}).strict();

export const TaskDiffSchema = z.object({
  fromRoadmapVersion: z.string().min(1).optional(),
  toRoadmapVersion: z.string().min(1),
  changes: z.array(TaskChangeSchema)
}).strict();

export const ValidatedStateSchema = z.object({
  eventId: EventIdSchema,
  jurisdiction: JurisdictionCodeSchema,
  context: UserContextSchema,
  packVersion: z.string().min(1)
}).strict();

export type EventId = z.infer<typeof EventIdSchema>;
export type EventPack = z.infer<typeof EventPackSchema>;
export type UserContext = z.infer<typeof UserContextSchema>;
export type CompiledRoadmap = z.infer<typeof CompiledRoadmapSchema>;
export type TaskDiff = z.infer<typeof TaskDiffSchema>;
export type LocalProgress = z.infer<typeof LocalProgressSchema>;
export type Timing = z.infer<typeof TimingSchema>;
export type CatalogTask = z.infer<typeof CatalogTaskSchema>;

export type ContractValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: string[] };

function duplicateIds(items: Array<{ id: string }>): string[] {
  const seen = new Set<string>();
  return items.flatMap(({ id }) => (seen.has(id) ? [id] : (seen.add(id), [])));
}

function conditionFactIds(condition: Condition): string[] {
  if ("all" in condition) return condition.all.flatMap(conditionFactIds);
  if ("any" in condition) return condition.any.flatMap(conditionFactIds);
  if ("not" in condition) return conditionFactIds(condition.not);
  return [condition.fact];
}

export function validateEventPack(input: unknown): ContractValidationResult<EventPack> {
  const parsed = EventPackSchema.safeParse(input);
  if (!parsed.success) return { success: false, errors: parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`) };

  const pack = parsed.data;
  const errors: string[] = [];
  for (const [name, items] of [["fact", pack.facts], ["question", pack.questions], ["source", pack.sourceCards], ["task", pack.tasks], ["rule", pack.rules], ["scenario", pack.demoScenarios]] as const) {
    for (const id of duplicateIds(items)) errors.push(`duplicate ${name} ID: ${id}`);
  }
  const factIds = new Set(pack.facts.map(({ id }) => id));
  const sourceIds = new Set(pack.sourceCards.map(({ id }) => id));
  const taskIds = new Set(pack.tasks.map(({ id }) => id));
  for (const taskId of pack.baseTaskIds) if (!taskIds.has(taskId)) errors.push(`unknown base task ID: ${taskId}`);
  for (const question of pack.questions) if (!factIds.has(question.factId)) errors.push(`unknown question fact ID: ${question.factId}`);
  for (const task of pack.tasks) {
    for (const sourceId of task.sourceIds) if (!sourceIds.has(sourceId)) errors.push(`unknown task source ID: ${sourceId}`);
    for (const dependencyId of task.dependsOn) if (!taskIds.has(dependencyId)) errors.push(`unknown task dependency ID: ${dependencyId}`);
    if (task.applicability?.kind === "confirmed_transition") {
      const seenRequiredFacts = new Set<string>();
      for (const requiredFact of task.applicability.requiredFacts) {
        const definition = pack.facts.find((fact) => fact.id === requiredFact.factId);
        if (!definition) {
          errors.push(`unknown task transition fact ID: ${requiredFact.factId}`);
          continue;
        }
        if (definition.factRole !== "confirmed_transition") errors.push(`task transition fact ID is not confirmed_transition: ${requiredFact.factId}`);
        if (typeof requiredFact.equals !== definition.valueType) errors.push(`invalid transition fact value for fact ID: ${requiredFact.factId}`);
        if (seenRequiredFacts.has(requiredFact.factId)) errors.push(`duplicate task transition fact ID: ${requiredFact.factId}`);
        seenRequiredFacts.add(requiredFact.factId);
      }
    }
    if (task.preview) for (const factId of conditionFactIds(task.preview.when)) if (!factIds.has(factId)) errors.push(`unknown task preview fact ID: ${factId}`);
  }
  for (const rule of pack.rules) {
    for (const factId of conditionFactIds(rule.when)) if (!factIds.has(factId)) errors.push(`unknown rule fact ID: ${factId}`);
    for (const taskId of [...(rule.effect.includeTaskIds ?? []), ...(rule.effect.excludeTaskIds ?? []), ...(rule.effect.overrides ?? []).map(({ taskId }) => taskId)]) {
      if (!taskIds.has(taskId)) errors.push(`unknown rule task ID: ${taskId}`);
    }
  }
  for (const scenario of pack.demoScenarios) {
    const contextValidation = validateContextForPack(pack, scenario.initialFacts);
    if (!contextValidation.success) errors.push(...contextValidation.errors);
  }
  return errors.length === 0 ? { success: true, data: pack } : { success: false, errors };
}

export function validateContextForPack(pack: EventPack, context: unknown): ContractValidationResult<UserContext> {
  const parsed = UserContextSchema.safeParse(context);
  if (!parsed.success) return { success: false, errors: parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`) };
  const definitions = new Map(pack.facts.map((fact) => [fact.id, fact]));
  const errors = Object.entries(parsed.data.facts).flatMap(([id, value]) => {
    const definition = definitions.get(id);
    if (!definition) return [`unknown fact ID: ${id}`];
    return typeof value === definition.valueType ? [] : [`invalid value for fact ID: ${id}`];
  });
  return errors.length === 0 ? { success: true, data: parsed.data } : { success: false, errors };
}
