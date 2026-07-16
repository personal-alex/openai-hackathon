"use client";

import { useMemo, useState } from "react";
import type { CatalogTask, LocalProgress, TaskDiff, UserContext } from "@/domain-contracts";
import { compileRoadmap, diffRoadmaps } from "@/roadmap-compiler";
import { findSeededScenario, seededScenarios, type SeededScenario, type SeededValue } from "@/test-fixtures/seeded-scenarios";
import { BrandMark } from "./brand";

type Screen = "entry" | "confirmation" | "acknowledgement" | "guided";

const emptyProgress: LocalProgress = { progressStatusByTaskId: {} };

function inferScenarioId(statement: string): SeededScenario["id"] | undefined {
  const normalized = statement.toLowerCase();
  if (/\b(job|lost|laid off|layoff)\b/.test(normalized)) return "job_loss";
  if (/\b(expect|pregnan|child|baby)\b/.test(normalized)) return "expecting_child";
  return undefined;
}

function timingLabel(task: CatalogTask): string {
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
  const [questionIndex, setQuestionIndex] = useState(0);
  const [inputError, setInputError] = useState<string>();
  const [lastDiff, setLastDiff] = useState<TaskDiff>();
  const [progress, setProgress] = useState<LocalProgress>(emptyProgress);
  const [notice, setNotice] = useState("Seeded demo mode is active. No live AI request is made.");

  const scenario = findSeededScenario(scenarioId) ?? seededScenarios[0];
  const roadmap = useMemo(() => compileRoadmap(scenario.pack, context), [scenario, context]);
  const activeQuestion = scenario.questions[questionIndex];
  const answeredQuestionCount = scenario.questions.filter((question) => question.factId in context.facts).length;
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
    setQuestionIndex(0);
    setLastDiff(undefined);
    setScreen("confirmation");
  }

  function beginGuidedFlow() {
    if (scenario.id === "expecting_child") setScreen("acknowledgement");
    else setScreen("guided");
    setNotice("Your initial fixture roadmap is ready. Answering a question updates it deterministically.");
  }

  function answerQuestion(value: SeededValue | undefined) {
    if (!activeQuestion) return;
    const nextFacts = { ...context.facts };
    if (value === undefined) delete nextFacts[activeQuestion.factId];
    else nextFacts[activeQuestion.factId] = value;

    const nextContext = { facts: nextFacts };
    const nextRoadmap = compileRoadmap(scenario.pack, nextContext);
    const diff = diffRoadmaps(roadmap, nextRoadmap);
    const activeTaskIds = new Set(nextRoadmap.steps.map((task) => task.id));
    const removedCompleted = Object.entries(progress.progressStatusByTaskId).some(([taskId, status]) => status === "complete" && !activeTaskIds.has(taskId));

    setContext(nextContext);
    setLastDiff(diff);
    setQuestionIndex((index) => Math.min(index + 1, scenario.questions.length));
    setProgress((previous) => ({ progressStatusByTaskId: Object.fromEntries(Object.entries(previous.progressStatusByTaskId).filter(([taskId]) => activeTaskIds.has(taskId))) }));
    setNotice(removedCompleted
      ? "Your roadmap changed. A completed local task is no longer in the current fixture plan; your previous progress remains valid."
      : diff.changes.length > 0
        ? `Your roadmap updated: ${diff.changes.filter((change) => change.kind === "added").length} new and ${diff.changes.filter((change) => change.kind === "changed").length} adjusted task${diff.changes.length === 1 ? "" : "s"}.`
        : "Your answer was recorded. The current fixture roadmap did not need to change.");
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

  function resetDemo() {
    setScreen("entry");
    setStatement("");
    setScenarioId("expecting_child");
    setContext({ facts: {} });
    setQuestionIndex(0);
    setLastDiff(undefined);
    setProgress(emptyProgress);
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
            <p className="fixture-notice">This is a test-only seeded scenario. It uses no live model call and no reviewed policy content.</p>
            <div className="button-row"><button className="primary-button" type="button" onClick={beginGuidedFlow}>Continue to questions <span aria-hidden="true">→</span></button><button className="text-button" type="button" onClick={() => setScreen("entry")}>Choose a different event</button></div>
          </div>
        </section>
      )}

      {screen === "acknowledgement" && (
        <section className="confirmation-stage" aria-labelledby="acknowledgement-title">
          <div className="confirmation-card acknowledgement-card">
            <BrandMark compact label="Life Navigator" />
            <h1 id="acknowledgement-title">Congratulations—let’s build a plan for what may be ahead.</h1>
            <p>This optional acknowledgement is approved pack/safety-policy copy, not model-generated prose.</p>
            <div className="button-row"><button className="primary-button" type="button" onClick={() => setScreen("guided")}>Continue <span aria-hidden="true">→</span></button><button className="text-button" type="button" onClick={() => setScreen("guided")}>Skip to “Let’s build a plan for what may be ahead.”</button></div>
          </div>
        </section>
      )}

      {screen === "guided" && (
        <section className="workspace" aria-label="Guided planning workspace">
          <aside className="question-column" aria-labelledby="question-title">
            <p className="section-kicker">Seeded plan · {scenario.label}</p>
            <h1 id="question-title">Let’s map what comes next.</h1>
            <div className="question-progress" aria-label={`${Math.min(questionIndex + 1, scenario.questions.length)} of ${scenario.questions.length} fixture questions`}>
              <span>{questionIndex < scenario.questions.length ? `Question ${questionIndex + 1} of ${scenario.questions.length}` : "Fixture questions complete"}</span>
              <div className="progress-track">{scenario.questions.map((question, index) => <i key={question.id} className={index <= questionIndex ? "is-complete" : ""} />)}</div>
            </div>
            {activeQuestion ? (
              <article className="question-card" key={activeQuestion.id}>
                <p className="statement-chip">“{statement || scenario.examplePrompt}”</p>
                <h2>{activeQuestion.prompt}</h2>
                <div className="answer-list">{activeQuestion.options.map((option) => <button key={option.label} type="button" className="answer-button" onClick={() => answerQuestion(option.value)}>{option.label}</button>)}</div>
                <details className="why-ask"><summary>Why we ask this</summary><p>{activeQuestion.why}</p></details>
              </article>
            ) : (
              <article className="question-card question-card--complete"><BrandMark compact /><h2>Your fixture roadmap is ready.</h2><p>Review any answer to see how the deterministic compiler adjusts the roadmap.</p><button className="text-button" type="button" onClick={() => setQuestionIndex(0)}>Review answers</button></article>
            )}
            <div className="answer-summary" aria-label="Current fixture context"><span>Context</span><strong>{answeredQuestionCount} recorded · {scenario.questions.length - answeredQuestionCount} unknown</strong></div>
          </aside>

          <section className="roadmap-column" aria-labelledby="roadmap-title">
            <div className="roadmap-topline"><div><p className="section-kicker">Live fixture roadmap</p><h2 id="roadmap-title">Your next considerations</h2></div><div className={changeCount ? "update-notice is-active" : "update-notice"} role="status"><span aria-hidden="true">✓</span>{changeCount ? "Roadmap updated" : "Ready to update"}</div></div>
            <p className="roadmap-disclaimer">{scenario.explanation}</p>
            <ol className="task-list">{roadmap.steps.map((task, index) => {
              const sourceCards = task.sourceIds.map((sourceId) => scenario.pack.sourceCards.find((source) => source.id === sourceId)).filter(Boolean);
              const status: "not started" | "reviewed" | "complete" = Object.hasOwn(progress.progressStatusByTaskId, task.id)
                ? progress.progressStatusByTaskId[task.id]!
                : "not started";
              const label = changeLabel(task.id, lastDiff);
              return <li className={`task-card task-card--${label.toLowerCase()}`} key={task.id}>
                <div className="task-card-main"><p className="task-number">Step {index + 1}</p><h3>{task.title}</h3><p className="task-summary">{task.actionSummary}</p><dl className="task-meta"><div><dt>Timing</dt><dd>{timingLabel(task)}</dd></div><div><dt>Status</dt><dd className="local-status">{status}</dd></div><div><dt>Verification</dt><dd>{task.verificationLabel}</dd></div></dl></div>
                <div className="task-aside"><span className="change-label"><b aria-hidden="true" />{label}</span><div className="source-pills">{sourceCards.map((source) => source && <span key={source.id}>{source.publisher}</span>)}</div></div>
                <details className="task-details"><summary>Why this appears <span aria-hidden="true">⌄</span></summary><div><p>{task.rationale}</p><p className="source-detail">Source provenance: {sourceCards.map((source) => source && `${source.publisher} · reviewed ${source.reviewedOn} · ${source.scope}`).join(" ")}</p><p className="source-detail">{sourceCards.map((source) => source?.supportedClaimSummary).join(" ")}</p><button type="button" className="progress-button" onClick={() => cycleProgress(task.id)}>Local status: {status} · {status === "not started" ? "mark reviewed" : status === "reviewed" ? "mark complete" : "clear status"}</button></div></details>
              </li>;
            })}</ol>
            <div className="workspace-footer"><p>General planning support only. Verify current information with an appropriate reviewed source before acting.</p><button type="button" className="text-button" onClick={resetDemo}>Reset local demo</button></div>
          </section>
        </section>
      )}
    </main>
  );
}
