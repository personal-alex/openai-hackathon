"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CatalogTask, CompiledRoadmap, EventPack, LocalProgress, TaskDiff, Timing } from "@/domain-contracts";
import { groupTasksByTimingLane } from "./timing-lanes";
import "./action-route.css";

type Props = { roadmap: CompiledRoadmap; sourceCards: EventPack["sourceCards"]; progress: LocalProgress; taskDiff?: TaskDiff; rationaleByKey: Record<string, string>; readOnly?: boolean; onCycleProgress(taskId: string): void };
type RouteTask = { task: CatalogTask; lane: string };
const statusFor = (task: CatalogTask, progress: LocalProgress) => progress.progressStatusByTaskId[task.id] ?? "not started";
const changeFor = (taskId: string, diff?: TaskDiff) => diff?.changes.find((change) => change.taskId === taskId)?.kind;

function timingSummary(timing: Timing): string {
  if (timing.kind === "general") return "When ready";
  if (timing.kind === "event_relative") return timing.window === "immediate" ? "Do now" : timing.window === "within_days" ? "In the next few days" : "Later";
  if (timing.kind === "planned") return timing.window === "before" ? "Before the planned date" : timing.window === "around" ? "Around the planned date" : "After the planned date";
  return timing.window === "before" ? "Before this milestone" : timing.window === "around" ? "Around this milestone" : "After this milestone";
}

export function ActionRoute({ roadmap, sourceCards, progress, taskDiff, rationaleByKey, readOnly = false, onCycleProgress }: Props) {
  const [expandedRoadmapSignature, setExpandedRoadmapSignature] = useState<string>();
  const [selected, setSelected] = useState<CatalogTask>();
  const trigger = useRef<HTMLButtonElement>(null);
  const sources = useMemo(() => new Map(sourceCards.map((source) => [source.id, source])), [sourceCards]);
  const taskTitles = useMemo(() => new Map(roadmap.steps.map((task) => [task.id, task.title])), [roadmap.steps]);
  const grouped = useMemo(() => groupTasksByTimingLane(roadmap.steps), [roadmap.steps]);
  const tasks = grouped.flatMap((group) => group.tasks.map((task) => ({ task, lane: group.label } satisfies RouteTask)));
  const roadmapSignature = tasks.map(({ task, lane }) => `${task.id}:${task.priority}:${lane}:${task.actionSummary}`).join("|");
  const showAll = expandedRoadmapSignature === roadmapSignature;
  const changes = taskDiff?.changes ?? [];
  const startHere = tasks[0];
  const remainingTasks = tasks.slice(1);
  const shownRemaining = showAll ? remainingTasks : remainingTasks.slice(0, 3);
  const shownRemainingIds = new Set(shownRemaining.map(({ task }) => task.id));
  const remainingGroups = grouped.map((group) => ({ ...group, tasks: group.tasks.filter((task) => shownRemainingIds.has(task.id)) })).filter((group) => group.tasks.length > 0);
  const hiddenTaskCount = remainingTasks.length - shownRemaining.length;

  useEffect(() => {
    if (!selected) trigger.current?.focus();
  }, [selected]);

  const added = changes.filter((change) => change.kind === "added").length;
  const adjusted = changes.filter((change) => change.kind === "changed").length;
  const removed = changes.filter((change) => change.kind === "removed").length;
  return <section className="action-route" aria-labelledby="route-title">
    <div className="route-heading"><div><p className="route-kicker">Route overview</p><h2 id="route-title">Your route</h2></div>{changes.length > 0 ? <p className="route-update" role="status"><strong>Your plan changed.</strong> {added} added · {adjusted} adjusted · {removed} removed</p> : <p className="route-status">Built from what you’ve shared</p>}</div>
    <p className="route-boundary">Start with what needs your attention now, then explore the rest in any order. Your route updates only from validated answers and reviewed catalog rules.</p>
    {startHere ? <>
      <section className="route-start" aria-labelledby="route-start-title">
        <div className="route-section-heading"><h3 id="route-start-title">Start here</h3><span>{startHere.lane}</span></div>
        <ol className="route-list route-list--start"><RouteItem item={startHere} primary taskDiff={taskDiff} progress={progress} readOnly={readOnly} onSelect={(task, element) => { trigger.current = element; setSelected(task); }} /></ol>
      </section>
      {remainingGroups.length > 0 && <section className="route-follow-ons" aria-labelledby="route-follow-ons-title"><h3 id="route-follow-ons-title">Then keep moving</h3>{remainingGroups.map((group) => <section className={`route-lane route-lane--${group.id}`} key={group.id} aria-labelledby={`route-lane-${group.id}`}><div className="route-section-heading"><h4 id={`route-lane-${group.id}`}>{group.label}</h4><span>{group.tasks.length} action{group.tasks.length === 1 ? "" : "s"}</span></div><ol className="route-list">{group.tasks.map((task) => <RouteItem key={task.id} item={{ task, lane: group.label }} taskDiff={taskDiff} progress={progress} readOnly={readOnly} onSelect={(nextTask, element) => { trigger.current = element; setSelected(nextTask); }} />)}</ol></section>)}</section>}
    </> : <p className="route-empty">Your route will take shape from what you choose to share.</p>}
    {remainingTasks.length > 3 && <button className="text-button route-more" type="button" onClick={() => setExpandedRoadmapSignature((current) => current === roadmapSignature ? undefined : roadmapSignature)}>{showAll ? "Show fewer actions" : `Show ${hiddenTaskCount} more action${hiddenTaskCount === 1 ? "" : "s"}`}</button>}
    {selected && <TaskDrawer task={selected} sourceCards={sources} taskTitles={taskTitles} rationale={rationaleByKey[selected.rationale]} timing={timingSummary(selected.timing)} status={statusFor(selected, progress)} readOnly={readOnly} onClose={() => setSelected(undefined)} onCycle={() => onCycleProgress(selected.id)} />}
  </section>;
}

