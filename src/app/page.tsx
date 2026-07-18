"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LocalProgressSchema, UserContextSchema, type LocalProgress, type TaskDiff, type UserContext } from "@/domain-contracts";
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
  const [transcriptAnswers, setTranscriptAnswers] = useState<TranscriptAnswer[]>([]);
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
      const result = await response.json() as { kind?: unknown; reason?: unknown; classification?: { eventId?: unknown; facts?: unknown } };
      const id = typeof result.classification?.eventId === "string" ? result.classification.eventId : undefined;
      const nextScenario = id ? findSeededScenario(id as SeededScenario["id"]) : undefined;
      const parsedContext = UserContextSchema.safeParse({ facts: result.classification?.facts && Array.isArray(result.classification.facts) ? Object.fromEntries(result.classification.facts.filter((fact): fact is { factId: string; value: string | number | boolean } => Boolean(fact && typeof fact === "object" && "factId" in fact && typeof fact.factId === "string" && "value" in fact)).map((fact) => [fact.factId, fact.value])) : {} });
      if (!response.ok || result.kind !== "classified" || !nextScenario || !parsedContext.success) {
        setError(result.reason === "rate_limited"
          ? "This local live-classifier session has reached its request limit. Please wait before trying again."
          : "I’m not yet sure which supported event this is. Please choose “I’m expecting a child” or “I lost my job,” or describe it a little differently.");
        return;
      }
      setScenarioId(nextScenario.id);
      setClassifiedContext(parsedContext.data);
      setContext({ facts: {} });
      setProgress(emptyProgress);
      setLastDiff(undefined);
      setTranscriptAnswers([]);
      setState("understood");
    } catch {
      setError("I’m not able to confirm a supported event right now. Please try again in a moment or choose one of the supported examples.");
    } finally {
      setClassificationPending(false);
    }
  }
  function confirmEvent() { setContext(classifiedContext); setState("planning"); }
  function answer(value: SeededValue | undefined, label: string) { if (!activeQuestion) return; const facts = { ...context.facts }; if (value === undefined) delete facts[activeQuestion.factId]; else facts[activeQuestion.factId] = value; const next = { facts }; const nextRoadmap = compileRoadmapPresentation(scenario.pack, next).roadmap; setLastDiff(diffRoadmaps(presentation.roadmap, nextRoadmap)); setContext(next); setTranscriptAnswers((current) => [...current, { questionId: activeQuestion.id, value: label }]); setProgress((current) => ({ progressStatusByTaskId: Object.fromEntries(Object.entries(current.progressStatusByTaskId).filter(([id]) => nextRoadmap.steps.some((task) => task.id === id))) })); }
  function cycleProgress(taskId: string) { setProgress((current) => { const next = { ...current.progressStatusByTaskId }; if (!next[taskId]) next[taskId] = "reviewed"; else if (next[taskId] === "reviewed") next[taskId] = "complete"; else delete next[taskId]; return { progressStatusByTaskId: next }; }); }
  function confirmBirth() { const next = { facts: { ...context.facts, event_stage: "birth_occurred" } }; setLastDiff(diffRoadmaps(presentation.roadmap, compileRoadmapPresentation(scenario.pack, next).roadmap)); setContext(next); }
  function reset() { localStorage.removeItem(storageKey); setState("entry"); setStatement(""); setScenarioId("expecting_child"); setContext({ facts: {} }); setClassifiedContext({ facts: {} }); setProgress(emptyProgress); setLastDiff(undefined); setError(undefined); setTranscriptAnswers([]); }
  function closeIntro() { setShowIntro(false); }

  if (!hydrated) return null;
  return <main className={`app-shell action-shell${showIntro ? introExiting ? " intro-exiting" : " intro-pending" : ""}`}>
    {showIntro && <LandingIntro onExitStart={() => setIntroExiting(true)} onComplete={closeIntro} />}
    <noscript><style>{`.landing-intro{display:none!important}.action-shell.intro-pending .app-header,.action-shell.intro-pending .action-workspace{opacity:1!important;pointer-events:auto!important;transform:none!important}`}</style></noscript>
    <header className="app-header"><BrandMark />{isSeededDemo && <div className="mode-badge" data-testid="seeded-ai-boundary"><span aria-hidden="true" />Seeded demo · live classification</div>}</header>
    <p className="sr-only" aria-live="polite">{lastDiff?.changes.length ? "Your route updated from validated answers." : ""}</p>
    <section className="action-workspace" aria-label="Life Navigator Action Route workspace">
      <section className="conversation-pane" aria-label="Life Navigator conversation"><h1 className="sr-only">Life Navigator</h1><a className="mobile-plan-link" href="#route-title">View your route</a><div ref={conversationThread} className="conversation-thread">
        <article className="assistant-message">Tell me what changed. I’ll help you organize the next steps and what can wait.</article>
        {state !== "entry" && <article className="user-message">{statement}</article>}
        {state === "understood" && <article className="assistant-message"><p>{scenario.confirmationCopy} Is that right?</p><div className="message-actions"><button className="answer-button answer-button--affirmative" type="button" onClick={confirmEvent}>Yes, that’s right</button><button className="answer-button" type="button" onClick={() => setState("entry")}>Choose a different event</button></div></article>}
        {state === "planning" && <><article className="assistant-message">Your route is ready to refine. I’ll ask only what can change it.</article>{transcriptAnswers.map((answer) => <article className="user-message user-message--answer" key={answer.questionId}>{answer.value}</article>)}{activeQuestion ? <article ref={currentTurn} className="assistant-message assistant-message--question"><h2>{activeQuestion.presentation.prompt}</h2><QuestionInput question={activeQuestion} onAnswer={answer} /><details className="why-ask"><summary>Why are we asking this?</summary><p>{activeQuestion.presentation.rationale}</p></details></article> : <article ref={currentTurn} className="assistant-message"><h2>{presentation.mode === "preview" ? "Your after-birth preview is ready." : "Your route is ready."}</h2>{presentation.mode === "preview" && <button className="primary-button" type="button" onClick={confirmBirth}>The child has now been born</button>}</article>}</>}
      </div>
      {state === "entry" && <form className="conversation-composer" onSubmit={(event) => { event.preventDefault(); void understandEvent(); }} noValidate aria-busy={classificationPending}><label htmlFor="event-statement">What happened?</label><div><input ref={input} id="event-statement" value={statement} onChange={(event) => { setStatement(event.target.value); setError(undefined); }} placeholder="For example: I lost my job" disabled={classificationPending} /><button className="primary-button" type="submit" disabled={classificationPending}>{classificationPending ? "Understanding…" : <>Continue <span aria-hidden="true">→</span></>}</button></div><p>Supported seeded scenarios</p><div className="prompt-list">{seededScenarios.map((item) => <button key={item.id} type="button" className="prompt-button" onClick={() => chooseScenario(item)} disabled={classificationPending}>{item.examplePrompt}</button>)}</div>{error && <p className="input-error" role="alert">{error}</p>}</form>}
      {state === "planning" && <footer className="conversation-footer"><span>General planning support only.</span><button className="text-button" type="button" onClick={reset}>Reset local demo</button></footer>}
      </section>
      <section className="route-pane">{state === "planning" ? <ActionRoute roadmap={presentation.roadmap} sourceCards={scenario.pack.sourceCards} progress={progress} taskDiff={lastDiff} rationaleByKey={scenario.rationaleByKey ?? {}} readOnly={presentation.mode === "preview"} onCycleProgress={cycleProgress} /> : <section className="route-preview-empty" aria-labelledby="route-title"><p className="route-eyebrow">Your route</p><h2 id="route-title">Your plan will take shape here.</h2><p>Confirm what happened, then answer only the questions that can change your next steps.</p><ol aria-label="Route preview"><li>Today</li><li>Your plan</li><li>Next</li></ol></section>}</section>
    </section>
  </main>;
}
