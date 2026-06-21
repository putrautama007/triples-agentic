---
name: implementation-readiness
description: Implementation-readiness checklist for TripleS handoffs from approved planning artifacts into development and QA work
---

# Implementation Readiness

## Purpose

Implementation readiness is the gate between approved intent and executable work. A task is ready only when a developer or QA agent can act without inventing product scope, UX behavior, architecture, dependencies, or pass/fail criteria.

This skill applies before:

- Developer agents start implementation.
- Lynn creates the final test suite.
- ShiOn begins QA execution.
- SeoYeon routes a rework package after defects.

## Readiness Levels

| Level | Meaning | Action |
|---|---|---|
| Ready | Work can start with no blocking ambiguity | Route to owner |
| Ready with watch items | Work can start; named risks need monitoring | Route with watch items |
| Not ready | Missing required information blocks work | Stop and clarify |
| Rework ready | Defect fix has enough evidence and regression scope | Route to owning developer |

## Required Source Artifacts

Implementation is ready only when the relevant approved artifacts exist:

- `workspace/prd/PRD-{slug}.md` — scope, personas, acceptance criteria, success metrics.
- `workspace/DESIGN_SPEC.md` — flows, states, platform adaptation, component guidance when UI is in scope.
- `workspace/rfc/RFC-{slug}.md` — architecture, API/data contracts, risks, rollback plan when technical design is needed.
- `workspace/task-breakdown/TASKS-{slug}.md` — task owner, dependencies, estimates, binary acceptance criteria.
- `workspace/test-cases/TC-{slug}-*.md` — approved before QA execution.

## Handoff Readiness Checklist

A handoff is ready when all checks pass:

- [ ] Human approval gate has passed for every upstream artifact required by the stage.
- [ ] Scope is explicit: in-scope, out-of-scope, and constraints are named.
- [ ] Acceptance criteria are binary and trace to PRD user stories.
- [ ] UI work includes screen states, microcopy, responsive/adaptive behavior, and accessibility requirements.
- [ ] API/backend work includes request/response contracts, auth boundaries, error shapes, and data model decisions.
- [ ] Platform ownership is clear for every task.
- [ ] Dependencies are ordered or explicitly marked as blockers.
- [ ] Test scope is defined, including P0 smoke paths and key regression areas.
- [ ] Open decisions are non-blocking or escalated with an owner and needed-by stage.
- [ ] Risks have mitigation or monitoring notes.

## Blocker Taxonomy

Use these labels when a handoff is not ready:

- `SCOPE_BLOCKER` — missing or contradictory product requirement.
- `UX_BLOCKER` — missing flow, state, content, accessibility, or platform design.
- `ARCH_BLOCKER` — missing architecture, API, data, security, or rollback decision.
- `TASK_BLOCKER` — task lacks owner, dependency order, estimate, or binary acceptance criteria.
- `TEST_BLOCKER` — missing test data, coverage target, or reproducible expected result.
- `APPROVAL_BLOCKER` — required human gate has not passed.

## Handoff Contract

Every implementation handoff should include:

```markdown
Owner: [agent]
Task IDs: [from TASK_BREAKDOWN]
Source artifacts: [paths]
Acceptance criteria: [binary criteria]
Dependencies: [ordered list or none]
Risks/watch items: [list or none]
Regression scope: [P0/P1/P2 focus]
Open decisions: [none or decision-log IDs]
```

## Rework Readiness

A defect fix handoff is ready when it includes:

- Bug ID and severity/priority.
- Exact reproduction steps.
- Expected vs actual result.
- Affected acceptance criteria or user story.
- Suspected owner or subsystem.
- Regression scope after the fix.
- Retest evidence required for closure.

## Go / No-Go Guidance

- If a task is missing a binary acceptance criterion, it is not ready.
- If a UI task lacks required state coverage, it is not ready.
- If an API task lacks contract details, it is not ready.
- If a blocker requires human judgment, stop and ask; do not route to a developer to guess.
- If a risk is known but non-blocking, route with a watch item and make the owner explicit.

## Anti-Patterns

- **Approval by momentum:** moving forward because the previous agent said `READY` without human approval.
- **Developer archaeology:** expecting implementation agents to infer scope from scattered conversation history.
- **Test afterthought:** routing implementation without identifying smoke and regression expectations.
- **Hidden dependency:** assigning parallel work that secretly depends on another platform or API task.
- **Vague done:** using acceptance criteria like "works correctly" or "UI matches design" without measurable conditions.
