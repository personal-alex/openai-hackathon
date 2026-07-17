"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CatalogTask, CompiledRoadmap, EventPack, LocalProgress, TaskDiff, Timing } from "@/domain-contracts";
import { groupTasksByTimingLane } from "./timing-lanes";
import "./action-route.css";

type Props = { roadmap: CompiledRoadmap; sourceCards: EventPack["sourceCards"]; progress: LocalProgress; taskDiff?: TaskDiff; rationaleByKey: Record<string, string>; readOnly?: boolean; onCycleProgress(taskId: string): void };
const statusFor = (task: CatalogTask, progress: LocalProgress) => progress.progressStatusByTaskId[task.id] ?? "not started";
const changeFor = (taskId: string, diff?: TaskDiff) => diff?.changes.find((change) => change.taskId === taskId)?.kind;

function timingSummary(timing: Timing): string {
  if (timing.kind === "general") return "When ready";
  if (timing.kind === "event_relative") return timing.window === "immediate" ? "Do now" : timing.window === "within_days" ? "In the next few days" : "Later";
  if (timing.kind === "planned") return timing.window === "before" ? "Before the planned date" : timing.window === "around" ? "Around the planned date" : "After the planned date";
  return timing.window === "before" ? "Before this milestone" : timing.window === "around" ? "Around this milestone" : "After this milestone";
}

export function ActionRoute({ roadmap, sourceCards, progress, taskDiff, rationaleByKey, readOnly = false, onCycleProgress }: Props) {
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<CatalogTask>();
  const trigger = useRef<HTMLButtonElement>(null);
  const sources = useMemo(() => new Map(sourceCards.map((source) => [source.id, source])), [sourceCards]);
  const taskTitles = useMemo(() => new Map(roadmap.steps.map((task) => [task.id, task.title])), [roadmap.steps]);
  const grouped = useMemo(() => groupTasksByTimingLane(roadmap.steps), [roadmap.steps]);
  const tasks = grouped.flatMap((group) => group.tasks.map((task) => ({ task, lane: group.label })));
  const shown = showAll ? tasks : tasks.slice(0, 5);
  const changes = taskDiff?.changes ?? [];

  useEffect(() => {
    if (!selected) trigger.current?.focus();
  }, [selected]);

  const added = changes.filter((change) => change.kind === "added").length;
  const adjusted = changes.filter((change) => change.kind === "changed").length;
  const removed = changes.filter((change) => change.kind === "removed").length;
  return <section className="action-route" aria-labelledby="route-title">
    <div className="route-heading"><div><p className="section-kicker">Live deterministic plan</p><h2 id="route-title">Your route</h2></div>{changes.length > 0 && <p className="route-update" role="status"><strong>Your plan changed.</strong> {added} added · {adjusted} adjusted · {removed} removed</p>}</div>
    <p className="route-boundary">Your plan updates only from validated answers and reviewed catalog rules.</p>
    {shown.length ? <ol className="route-list">{shown.map(({ task, lane }) => {
      const change = changeFor(task.id, taskDiff);
      const status = readOnly ? "preview" : statusFor(task, progress);
      return <li key={task.id} className={`route-item${change ? ` route-item--${change}` : ""}`}>
        <span className="route-connector" aria-hidden="true" />
        <button type="button" className="route-item-button" onClick={(event) => { trigger.current = event.currentTarget; setSelected(task); }} aria-label={`Open details for ${task.title}`}>
          <span className="route-node" aria-hidden="true" />
          <span className="route-item-copy"><span className="route-item-title">{task.title}</span><span className="route-item-summary">{task.actionSummary}</span><span className="route-item-meta">{lane} · {change === "added" ? "New item" : change === "changed" ? "Updated item" : status === "complete" ? "Complete" : status === "reviewed" ? "Reviewed" : status === "preview" ? "After-birth preview" : "Current"}</span></span>
          <span className="route-open" aria-hidden="true">›</span>
        </button>
      </li>;
    })}</ol> : <p className="route-empty">Your route will take shape from what you choose to share.</p>}
    {tasks.length > 5 && <button className="text-button route-more" type="button" onClick={() => setShowAll((value) => !value)}>{showAll ? "Show fewer actions" : `Show ${tasks.length - 5} more actions`}</button>}
    {selected && <TaskDrawer task={selected} sourceCards={sources} taskTitles={taskTitles} rationale={rationaleByKey[selected.rationale]} timing={timingSummary(selected.timing)} status={statusFor(selected, progress)} readOnly={readOnly} onClose={() => setSelected(undefined)} onCycle={() => onCycleProgress(selected.id)} />}
  </section>;
}

function TaskDrawer({ task, sourceCards, taskTitles, rationale, timing, status, readOnly, onClose, onCycle }: { task: CatalogTask; sourceCards: Map<string, EventPack["sourceCards"][number]>; taskTitles: Map<string, string>; rationale?: string; timing: string; status: string; readOnly: boolean; onClose(): void; onCycle(): void }) {
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => { close.current?.focus(); const handler = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); }; window.addEventListener("keydown", handler); return () => window.removeEventListener("keydown", handler); }, [onClose]);
  const sources = task.sourceIds.map((id) => sourceCards.get(id)).filter(Boolean);
  const prerequisites = task.dependsOn.map((id) => taskTitles.get(id)).filter(Boolean);
  return <div className="task-drawer-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><aside className="task-drawer" role="dialog" aria-modal="true" aria-labelledby="task-drawer-title"><header><div><p className="section-kicker">Task details</p><h3 id="task-drawer-title">{task.title}</h3></div><button ref={close} className="drawer-close" type="button" onClick={onClose} aria-label="Close task details">×</button></header><section><h4>What to do</h4><p>{task.actionSummary}</p></section><section><h4>Why this appears</h4><p>{rationale ?? "A resolved catalog explanation is not available in the current roadmap data."}</p></section>{prerequisites.length > 0 && <section><h4>What may change it</h4><p>This action follows: {prerequisites.join(", ")}.</p></section>}<section><h4>Timing and verification</h4><p>{timing}</p><p>{task.verificationLabel}</p></section><section><h4>Sources</h4>{sources.length ? sources.map((source) => source && <article key={source.id}><strong>{source.title}</strong><p>{source.publisher} · reviewed {source.reviewedOn}</p><a href={source.canonicalUrl} target="_blank" rel="noreferrer">Open source (external)<span className="sr-only">: {source.title}</span></a></article>) : <p>No source metadata is supplied for this task.</p>}</section><p className="drawer-boundary">Planning support, not an eligibility determination.</p>{!readOnly && <button className="progress-button" type="button" onClick={onCycle}>Local status: {status} · {status === "not started" ? "mark reviewed" : status === "reviewed" ? "mark complete" : "clear status"}</button>}</aside></div>;
}
