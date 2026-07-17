"use client";

import { useMemo, useState } from "react";
import type { CompiledRoadmap, EventPack, LocalProgress, TaskDiff } from "@/domain-contracts";
import { groupTasksByTimingLane } from "./timing-lanes";

type LocalStatus = "not started" | "reviewed" | "complete";

type RoadmapPanelProps = {
  roadmap: CompiledRoadmap;
  sourceCards: EventPack["sourceCards"];
  progress: LocalProgress;
  taskDiff?: TaskDiff;
  readOnly?: boolean;
  onCycleProgress: (taskId: string) => void;
};

function localStatus(taskId: string, progress: LocalProgress): LocalStatus {
  return progress.progressStatusByTaskId[taskId] ?? "not started";
}

function statusAction(status: LocalStatus): string {
  if (status === "not started") return "mark reviewed";
  if (status === "reviewed") return "mark complete";
  return "clear status";
}

function changeLabel(taskId: string, diff: TaskDiff | undefined): "New" | "Adjusted" | "Current" {
  const change = diff?.changes.find((entry) => entry.taskId === taskId);
  if (change?.kind === "added") return "New";
  if (change?.kind === "changed") return "Adjusted";
  return "Current";
}

function changeSummary(diff: TaskDiff | undefined): string | undefined {
  if (!diff?.changes.length) return undefined;
  const counts = { added: 0, changed: 0, removed: 0 };
  for (const change of diff.changes) counts[change.kind] += 1;
  return (["added", "changed", "removed"] as const).filter((kind) => counts[kind] > 0).map((kind) => `${counts[kind]} ${kind}`).join(" · ");
}

/** Shared UI projection for compiler output plus the separate local progress overlay. */
export function RoadmapPanel({ roadmap, sourceCards, progress, taskDiff, readOnly = false, onCycleProgress }: RoadmapPanelProps) {
  const [expandedTaskIds, setExpandedTaskIds] = useState<Set<string>>(new Set());
  const groups = useMemo(() => groupTasksByTimingLane(roadmap.steps), [roadmap.steps]);
  const sourcesById = useMemo(() => new Map(sourceCards.map((source) => [source.id, source])), [sourceCards]);
  const taskTitlesById = useMemo(() => new Map(roadmap.steps.map((task) => [task.id, task.title])), [roadmap.steps]);
  const summary = changeSummary(taskDiff);

  function toggleTask(taskId: string) {
    setExpandedTaskIds((previous) => {
      const next = new Set(previous);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  }

  if (groups.length === 0) return <div className="roadmap-empty" role="status"><h3>No tasks are in this plan yet.</h3><p>Answering a decision-changing question can update the validated roadmap.</p></div>;

  return <div className="roadmap-panel">
    {summary ? <div className="roadmap-change-summary" aria-live="polite"><strong>Your plan changed</strong><span>{summary}</span></div> : <p className="roadmap-steady-state">Your plan is ready. It updates only from validated answers and catalog rules.</p>}
    {groups.map((group) => <section className="timing-group" key={group.id} aria-labelledby={`timing-group-${group.id}`}>
      <h3 id={`timing-group-${group.id}`}>{group.label}<span>{group.tasks.length} task{group.tasks.length === 1 ? "" : "s"}</span></h3>
      <ol className="task-list task-list--grouped">{group.tasks.map((task) => {
        const status = localStatus(task.id, progress);
        const label = changeLabel(task.id, taskDiff);
        const sources = task.sourceIds.map((sourceId) => sourcesById.get(sourceId)).filter((source): source is EventPack["sourceCards"][number] => Boolean(source));
        const dependencies = task.dependsOn.map((taskId) => taskTitlesById.get(taskId)).filter((title): title is string => Boolean(title));
        const expanded = expandedTaskIds.has(task.id);
        return <li className={`task-card task-card--${label.toLowerCase()}`} key={task.id}>
          <button type="button" className="task-card-toggle" aria-label={`Toggle details for ${task.title}`} aria-expanded={expanded} aria-controls={`task-details-${task.id}`} onClick={() => toggleTask(task.id)}>
            <div className="task-card-main"><h4>{task.title}</h4><p className="task-summary">{task.actionSummary}</p><dl className="task-meta"><div><dt>Timing lane</dt><dd>{group.label}</dd></div><div><dt>Local status</dt><dd className="local-status">{readOnly ? "Preview only" : status}</dd></div><div><dt>Verification</dt><dd>{task.verificationLabel}</dd></div></dl></div>
            <div className="task-aside"><span className="change-label"><b aria-hidden="true" />{label}</span><span className="task-inspect-label">View details</span><span className="disclosure-arrow" aria-hidden="true">⌄</span></div>
          </button>
          <div id={`task-details-${task.id}`} className="task-details-panel" data-expanded={expanded}><div className="task-details-content">
            <section><h5>What to do</h5><p>{task.actionSummary}</p></section>
            <section><h5>Why this is on the plan</h5><p className="detail-unavailable">A resolved catalog explanation is not available in the current roadmap data.</p></section>
            <section><h5>What may change it</h5><p className="detail-unavailable">This catalog does not provide task-specific change conditions. Future validated answers can change the compiled plan.</p></section>
            {dependencies.length > 0 && <section><h5>Planning dependencies</h5><p>{dependencies.join(" · ")}</p></section>}
            <section><h5>Verification</h5><p>{task.verificationLabel}</p></section>
            <section><h5>Sources</h5>{sources.length > 0 ? sources.map((source) => <article className="source-detail" key={source.id}><p><strong>{source.title}</strong></p><p>{source.publisher} · reviewed {source.reviewedOn}</p><p>{source.supportedClaimSummary}</p><p><strong>Scope:</strong> {source.scope}</p><p><strong>Limits:</strong> {source.limitations}</p><p><strong>Verify:</strong> {source.verificationWording}</p><a href={source.canonicalUrl} target="_blank" rel="noreferrer">Open source (external)<span className="sr-only">: {source.title}</span></a></article>) : <p>No source metadata is supplied for this task.</p>}</section>
            <p className="detail-boundary">Educational planning support only. This roadmap is not an official determination.</p>
            {!readOnly && <button type="button" className="progress-button" onClick={() => onCycleProgress(task.id)}>Local status: {status} · {statusAction(status)}</button>}
          </div></div>
        </li>;
      })}</ol>
    </section>)}
  </div>;
}
