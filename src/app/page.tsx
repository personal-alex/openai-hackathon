"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LocalProgressSchema, UserContextSchema, type FactValue, type LocalProgress, type QuestionDefinition, type TaskDiff, type UserContext } from "@/domain-contracts";
import { classificationCandidateFromPack, EventClassificationSchema, sanitizeStatedFacts } from "@/lib/ai/contracts";
import { diffRoadmaps } from "@/roadmap-compiler";
import { compileRoadmapPresentation } from "@/roadmap-compiler/presentation";
import { findSeededScenario, seededScenarios, type SeededScenario, type SeededValue } from "@/test-fixtures/seeded-scenarios";
import { ActionRoute } from "./action-route";
import { BrandMark } from "./brand";
import { LandingIntro } from "./landing-intro";
import "./landing-intro.css";
import { QuestionInput } from "./question-input";
import "./action-route.css";
import "./action-workspace.css";

type WorkspaceState = "entry" | "understood" | "planning";
type StoredPlan = { version: 1; scenarioId: SeededScenario["id"]; statement: string; context: UserContext; progress: LocalProgress; state: WorkspaceState };
type TranscriptAnswer = { questionId: string; value: string };
const storageKey = "life-navigator.seeded-plan.v1";
const classifierSessionKey = "life-navigator.classifier-session.v1";
const emptyProgress: LocalProgress = { progressStatusByTaskId: {} };

function classifierSessionId(): string {
  const current = localStorage.getItem(classifierSessionKey);
  if (current && /^[A-Za-z0-9_-]{24,128}$/.test(current)) return current;
  const next = crypto.randomUUID().replaceAll("-", "");
  localStorage.setItem(classifierSessionKey, next);
  return next;
}

