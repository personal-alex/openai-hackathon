"use client";

import { useMemo, useState } from "react";
import type { CatalogTask, EventPack, LocalProgress, TaskDiff, UserContext } from "@/domain-contracts";
import { diffRoadmaps } from "@/roadmap-compiler";
import { compileRoadmapPresentation } from "@/roadmap-compiler/presentation";
import { findSeededScenario, seededScenarios, type SeededScenario, type SeededValue } from "@/test-fixtures/seeded-scenarios";
import { BrandMark } from "./brand";
import "./roadmap-disclosure.css";

type Screen = "entry" | "confirmation" | "guided";

const emptyProgress: LocalProgress = { progressStatusByTaskId: {} };

function inferScenarioId(statement: string): SeededScenario["id"] | undefined {
  const normalized = statement.toLowerCase();
  if (/\b(job|lost|laid off|layoff)\b/.test(normalized)) return "job_loss";
  if (/\b(expect|pregnan|child|baby)\b/.test(normalized)) return "expecting_child";
  return undefined;
}

function timingLabel(task: CatalogTask): string {
  if (task.timing.labelKey === "expecting_child.timing.immediately_after_birth") return "Immediately after birth";
  if (task.timing.labelKey === "expecting_child.timing.optional_after_notice") return "Optional — after notice receipt";
  if (task.timing.labelKey === "expecting_child.timing.update_when_ready") return "When you are ready";
  if (task.timing.labelKey === "expecting_child.timing.verify_when_ready") return "Verify when you are ready";
  const { timing } = task;
  if (timing.kind === "planned") return "Plan around the date you provided";
  if (timing.kind === "event_relative") return "Start from the date you provided";
  if (timing.kind === "milestone") return "Plan around a milestone";
  return "Consider when it is useful for you";
}

