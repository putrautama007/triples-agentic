---
name: rfc-writing
description: How to write a Request for Comments — structure, trade-off analysis, alternatives, and rollout planning
---

# RFC Writing — Structure & Standards

## What an RFC Is

A Request for Comments is a technical design document that proposes HOW to build something. It is written after the PRD (what/why) is approved. The RFC:
- Documents the chosen technical approach and its trade-offs
- Surfaces risks before code is written
- Creates a record of technical decisions and why they were made
- Collects feedback from the team before implementation begins

## RFC Structure

```
# RFC: [Feature / System Name]
**Status:** Draft | Under Review | Approved | Superseded
**Author:** [Name]
**Date:** YYYY-MM-DD
**Related PRD:** workspace/PRD.md

## Summary
One paragraph: what is being built, using what approach, and the key trade-off accepted.

## Motivation
Why are we building this now? Reference the PRD problem statement.

## Technical Proposal
### Architecture Overview
High-level diagram or description of how components interact.

### Data Model
Key entities, relationships, and storage approach.

### API Contracts
Endpoint definitions, request/response shapes, authentication.

### Key Algorithms / Business Logic
Non-trivial logic that needs design attention.

### Infrastructure & Deployment
Where does this run? How does it scale? What observability is needed?

## Alternatives Considered
For each alternative: what is it, why was it rejected?

## Trade-offs & Risks
What are we giving up? What could go wrong? Include mitigation for each risk.

## Migration Plan
If this changes existing behavior: how do we migrate data and users safely?

## Rollout Plan
Feature flag strategy, phased rollout, rollback procedure.

## Open Questions
Technical questions that need resolution before or during implementation.
```

## Writing Principles

1. **One decision per RFC.** An RFC that tries to design three systems is too big. Split it.
2. **State the trade-off explicitly.** "We chose X. This means we accept Y."
3. **Diagrams beat prose.** ASCII diagrams, sequence diagrams, and ER diagrams communicate faster.
4. **Separate what from how.** Architecture section = what components exist. Implementation section = how each works.
5. **Date every decision.** Technology landscapes change. A decision that made sense in 2022 may not in 2025.

## Architecture Decision Records (ADR)

For decisions that affect the whole system, write a formal ADR:

```
# ADR-XXX: [Decision Title]
**Status:** Proposed | Accepted | Deprecated | Superseded
**Context:** Why does this decision need to be made?
**Decision:** What was decided?
**Consequences:** What does this mean going forward?
```