export default function Home() {
  const input = useRef<HTMLInputElement>(null);
  const conversationThread = useRef<HTMLDivElement>(null);
  const currentTurn = useRef<HTMLElement>(null);
  const [hydrated, setHydrated] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [introExiting, setIntroExiting] = useState(false);
  const [isSeededDemo, setIsSeededDemo] = useState(false);
  const [state, setState] = useState<WorkspaceState>("entry");
  const [statement, setStatement] = useState("");
  const [scenarioId, setScenarioId] = useState<SeededScenario["id"]>("expecting_child");
  const [context, setContext] = useState<UserContext>({ facts: {} });
  const [progress, setProgress] = useState<LocalProgress>(emptyProgress);
  const [lastDiff, setLastDiff] = useState<TaskDiff>();
  const [error, setError] = useState<string>();
  const [classificationPending, setClassificationPending] = useState(false);
  const [classifiedContext, setClassifiedContext] = useState<UserContext>({ facts: {} });
  const [editingStatedFact, setEditingStatedFact] = useState<string>();
  const [transcriptAnswers, setTranscriptAnswers] = useState<TranscriptAnswer[]>([]);
  const [resetPending, setResetPending] = useState(false);
  const scenario = findSeededScenario(scenarioId) ?? seededScenarios[0];
  const presentation = useMemo(() => compileRoadmapPresentation(scenario.pack, context), [scenario, context]);
  const questions = scenario.questions.filter((question) => question.isApplicable?.(context.facts) ?? true);
  const activeQuestion = questions.find((question) => !(question.factId in context.facts));

  /* eslint-disable react-hooks/set-state-in-effect -- local storage is an external state source restored once after hydration. */
  useEffect(() => { try { const seededDemo = new URLSearchParams(window.location.search).get("demo") === "seeded"; setIsSeededDemo(seededDemo); const stored = JSON.parse(localStorage.getItem(storageKey) ?? "null") as StoredPlan | null; const restoredScenario = stored?.version === 1 ? findSeededScenario(stored.scenarioId) : undefined; if (stored?.state === "planning" && restoredScenario) { const restoredContext = UserContextSchema.parse(stored.context); const restoredProgress = LocalProgressSchema.parse(stored.progress); compileRoadmapPresentation(restoredScenario.pack, restoredContext); setScenarioId(stored.scenarioId); setStatement(stored.statement); setContext(restoredContext); setProgress(restoredProgress); setState("planning"); setShowIntro(false); } else if (seededDemo) setShowIntro(false); } catch { localStorage.removeItem(storageKey); } finally { setHydrated(true); } }, []);
  /* eslint-enable react-hooks/set-state-in-effect */
  useEffect(() => { if (!hydrated || state !== "planning") return; localStorage.setItem(storageKey, JSON.stringify({ version: 1, scenarioId, statement, context, progress, state } satisfies StoredPlan)); }, [context, hydrated, progress, scenarioId, state, statement]);
  useEffect(() => { if (!showIntro && state === "entry") input.current?.focus(); }, [showIntro, state]);
  useEffect(() => {
    if (state !== "planning" || !conversationThread.current || !currentTurn.current) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frame = window.requestAnimationFrame(() => currentTurn.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "nearest", inline: "nearest" }));
    return () => window.cancelAnimationFrame(frame);
  }, [activeQuestion?.id, state, transcriptAnswers.length]);

  function chooseScenario(next: SeededScenario) { setStatement(next.examplePrompt); setError(undefined); }
  async function understandEvent() {
    if (!statement.trim() || classificationPending) return;
    setClassificationPending(true);
    setError(undefined);
    try {
      const response = await fetch("/api/ai/extract-event", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ story: statement, sessionId: classifierSessionId() }) });
      const result = await response.json() as { kind?: unknown; reason?: unknown; classification?: unknown };
      const parsedClassification = EventClassificationSchema.safeParse(result.classification);
      const id = parsedClassification.success && typeof parsedClassification.data.eventId === "string" ? parsedClassification.data.eventId : undefined;
      const nextScenario = id ? findSeededScenario(id as SeededScenario["id"]) : undefined;
      if (!response.ok || result.kind !== "classified" || !nextScenario) {
        setError(result.reason === "rate_limited"
          ? "This local live-classifier session has reached its request limit. Please wait before trying again."
          : "I’m not yet sure which supported event this is. Please choose an available example or describe it a little differently.");
        return;
      }
      setScenarioId(nextScenario.id);
      const candidate = classificationCandidateFromPack(nextScenario.pack);
      const statedFacts = parsedClassification.success ? sanitizeStatedFacts(parsedClassification.data.statedFacts, candidate) : [];
      setClassifiedContext({ facts: Object.fromEntries(statedFacts.map((fact) => [fact.factId, fact.value])) });
      setContext({ facts: {} });
      setProgress(emptyProgress);
      setLastDiff(undefined);
      setTranscriptAnswers([]);
      setEditingStatedFact(undefined);
      setState("understood");
    } catch {
      setError("I’m not able to confirm a supported event right now. Please try again in a moment or choose one of the supported examples.");
    } finally {
      setClassificationPending(false);
    }
  }
  function confirmEvent() { setContext(classifiedContext); setState("planning"); }
  function correctStatedFact(question: QuestionDefinition, value: FactValue | undefined) {
    setClassifiedContext((current) => {
      const facts = { ...current.facts };
      if (value === undefined) delete facts[question.factId]; else facts[question.factId] = value;
      return { facts };
    });
    setEditingStatedFact(undefined);
  }
  function answer(value: SeededValue | undefined, label: string) { if (!activeQuestion) return; const facts = { ...context.facts }; if (value === undefined) delete facts[activeQuestion.factId]; else facts[activeQuestion.factId] = value; const next = { facts }; const nextRoadmap = compileRoadmapPresentation(scenario.pack, next).roadmap; setLastDiff(diffRoadmaps(presentation.roadmap, nextRoadmap)); setContext(next); setTranscriptAnswers((current) => [...current, { questionId: activeQuestion.id, value: label }]); setProgress((current) => ({ progressStatusByTaskId: Object.fromEntries(Object.entries(current.progressStatusByTaskId).filter(([id]) => nextRoadmap.steps.some((task) => task.id === id))) })); }
  function cycleProgress(taskId: string) { setProgress((current) => { const next = { ...current.progressStatusByTaskId }; if (!next[taskId]) next[taskId] = "reviewed"; else if (next[taskId] === "reviewed") next[taskId] = "complete"; else delete next[taskId]; return { progressStatusByTaskId: next }; }); }
  function confirmBirth() { const next = { facts: { ...context.facts, event_stage: "birth_occurred" } }; setLastDiff(diffRoadmaps(presentation.roadmap, compileRoadmapPresentation(scenario.pack, next).roadmap)); setContext(next); }
  function reset() {
    localStorage.removeItem(storageKey);
    setState("entry");
    setStatement("");
    setScenarioId("expecting_child");
    setContext({ facts: {} });
    setClassifiedContext({ facts: {} });
    setEditingStatedFact(undefined);
    setProgress(emptyProgress);
    setLastDiff(undefined);
    setError(undefined);
    setTranscriptAnswers([]);
    setIntroExiting(false);
    setShowIntro(true);
    setResetPending(false);
  }
  function closeIntro() { setShowIntro(false); }

  const routePane = <section className="route-pane">{state === "planning" ? <><ActionRoute roadmap={presentation.roadmap} sourceCards={scenario.pack.sourceCards} progress={progress} taskDiff={lastDiff} rationaleByKey={scenario.rationaleByKey ?? {}} readOnly={presentation.mode === "preview"} onCycleProgress={cycleProgress} />{activeQuestion && <a className="mobile-question-link" href="#current-question">Continue with the current question <span aria-hidden="true">↓</span></a>}</> : <section className="route-preview-empty" aria-labelledby="route-title"><p className="route-eyebrow">Your route</p><h2 id="route-title">Your plan will take shape here.</h2><p>Confirm what happened, then answer only the questions that can change your next steps.</p><ol aria-label="Route preview"><li>Today</li><li>Your plan</li><li>Next</li></ol></section>}</section>;

  if (!hydrated) return null;
  return <main className={`app-shell action-shell${showIntro ? introExiting ? " intro-exiting" : " intro-pending" : ""}`}>
    {showIntro && <LandingIntro onExitStart={() => setIntroExiting(true)} onComplete={closeIntro} />}
    <noscript><style>{`.landing-intro{display:none!important}.action-shell.intro-pending .app-header,.action-shell.intro-pending .action-workspace{opacity:1!important;pointer-events:auto!important;transform:none!important}`}</style></noscript>
    <header className="app-header"><BrandMark />{isSeededDemo && <div className="mode-badge" data-testid="seeded-ai-boundary"><span aria-hidden="true" />Seeded demo · live classification</div>}</header>
    <p className="sr-only" aria-live="polite">{lastDiff?.changes.length ? "Your route updated from validated answers." : ""}</p>
    <section className={`action-workspace action-workspace--${state}`} aria-label="Life Navigator Action Route workspace">
      {state === "planning" && routePane}
      <section className="conversation-pane" aria-label="Life Navigator conversation"><h1 className="sr-only">Life Navigator</h1>{state !== "planning" && <a className="mobile-plan-link" href="#route-title">View your route</a>}<div ref={conversationThread} className="conversation-thread">
        <article className="assistant-message">Tell me what changed. I’ll help you organize the next steps and what can wait.</article>
        {state !== "entry" && <article className="user-message">{statement}</article>}
        {state === "understood" && <article className="assistant-message"><p>{scenario.confirmationCopy} Is that right?</p><StatedFactsConfirmation context={classifiedContext} questions={scenario.questions} editingFactId={editingStatedFact} onEdit={setEditingStatedFact} onCorrect={correctStatedFact} /><div className="message-actions"><button className="answer-button answer-button--affirmative" type="button" onClick={confirmEvent}>Yes, that’s right</button><button className="answer-button" type="button" onClick={() => setState("entry")}>Choose a different event</button></div></article>}
        {state === "planning" && <><article className="assistant-message">Your route is ready to refine. I’ll ask only what can change it.</article>{transcriptAnswers.map((answer) => <article className="user-message user-message--answer" key={answer.questionId}>{answer.value}</article>)}{activeQuestion ? <article ref={currentTurn} id="current-question" className="assistant-message assistant-message--question">{lastDiff?.changes.length ? <a className="route-change-link" href="#route-title"><span>Your route updated</span><strong>View changes <span aria-hidden="true">→</span></strong></a> : null}<h2>{activeQuestion.presentation.prompt}</h2><QuestionInput question={activeQuestion} onAnswer={answer} /><details className="why-ask"><summary>Why are we asking this?</summary><p>{activeQuestion.presentation.rationale}</p></details></article> : <article ref={currentTurn} className="assistant-message"><h2>{presentation.mode === "preview" ? "Your after-birth preview is ready." : "Your route is ready."}</h2>{presentation.mode === "preview" && <button className="primary-button" type="button" onClick={confirmBirth}>The child has now been born</button>}</article>}</>}
      </div>
      {state === "entry" && <form className="conversation-composer" onSubmit={(event) => { event.preventDefault(); void understandEvent(); }} noValidate aria-busy={classificationPending}><label htmlFor="event-statement">What happened?</label><div><input ref={input} id="event-statement" value={statement} onChange={(event) => { setStatement(event.target.value); setError(undefined); }} placeholder="For example: I lost my job" disabled={classificationPending} /><button className="primary-button" type="submit" disabled={classificationPending}>{classificationPending ? "Understanding…" : <>Continue <span aria-hidden="true">→</span></>}</button></div><p className="conversation-composer__scope">Currently, I can help plan for expecting a child, losing a job, or relocating from Israel to the United States.</p><p>Quick starts</p><div className="prompt-list">{seededScenarios.map((item) => <button key={item.id} type="button" className="prompt-button" onClick={() => chooseScenario(item)} disabled={classificationPending}>{item.examplePrompt}</button>)}</div>{error && <p className="input-error" role="alert">{error}</p>}</form>}
      {state === "planning" && <footer className="conversation-footer"><span>General planning support only.</span><button className="text-button" type="button" onClick={() => setResetPending(true)}>Reset demo</button></footer>}
      </section>
      {state !== "planning" && routePane}
    </section>
    {resetPending && <ResetDialog onCancel={() => setResetPending(false)} onConfirm={reset} />}
  </main>;
}

