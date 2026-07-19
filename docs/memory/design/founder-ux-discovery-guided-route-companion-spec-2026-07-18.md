---
title: founder-ux-discovery-guided-route-companion-spec-2026-07-18
type: note
permalink: openai-hackathon/design/founder-ux-discovery-guided-route-companion-spec-2026-07-18
tags:
- life-navigator
- ux-discovery
- ux-specification
- founder-approved
---

# Life Navigator — Guided Route Companion UX specification

## Status

Founder-approved interaction direction, 2026-07-18. This is a UX/interaction specification, not a visual design or implementation authorization.

## Product understanding

### Problem

After a major life event, people often spend days confused, flowing with circumstances, and fearing paperwork or missed actions. General LLM chatbots feel unreliable because usefulness depends on model behavior and prompt wording.

### Primary user

A broad adult audience actively planning a supported life event, typically after several days of confusion rather than at the exact moment of the event.

### Desired outcome

Within the first few minutes, the person can say: **“Now I know what I should do and what my next steps are.”** They regain control by seeing an actionable route.

### Current alternatives and frictions

Search, informal advice, official sites, and generic chatbots create fragmented, prompt-dependent, or overwhelming information. Users fear both too many possible actions and having missed an important one.

### Product opportunity

A deterministic, source-backed route makes the situation finite, inspectable, and personally adjustable without making an official determination.

## Confirmed founder decisions

- The product is a **Guided Route Companion**, not a chatbot, wizard, dashboard, or generic task list.
- The visible, explorable route is the primary product artifact; conversation is the refinement mechanism.
- Show the whole route at a glance, organized first by **what needs attention now versus later**.
- Lead with a clear immediate action; do not lead with a catch-up audit or guilt-inducing missed-step inventory.
- The user may explore any route action; do not force a rigid prescribed sequence.
- The route is a companion users work through over time. Marked progress matters, but route changes after a user corrects/updates their situation are more valuable than progress alone.
- Show a meaningful provisional route early when validated data supports one. If incomplete, show what is known and clearly represent remaining conditional options; do not hide the route or invent a generic checklist.
- A question earns its place through a visible value loop: approved rationale before answer, validated route effect after answer.
- Trust comes from official-source availability, a plain reason an action applies, and ability to adjust route assumptions. Source evidence should be clearly available on demand, not dense by default.

## Core UX principle

**Show the route honestly before asking the person to earn it; let them explore it freely, then refine it through visible, decision-changing updates.**

## Conceptual model

```text
Life event + known context → validated route
validated route → attention horizons + conditional options + personal progress
one decision-changing question → context update → explainable route diff
route action → what to do + why it applies + timing + verification + official source
```

### Objects and states

- **Situation:** supported life event plus stated/answered context.
- **Route:** immutable compiler-selected actions, grouped by generic attention/timing horizon.
- **Action:** a validated task with action summary, rationale, timing, verification, and sources.
- **Conditional option:** an action/branch that remains unresolved until approved context is known; it must not look like an obligation or prediction.
- **Question:** one allowlisted, decision-changing clarification with an approved rationale.
- **Route update:** an added/changed/removed result from a validated context change; no UI-generated explanation.
- **Personal progress:** browser-local reviewed/complete overlay, separate from route authority.

## Information architecture and navigation

### 1. Orientation and event statement

Purpose: turn an uncertain life event into a supported starting point.

The person states what changed in their own words. The product explains concise scope and preserves direct supported-event correction. This is not a generic chat surface.

### 2. Event confirmation

Purpose: preserve user control over classification.

A supported event suggestion requires explicit confirmation. Unclear/unsupported input offers correction/direct selection without model confidence or an empty-plan failure.

### 3. Route workspace — primary home

Purpose: provide a whole-route view with a clear attention horizon.

The workspace makes the validated route primary. It exposes:

- **Now:** the small set needing current attention;
- **Next / later:** forthcoming actions that establish the shape of the journey;
- **Conditional / unresolved:** only where validated catalog data permits, clearly explained as depending on an answer rather than as a presumed obligation;
- **Current refinement:** one available question and its approved rationale;
- **Route change:** compiler-derived added/changed/removed summary after context updates.

Desktop may use a strong route-plus-refinement composition. Mobile keeps the actual route first in semantic and visual order, with an accessible direct path to the active question.

### 4. Action inspection

Purpose: make a route action trustworthy enough to follow.

A person opens any action to see what to do, why it appears, timing, verification label, available dependencies, and a concise planning-support boundary. Official-source publisher, review date, and external link are consistently available on demand.

### 5. Update situation

Purpose: let the person change the assumptions shaping the route.