function RouteItem({ item, primary = false, taskDiff, progress, readOnly, onSelect }: { item: RouteTask; primary?: boolean; taskDiff?: TaskDiff; progress: LocalProgress; readOnly: boolean; onSelect(task: CatalogTask, element: HTMLButtonElement): void }) {
  const { task, lane } = item;
  const change = changeFor(task.id, taskDiff);
  const status = readOnly ? "preview" : statusFor(task, progress);
  const statusLabel = change === "added" ? "New item" : change === "changed" ? "Updated item" : status === "complete" ? "Complete" : status === "reviewed" ? "Reviewed" : status === "preview" ? "After-birth preview" : "Current";
  const sourceLabel = task.sourceIds.length ? "Source available" : "No source card";
  const verificationLabel = task.verificationLabel ? "Verification details" : undefined;
  return <li className={`route-item${primary ? " route-item--primary" : ""}${change ? ` route-item--${change}` : ""}`}>
    <span className="route-connector" aria-hidden="true" />
    <button type="button" className="route-item-button" onClick={(event) => onSelect(task, event.currentTarget)} aria-label={`Open details for ${task.title}`}>
      <span className="route-node" aria-hidden="true" />
      <span className="route-item-copy"><span className="route-item-title">{task.title}</span><span className="route-item-summary">{task.actionSummary}</span><span className="route-item-meta"><span>{lane} · {statusLabel}</span><span>{sourceLabel}</span>{verificationLabel && <span>{verificationLabel}</span>}</span></span>
      <span className="route-open" aria-hidden="true">›</span>
    </button>
  </li>;
}

function TaskDrawer({ task, sourceCards, taskTitles, rationale, timing, status, readOnly, onClose, onCycle }: { task: CatalogTask; sourceCards: Map<string, EventPack["sourceCards"][number]>; taskTitles: Map<string, string>; rationale?: string; timing: string; status: string; readOnly: boolean; onClose(): void; onCycle(): void }) {
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => { close.current?.focus(); const handler = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); }; window.addEventListener("keydown", handler); return () => window.removeEventListener("keydown", handler); }, [onClose]);
  const sources = task.sourceIds.map((id) => sourceCards.get(id)).filter(Boolean);
  const prerequisites = task.dependsOn.map((id) => taskTitles.get(id)).filter(Boolean);
  return <div className="task-drawer-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><aside className="task-drawer" role="dialog" aria-modal="true" aria-labelledby="task-drawer-title"><header><div><p className="section-kicker">Task details</p><h3 id="task-drawer-title">{task.title}</h3></div><button ref={close} className="drawer-close" type="button" onClick={onClose} aria-label="Close task details">×</button></header><section><h4>What to do</h4><p>{task.actionSummary}</p></section><section><h4>Why this appears</h4><p>{rationale ?? "A resolved catalog explanation is not available in the current roadmap data."}</p></section>{prerequisites.length > 0 && <section><h4>What may change it</h4><p>This action follows: {prerequisites.join(", ")}.</p></section>}<section><h4>Timing and verification</h4><p>{timing}</p><p>{task.verificationLabel}</p></section><section><h4>Sources</h4>{sources.length ? sources.map((source) => source && <article key={source.id}><strong>{source.title}</strong><p>{source.publisher} · reviewed {source.reviewedOn}</p><a href={source.canonicalUrl} target="_blank" rel="noreferrer">Open source (external)<span className="sr-only">: {source.title}</span></a></article>) : <p>No source metadata is supplied for this task.</p>}</section><p className="drawer-boundary">Planning support, not an eligibility determination.</p>{!readOnly && <button className="progress-button" type="button" onClick={onCycle}>Local status: {status} · {status === "not started" ? "mark reviewed" : status === "reviewed" ? "mark complete" : "clear status"}</button>}</aside></div>;
}
