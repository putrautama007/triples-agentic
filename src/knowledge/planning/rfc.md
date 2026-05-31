# RFC Knowledge — Request for Comments Standards

## What an RFC Is

A Request for Comments is a technical design document that proposes HOW to build something. It is written after the PRD (what/why) is approved. The RFC:
- Documents the chosen technical approach and its trade-offs
- Surfaces risks before code is written
- Creates a record of technical decisions and why they were made
- Collects feedback from the team before implementation begins

## RFC Structure

```
# RFC: [Feature/System Name]
**Status:** Draft | Under Review | Approved | Superseded
**Author:** YooYeon (Staff Engineer)
**Date:** YYYY-MM-DD
**Related PRD:** workspace/PRD.md

## Summary
One paragraph: what is being built, using what approach, and the key trade-off accepted.

## Motivation
Why are we building this now? What problem does it solve that current systems cannot?
Reference the PRD problem statement.

## Technical Proposal
### Architecture Overview
High-level diagram or description of how components fit together.

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
What are we giving up with this approach? What could go wrong?
Include mitigation for each identified risk.

## Migration Plan
If this changes existing behavior: how do we migrate data and users safely?

## Rollout Plan
Feature flag strategy, phased rollout, rollback procedure.

## Open Questions
Technical questions that need resolution before or during implementation.

## References
Links to relevant documentation, prior RFCs, external standards.
```

## Quality Gates

ALL of the following must pass before an RFC is marked implementation-ready:

- [ ] **Architecture decision** — the chosen approach is stated clearly with a rationale
- [ ] **Alternatives documented** — at least 2 alternatives considered and rejected with reasoning
- [ ] **Data model** — entities and relationships defined (even if approximate)
- [ ] **API contracts** — public interfaces defined with request/response shapes
- [ ] **Risk assessment** — at least one risk identified with a mitigation
- [ ] **Rollback plan** — how to undo this change if it goes wrong
- [ ] **No scope creep** — RFC stays within the bounds of the approved PRD
- [ ] **Open questions closed** — no unresolved technical blockers before handoff

## Writing Principles

1. **One decision per RFC.** An RFC that tries to design three systems is too big. Split it.
2. **State the trade-off explicitly.** Don't hide complexity. "We chose X. This means we accept Y."
3. **Diagrams beat prose.** ASCII diagrams, sequence diagrams, and ER diagrams communicate faster than paragraphs.
4. **Separate what from how.** Architecture section = what components exist. Implementation section = how each component works.
5. **Date every decision.** Technology landscapes change. A decision that made sense in 2022 may not in 2025.

## Architecture Decision Records (ADR)

For decisions that affect the whole system (not just a feature), write a formal ADR:

```
# ADR-XXX: [Decision Title]
**Status:** Proposed | Accepted | Deprecated | Superseded
**Context:** Why does this decision need to be made?
**Decision:** What was decided?
**Consequences:** What does this mean going forward?
```

## Common RFC Anti-Patterns

| Anti-Pattern | Problem | Fix |
|---|---|---|
| "We'll figure out the DB schema later" | Blocks task estimation | Design the schema now, mark as draft |
| RFC written after code is done | Not a design doc, a post-mortem | Write RFC before implementation |
| No alternatives section | Appears like the first idea was the only idea | Always document what was rejected |
| "Industry standard approach" without citation | Vague justification | Name the standard and link to it |
| Mixing security concerns into every section | Hard to review | Dedicated security section |