The person revisits an answered fact or provides a newly relevant answer. The product validates it, preserves their current route long enough to show the compiler diff, then returns them to the updated route. Unknown remains unknown.

### 6. Return orientation

Purpose: restore confidence after time away.

The first useful return signal is a route update arising from changed/clarified situation. Progress remains visible as private orientation, but does not substitute for showing whether the route still fits reality.

## Primary journeys

### First visit with provisional route available

1. State what changed.
2. Confirm supported event.
3. See the current validated route at a glance, with Now first.
4. Explore any action, its why/timing/verification/source.
5. Answer one clearly justified question when ready.
6. See the validated route update and continue exploring or refine again.

### First visit with incomplete context

1. State what changed.
2. Confirm supported event or correct it.
3. See the validated route portion available now.
4. See any remaining options as conditional, not required.
5. Answer the one question that resolves the most meaningful next uncertainty.
6. See the route update.

### Return after changed situation/new information

1. Open current route.
2. Select an editable context item or current question.
3. Update or mark unknown.
4. See compiler-derived route change.
5. Reorient around current Now actions; optionally inspect the changed action/source.

## Core states

- **Normal:** explorable route and, when applicable, one question to refine it.
- **No route yet:** clear event-confirmation or one-needed-fact explanation; no fabricated plan.
- **Partial/conditional route:** known actions plus legible unresolved options.
- **Route updated:** concise validated summary; affected actions labelled non-color-only.
- **No catalog change:** save/acknowledge context without inventing a change story.
- **Validation/AI/rate/storage failure:** retain the last validated route and context; calm explanation and safe fallback/correction path.
- **Source unavailable:** no claim of authority; show approved verification framing only.

## MVP scope

Build and demonstrate:

1. Event-led statement and explicit confirmation.
2. Whole-route overview, grouped by validated generic attention/timing horizons.
3. Visible Now priority plus later route shape.
4. One-question value loop: approved rationale → answer/unknown → compiler-derived route diff.
5. Free exploration of task details, official-source inspection, verification labels, and local progress.
6. Context-edit/update path and a clear route-change summary.
7. Honest partial/conditional route handling where the catalog/compiler provides data.
8. Responsive route-first mobile composition and accessible keyboard/reduced-motion behavior.

## Explicit non-goals for this version

- Full chatbot transcript as the primary interface.
- Wizard-style mandatory sequential completion.
- Dense case-management dashboard, document vault, reminders, notifications, integrations, or automatic actions.
- Branching-map visualization as the default route view.
- UI-generated policy, timing, source, eligibility, rationale, or change explanations.
- Expanded jurisdiction, authentication, database-backed sensitive data, or live web retrieval.

## Existing generic contract handoffs

The UX must not work around these missing validated fields:

1. Resolved task rationale text.
2. Resolved question rationale text outside fixture presentation.
3. Resolved `TaskChange.reason` text.
4. Removed-task title/reason snapshot.
5. Task-level change conditions distinct from dependencies.

## Open questions

- How much conditional route information is enough to orient without overwhelming? Validate with quick user observation or founder walkthrough.
- What exact return-state copy best distinguishes route updates from self-marked progress?
- Which source/review metadata must appear in the first inspection layer versus a deeper source view?
- How should a user see a meaningful partial route for packs with no base tasks when context is unknown? This must be resolved at approved catalog/compiler boundaries.
- How should the current local-only persistence support return use without implying secure account history or sensitive-data storage?

## Success signals for the hackathon demo

- A first-time viewer can articulate the route’s Now actions and later shape without reading a long chat transcript.
- A question visibly alters the route in a way the viewer can understand.
- A viewer can inspect why an action appears and its official source without leaving the route flow.
- Updating context visibly changes the plan while keeping the person in control.
- The product never suggests that AI or UI prose, rather than validated catalog/compiler data, defines the plan.

## Decision record

- Decision: Guided Route Companion.
- Context: People arrive after confusion, distrust prompt-dependent chatbot results, fear both excess and missed actions, and need clarity/control.
- Alternatives considered: conversational planner, living checklist, branching situation map.
- Reason: combines whole-route orientation, free exploration, trust/evidence, and transparent refinement within deterministic architecture and hackathon scope.
- Trade-offs: more interaction hierarchy and route-change explanation work; avoid overwhelming conditional information.
- Consequences: route remains primary on desktop/mobile; questions are refinement loops; no chat-first or wizard-first experience.

Related: [[founder-ux-discovery-selected-model-2026-07-18]] · [[founder-ux-discovery-problem-framing-2026-07-18]] · [[founder-ux-discovery-trust-model-2026-07-18]] · [[founder-ux-discovery-question-value-loop-2026-07-18]].