function changeLabel(taskId: string, diff: TaskDiff | undefined): "New" | "Adjusted" | "Current" {
  const change = diff?.changes.find((entry) => entry.taskId === taskId);
  if (change?.kind === "added") return "New";
  if (change?.kind === "changed") return "Adjusted";
  return "Current";
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("entry");
  const [statement, setStatement] = useState("");
  const [scenarioId, setScenarioId] = useState<SeededScenario["id"]>("expecting_child");
  const [context, setContext] = useState<UserContext>({ facts: {} });
  const [inputError, setInputError] = useState<string>();
  const [lastDiff, setLastDiff] = useState<TaskDiff>();
  const [progress, setProgress] = useState<LocalProgress>(emptyProgress);
  const [expandedTaskIds, setExpandedTaskIds] = useState<Set<string>>(new Set());
  const [notice, setNotice] = useState("Seeded demo mode is active. No live AI request is made.");

  const scenario = findSeededScenario(scenarioId) ?? seededScenarios[0];
  const roadmapPresentation = useMemo(() => compileRoadmapPresentation(scenario.pack, context), [scenario, context]);
  const roadmap = roadmapPresentation.roadmap;
  const visibleQuestions = scenario.questions.filter((question) => question.isApplicable?.(context.facts) ?? true);
  const activeQuestion = visibleQuestions.find((question) => !(question.factId in context.facts));
  const answeredQuestionCount = visibleQuestions.filter((question) => question.factId in context.facts).length;
  const changeCount = lastDiff?.changes.length ?? 0;

  function chooseScenario(nextScenario: SeededScenario) {
    setStatement(nextScenario.examplePrompt);
    setScenarioId(nextScenario.id);
    setInputError(undefined);
  }

  function continueFromEntry() {
    const detected = inferScenarioId(statement);
    if (!detected) {
      setInputError("This seeded demo currently supports “I’m expecting a child” and “I lost my job.” Choose one below to continue.");
      return;
    }
    setScenarioId(detected);
    setContext({ facts: {} });
    setProgress(emptyProgress);
    setLastDiff(undefined);
    setScreen("confirmation");
  }

  function beginGuidedFlow() {
    setScreen("guided");
    setNotice(`${scenario.catalogKind === "approved" ? "Your approved catalog roadmap" : "Your initial fixture roadmap"} is ready. Answering a question updates it deterministically.`);
  }

  function answerQuestion(value: SeededValue | undefined) {
    if (!activeQuestion) return;
    const nextFacts = { ...context.facts };
    if (value === undefined) delete nextFacts[activeQuestion.factId];
    else nextFacts[activeQuestion.factId] = value;

    const nextContext = { facts: nextFacts };
    const nextRoadmap = compileRoadmapPresentation(scenario.pack, nextContext).roadmap;
    const diff = diffRoadmaps(roadmap, nextRoadmap);
    const activeTaskIds = new Set(nextRoadmap.steps.map((task) => task.id));
    const removedCompleted = Object.entries(progress.progressStatusByTaskId).some(([taskId, status]) => status === "complete" && !activeTaskIds.has(taskId));

    setContext(nextContext);
    setLastDiff(diff);
    setProgress((previous) => ({ progressStatusByTaskId: Object.fromEntries(Object.entries(previous.progressStatusByTaskId).filter(([taskId]) => activeTaskIds.has(taskId))) }));
    setNotice(removedCompleted
      ? "Your roadmap changed. A completed local task is no longer in the current fixture plan; your previous progress remains valid."
      : diff.changes.length > 0
        ? `Your roadmap updated: ${diff.changes.filter((change) => change.kind === "added").length} new and ${diff.changes.filter((change) => change.kind === "changed").length} adjusted task${diff.changes.length === 1 ? "" : "s"}.`
        : "Your answer was recorded. The current roadmap did not need to change.");
  }

  function cycleProgress(taskId: string) {
    setProgress((previous) => {
      const current = previous.progressStatusByTaskId[taskId];
      const next = { ...previous.progressStatusByTaskId };
      if (!current) next[taskId] = "reviewed";
      else if (current === "reviewed") next[taskId] = "complete";
      else delete next[taskId];
      return { progressStatusByTaskId: next };
    });
  }

  function toggleTaskDetails(taskId: string) {
    setExpandedTaskIds((previous) => {
      const next = new Set(previous);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  }

  function changeBirthDetails() {
    if (scenario.id !== "expecting_child" || context.facts.event_stage !== "birth_occurred") return;
    const nextContext = { facts: { event_stage: "birth_occurred" } };
    const nextRoadmap = compileRoadmapPresentation(scenario.pack, nextContext).roadmap;
    setLastDiff(diffRoadmaps(roadmap, nextRoadmap));
    setContext(nextContext);
    setProgress(emptyProgress);
    setExpandedTaskIds(new Set());
    setNotice("Birth details are ready to update. The routine path was removed until you confirm the new routing facts.");
  }

  function confirmBirthFromPreview() {
    if (scenario.id !== "expecting_child" || roadmapPresentation.mode !== "preview") return;
    const nextContext = { facts: { ...context.facts, event_stage: "birth_occurred" } };
    const nextRoadmap = compileRoadmapPresentation(scenario.pack, nextContext).roadmap;
    setLastDiff(diffRoadmaps(roadmap, nextRoadmap));
    setContext(nextContext);
    setNotice("Your roadmap updated after you explicitly confirmed the birth. Please answer the next routing question.");
  }

  function resetDemo() {
    setScreen("entry");
    setStatement("");
    setScenarioId("expecting_child");
    setContext({ facts: {} });
    setLastDiff(undefined);
    setProgress(emptyProgress);
    setExpandedTaskIds(new Set());
    setInputError(undefined);
    setNotice("The local seeded demonstration was reset. No server data was stored.");
  }

  return (
    <main className={`app-shell app-shell--${screen}`}>
      <header className="app-header">
        <BrandMark />
        <div className="mode-badge" data-testid="seeded-ai-boundary"><span aria-hidden="true" />Seeded demo · deterministic</div>
      </header>

      <p className="sr-only" aria-live="polite">{notice}</p>

      {screen === "entry" && (
        <section className="entry-layout" aria-labelledby="entry-title">
          <div className="entry-copy">
            <p className="section-kicker">Planning companion · Israel · English</p>
            <h1 id="entry-title">Start with what changed.</h1>
            <p className="entry-lede">Tell us about a life event. We’ll ask only the questions that can shape your next steps.</p>
          </div>
          <div className="entry-stage">
            <form className="event-input-card" onSubmit={(event) => { event.preventDefault(); continueFromEntry(); }} noValidate>
              <label htmlFor="event-statement">What happened?</label>
              <p>Begin in your own words. The roadmap stays source-aware and explainable.</p>
              <div className="input-row">
                <input id="event-statement" name="event-statement" value={statement} onChange={(event) => { setStatement(event.target.value); setInputError(undefined); }} placeholder="For example: I lost my job" aria-describedby={inputError ? "event-error" : "event-helper"} />
                <button className="primary-button" type="submit">Continue <span aria-hidden="true">→</span></button>
              </div>
              <p className="input-helper" id="event-helper">Supported fixture scenarios</p>
              <div className="prompt-list" aria-label="Seeded scenario examples">
                {seededScenarios.map((item) => <button key={item.id} className="prompt-button" type="button" onClick={() => chooseScenario(item)}>{item.examplePrompt}</button>)}
              </div>
              {inputError && <p className="input-error" id="event-error" role="alert">{inputError}</p>}
              <div className="input-footer">Source-aware guidance <span>·</span> You stay in control <span>·</span> Verify before acting</div>
            </form>
            <div className="route-preview" aria-hidden="true">
              <span className="route-line route-line--first" /><span className="route-line route-line--second" />
              <div className="route-node route-node--today"><i />Today</div>
              <div className="route-node route-node--week"><i />Your plan</div>
              <div className="route-node route-node--next"><i />Next</div>
            </div>
          </div>
          <p className="safety-note">General planning support only. It does not determine eligibility or provide legal, medical, tax, or financial advice.</p>
        </section>
      )}

      {screen === "confirmation" && (
        <section className="confirmation-stage" aria-labelledby="confirmation-title">
          <div className="confirmation-card">
            <p className="section-kicker">Confirm the event</p>
            <h1 id="confirmation-title">We heard: {scenario.label}.</h1>
            <p>{scenario.confirmationCopy}</p>
            <p className="fixture-notice">{scenario.catalogKind === "approved" ? "This seeded demonstration uses the reviewed, validated catalog and no live model call." : "This is a test-only seeded scenario. It uses no live model call and no reviewed policy content."}</p>
            <div className="button-row"><button className="primary-button" type="button" onClick={beginGuidedFlow}>Continue to questions <span aria-hidden="true">→</span></button><button className="text-button" type="button" onClick={() => setScreen("entry")}>Choose a different event</button></div>
          </div>
        </section>
      )}

      {screen === "guided" && (
        <section className="workspace" aria-label="Guided planning workspace">
          <aside className="question-column" aria-labelledby="question-title">
            <p className="section-kicker">{scenario.catalogKind === "approved" ? "Reviewed catalog plan" : "Seeded fixture plan"} · {scenario.label}</p>
            <h1 id="question-title">Let’s map what comes next.</h1>
            {scenario.id === "expecting_child" && activeQuestion?.id === "ec_has_child_been_born" && <p className="supportive-lead">Congratulations. Tell us a little about where you are, and we’ll map what may come next.</p>}
            <div className="question-progress" aria-label={`${activeQuestion ? answeredQuestionCount + 1 : answeredQuestionCount} of ${visibleQuestions.length} questions`}>
              <span>{activeQuestion ? `Question ${answeredQuestionCount + 1} of ${visibleQuestions.length}` : "Questions complete"}</span>
              <div className="progress-track">{visibleQuestions.map((question) => <i key={question.id} className={question.factId in context.facts ? "is-complete" : ""} />)}</div>
            </div>
            {activeQuestion ? (
              <article className="question-card" key={activeQuestion.id}>
                <p className="statement-chip">“{statement || scenario.examplePrompt}”</p>
                <h2>{activeQuestion.prompt}</h2>
                <div className="answer-list">{activeQuestion.options.map((option) => <button key={option.label} type="button" className="answer-button" onClick={() => answerQuestion(option.value)}>{option.label}</button>)}</div>
                <details className="why-ask"><summary>Why we ask this</summary><p>{activeQuestion.why}</p></details>
              </article>
            ) : (
              <article className="question-card question-card--complete"><BrandMark compact /><h2>{roadmapPresentation.mode === "preview" ? "Your after-birth preview is ready." : "Your roadmap is ready."}</h2><p>{roadmapPresentation.mode === "preview" ? "When the birth occurs, confirm it here and this plan will adapt to the routing facts you choose to share." : "Change your answers to see how the deterministic compiler replaces affected tasks."}</p>{scenario.id === "expecting_child" && roadmapPresentation.mode === "preview" && <button className="primary-button" type="button" onClick={confirmBirthFromPreview}>The child has now been born <span aria-hidden="true">→</span></button>}{scenario.id === "expecting_child" && context.facts.event_stage === "birth_occurred" && <button className="text-button" type="button" onClick={changeBirthDetails}>Change birth details</button>}</article>
            )}
            <div className="answer-summary" aria-label="Current context"><span>Context</span><strong>{answeredQuestionCount} recorded · {visibleQuestions.length - answeredQuestionCount} unknown</strong></div>
          </aside>

          <section className="roadmap-column" aria-labelledby="roadmap-title">
            <div className="roadmap-topline"><div><p className="section-kicker">Live deterministic roadmap</p><h2 id="roadmap-title">Your next considerations</h2></div><div className={changeCount ? "update-notice is-active" : "update-notice"} role="status"><span aria-hidden="true">✓</span>{changeCount ? "Roadmap updated" : "Ready to update"}</div></div>
            {roadmapPresentation.mode === "preview" && scenario.preBirthPreview ? <div className="preview-notice" role="status"><strong>Preview · After birth</strong><p>{scenario.preBirthPreview.lead}</p><p>{scenario.preBirthPreview.detail}</p></div> : <p className="roadmap-disclaimer">{scenario.explanation}</p>}
            <ol className="task-list">{roadmap.steps.map((task, index) => {
              const sourceCards = task.sourceIds.map((sourceId) => scenario.pack.sourceCards.find((source) => source.id === sourceId)).filter((source): source is EventPack["sourceCards"][number] => Boolean(source));
              const status: "not started" | "reviewed" | "complete" = Object.hasOwn(progress.progressStatusByTaskId, task.id)
                ? progress.progressStatusByTaskId[task.id]!
                : "not started";
              const label = roadmapPresentation.mode === "preview" ? "Preview" : changeLabel(task.id, lastDiff);
              const expanded = expandedTaskIds.has(task.id);
              return <li className={`task-card task-card--${label.toLowerCase()}`} key={task.id}>
                <button type="button" className="task-card-toggle" aria-label={`Toggle details for ${task.title}`} aria-expanded={expanded} aria-controls={`task-details-${task.id}`} onClick={() => toggleTaskDetails(task.id)}><div className="task-card-main"><p className="task-number">{roadmapPresentation.mode === "preview" ? "After birth preview" : `Step ${index + 1}`}</p><h3>{task.title}</h3><p className="task-summary">{task.actionSummary}</p><dl className="task-meta"><div><dt>Timing</dt><dd>{roadmapPresentation.mode === "preview" ? "After birth · conditional" : timingLabel(task)}</dd></div><div><dt>Status</dt><dd className="local-status">{roadmapPresentation.mode === "preview" ? "preview only" : status}</dd></div><div><dt>Verification</dt><dd>{task.verificationLabel}</dd></div></dl></div><div className="task-aside"><span className="change-label"><b aria-hidden="true" />{label}</span><div className="source-pills">{sourceCards.map((source) => <span key={source.id}>{source.publisher}</span>)}</div><span className="disclosure-arrow" aria-hidden="true">⌄</span></div></button>
                <div id={`task-details-${task.id}`} className="task-details-panel" data-expanded={expanded}><div className="task-details-content"><p>{scenario.rationaleByKey?.[task.rationale] ?? "This task is selected by the validated catalog and deterministic compiler."}</p>{sourceCards.length > 0 ? sourceCards.map((source) => <section className="source-detail" key={source.id}><p><strong>Source:</strong> {source.title} · {source.publisher} · reviewed {source.reviewedOn} · {source.disposition}</p><p>{source.supportedClaimSummary}</p><p><strong>Scope:</strong> {source.scope}</p><p><strong>Limits:</strong> {source.limitations}</p><p><strong>Verification:</strong> {source.verificationWording}</p><p><strong>Safety:</strong> {source.safetyClassification.replaceAll("_", " ")}</p><a href={source.canonicalUrl} target="_blank" rel="noreferrer">Open official source <span className="sr-only">for {source.title}</span></a></section>) : <p className="source-detail">No source is claimed for this generic verification boundary.</p>}{roadmapPresentation.mode === "active" && <button type="button" className="progress-button" onClick={() => cycleProgress(task.id)}>Local status: {status} · {status === "not started" ? "mark reviewed" : status === "reviewed" ? "mark complete" : "clear status"}</button>}</div></div>
              </li>;
            })}</ol>
            <div className="workspace-footer"><p>General planning support only. Verify current information with an appropriate reviewed source before acting.</p><button type="button" className="text-button" onClick={resetDemo}>Reset local demo</button></div>
          </section>
        </section>
      )}
    </main>
  );
}
