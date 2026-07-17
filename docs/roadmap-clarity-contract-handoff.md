# Roadmap clarity contract handoff

Date: 2026-07-17
Owner: main repository thread

The shared roadmap UI renders only the existing validated compiler, task, source,
and local-progress data. The following generic presentation fields are not
available in the current shared contracts and must be resolved at the catalog /
compiler boundary before the UI can render them as authoritative content:

1. **Resolved task rationale text** for `CatalogTask.rationale`, rather than a
   message key alone.
2. **Resolved question rationale text** for `QuestionDefinition.rationaleKey`,
   rather than fixture-only presentation copy.
3. **Resolved `TaskChange.reason` text** for the compiler's approved
   `messageKey`, so a change summary can explain the change without UI prose.
4. **Removed-task display snapshot** (at least approved title and resolved
   change reason) so a removed task can be named after it is absent from the
   next roadmap.
5. **Task-level change conditions** (or an approved, resolved equivalent) for
   “What may change it.” `dependsOn` describes task ordering, not the rules or
   facts that may change selection.

Until those fields are approved and validated, the UI exposes the available
timing, source, verification, dependency, local-status, and count-based diff
data; it explicitly identifies unavailable explanations instead of generating
or inferring them. This handoff does not authorize any event-pack, source,
rule, or policy change.

## Timing-lane decision

No contract change is required for generic timing-lane presentation. The
validated `Timing.kind` and `Timing.window` discriminants provide enough
metadata to map tasks into a fixed, event-agnostic presentation configuration;
task `priority` orders tasks within a lane. The configuration does not infer a
task-specific category such as “Gather” from text or policy content. A future
pack-authored custom lane label would require a separately approved contract
field and is out of scope.