function StatedFactsConfirmation({ context, questions, editingFactId, onEdit, onCorrect }: { context: UserContext; questions: readonly QuestionDefinition[]; editingFactId?: string; onEdit(factId: string | undefined): void; onCorrect(question: QuestionDefinition, value: FactValue | undefined): void }) {
  const facts = Object.entries(context.facts).flatMap(([factId, value]) => {
    const question = questions.find((item) => item.factId === factId);
    return question ? [{ question, value }] : [];
  });
  if (facts.length === 0) return null;
  return <section className="stated-facts" aria-label="Details noted from your statement"><p>We also noted these details from what you said. You can correct them before continuing.</p><ul>{facts.map(({ question, value }) => {
    const option = question.presentation.options?.find((item) => Object.is(item.value, value));
    const summary = `${question.presentation.prompt.replace(/[?]$/, "")} — ${option?.label ?? String(value)}`;
    const editing = editingFactId === question.factId;
    return <li key={question.factId}><span>{summary}</span>{editing ? <QuestionInput question={question} onAnswer={(next) => onCorrect(question, next)} /> : <button className="text-button" type="button" onClick={() => onEdit(question.factId)}>Correct</button>}</li>;
  })}</ul></section>;
}

function ResetDialog({ onCancel, onConfirm }: { onCancel(): void; onConfirm(): void }) {
  const cancel = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    cancel.current?.focus();
    const handler = (event: KeyboardEvent) => { if (event.key === "Escape") onCancel(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCancel]);
  return <div className="reset-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
    <section className="reset-dialog" role="dialog" aria-modal="true" aria-labelledby="reset-dialog-title" aria-describedby="reset-dialog-description">
      <p className="section-kicker">Demo controls</p>
      <h2 id="reset-dialog-title">Start this demo again?</h2>
      <p id="reset-dialog-description">This clears this browser’s saved route, answers, and local progress. It does not affect an account or an external service.</p>
      <div className="reset-dialog-actions"><button ref={cancel} className="answer-button" type="button" onClick={onCancel}>Keep my route</button><button className="primary-button" type="button" onClick={onConfirm}>Reset demo</button></div>
    </section>
  </div>;
}
