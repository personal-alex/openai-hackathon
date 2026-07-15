# ADR 0001: Life Event Is the Primary Domain Abstraction

**Status:** Accepted  
**Date:** 2026-07-14

## Context

People describe meaningful changes in their lives: expecting a child, getting married, losing a job, moving home, or losing a loved one. Existing information is organized by institutions, agencies, policies, and forms. Modeling the product around those institutions would make the experience fragmented and would encourage event-specific integrations.

## Decision

Life Navigator will model the user's situation around a `LifeEvent` first. The system will derive relevant context, questions, knowledge, and roadmap steps from that event.

Core platform concepts are `LifeEvent`, `UserContext`, `Question`, `KnowledgeSource`, `Roadmap`, and `RoadmapStep`.

## Consequences

### Positive

- The product speaks the user's language rather than the language of institutions.
- Multiple events can share the same engine, schemas, UI patterns, and evaluation approach.
- A hackathon demo can be narrow without making the underlying design narrow.
- New jurisdictions can be introduced primarily through scoped knowledge and rules.

### Costs and risks

- Event-specific rules and regulatory knowledge must be curated carefully.
- Generic abstractions must not erase important event-specific nuance.
- A roadmap must expose uncertainty and source provenance rather than imply authoritative eligibility decisions.

## Scope

This decision governs the Navigator MVP. It does not authorize external execution, form submission, or eligibility adjudication.
