# Domain Model

## Core concepts

### LifeEvent

A meaningful change in a person's life that can trigger a set of decisions, obligations, services, or opportunities.

Examples: `FIRST_CHILD`, `MARRIAGE`, `JOB_LOSS`, `BEREAVEMENT`, `MILITARY_ENLISTMENT`, `MOVE`, `RETIREMENT`.

### UserContext

Facts about the user and their situation that affect the roadmap. Context is collected incrementally and should contain only information needed for the selected event.

Examples: jurisdiction, event date, household composition, employment status, due date, and relevant preferences.

### Question

A focused request for one missing or ambiguous piece of context. Questions must state why the answer matters when that is helpful.

### KnowledgeSource

An attributable piece of curated information: an official page, policy, form guide, public FAQ, or verified research note. It has jurisdiction, freshness, provenance, and applicability metadata.

### Roadmap

The personalized plan generated for one event and one user context. It is structured data first and a visual narrative second.

### RoadmapStep

One actionable or decision-oriented item in a roadmap. A step may be immediate, time-bound, conditional, informational, or dependent on another step.

## Relationships

```text
User story → LifeEvent → UserContext + Questions
                         ↓
                  KnowledgeSources
                         ↓
                      Roadmap
                         ↓
                   RoadmapSteps
                         ↓
                Explanation + Provenance
```

## JSON-first contract

Internal APIs should exchange typed, schema-validated objects. Illustrative roadmap shape:

```json
{
  "eventId": "FIRST_CHILD",
  "jurisdiction": "IL",
  "contextCompleteness": 0.75,
  "steps": [
    {
      "id": "parental-leave-check",
      "title": "Review parental-leave options",
      "status": "recommended",
      "priority": "high",
      "timing": "Before the due date",
      "rationale": "Employment status can affect leave planning.",
      "sourceIds": ["source-parental-leave-001"],
      "dependsOn": []
    }
  ],
  "nextQuestion": {
    "id": "due-date",
    "text": "What is the expected due date?",
    "reason": "It helps place time-sensitive steps on your timeline."
  }
}
```

This is an illustrative contract, not a finalized schema.

## Domain invariants

- A roadmap belongs to one `LifeEvent` and one scoped `UserContext`.
- Every recommendation must be explainable.
- Any claim based on retrieved knowledge should retain source provenance.
- Unknown facts remain unknown; do not infer sensitive facts to complete a roadmap.
- Event-specific data belongs in configuration, curated knowledge, or templates—not in platform-wide type names or service names unless necessary.
