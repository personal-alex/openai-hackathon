"use client";

import { useMemo, useState } from "react";
import { compileRoadmap } from "@/roadmap-compiler";
import { seededScenarios } from "@/test-fixtures/seeded-scenarios";

export default function Home() {
  const [scenarioId, setScenarioId] = useState(seededScenarios[0].id);
  const scenario = seededScenarios.find((item) => item.id === scenarioId) ?? seededScenarios[0];
  const roadmap = useMemo(() => compileRoadmap(scenario.pack, scenario.context), [scenario]);

  return (
    <main className="shell">
      <header>
        <p className="eyebrow">Life Navigator · seeded demo mode</p>
        <h1>A clear plan for what to consider next.</h1>
        <p className="lede">This is a controlled, test-only experience. It uses validated catalog fixtures and a deterministic roadmap compiler.</p>
      </header>
      <section aria-labelledby="scenario-heading" className="panel">
        <h2 id="scenario-heading">Choose a seeded scenario</h2>
        <div className="scenario-list">
          {seededScenarios.map((item) => <button key={item.id} type="button" aria-pressed={item.id === scenario.id} onClick={() => setScenarioId(item.id)}>{item.label}</button>)}
        </div>
      </section>
      <section aria-labelledby="roadmap-heading" className="panel roadmap">
        <div><p className="eyebrow">Your roadmap</p><h2 id="roadmap-heading">{scenario.label}</h2></div>
        <p className="notice">{scenario.explanation}</p>
        <ol>{roadmap.steps.map((task) => <li key={task.id}><h3>{task.title}</h3><p>{task.actionSummary}</p><dl><div><dt>Timing</dt><dd>{task.timing.labelKey}</dd></div><div><dt>Why it appears</dt><dd>{task.rationale}</dd></div><div><dt>Status</dt><dd>{task.verificationLabel}</dd></div></dl></li>)}</ol>
      </section>
      <footer>General planning support only. Verify current information with an appropriate reviewed source before acting.</footer>
    </main>
  );
}
