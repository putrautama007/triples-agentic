# PRD Knowledge — Standards & Quality Gates

## What a PRD Is

A Product Requirements Document defines WHAT to build and WHY — never HOW. It is the contract between product and engineering. Engineers should be able to implement from it without asking the PM for clarification.

## PRD Structure

```
# Product Requirements Document: [Feature Name]

## Problem Statement
One paragraph. What user problem are we solving? Why does it matter?

## User Personas
Who are the primary users? What are their goals, frustrations, and context?

## Feature Scope
### In Scope
Bulleted list of what this product/feature includes.

### Out of Scope
Explicit list of what is NOT included in this release. This is as important as in-scope.

## User Stories
As a [persona], I want [goal] so that [benefit].
Include 3–10 stories that cover the core user journeys.

## Acceptance Criteria
For each major feature, list measurable pass/fail criteria.
Use: "Given [context], when [action], then [outcome]."

## Success Metrics
How will we know this feature succeeded? Include quantitative targets.

## Non-Functional Requirements
Performance, security, accessibility, internationalization constraints.

## Dependencies & Risks
What other teams, systems, or data sources does this depend on?
What could go wrong?

## Open Questions
Questions that need resolution before or during development.
```

## Quality Gates

ALL of the following must pass before a PRD is marked implementation-ready:

- [ ] **Problem statement** — clear, specific, one paragraph, explains user pain
- [ ] **Primary persona** — at least one user persona defined with goals and context
- [ ] **Feature scope** — both in-scope AND out-of-scope explicitly stated
- [ ] **User stories** — at least 3 stories covering core journeys
- [ ] **Acceptance criteria** — every major feature has measurable pass/fail criteria (no vague "works well")
- [ ] **Success metrics** — at least one quantitative metric defined
- [ ] **No implementation leak** — PRD does not prescribe tech stack, architecture, or database choices
- [ ] **Open questions addressed** — no blockers left unanswered before handoff

## Anti-Patterns to Avoid

| Anti-Pattern | Why It's Wrong | Fix |
|---|---|---|
| "The system should be fast" | Not measurable | "Page load under 2s on 3G" |
| "Use React for the frontend" | PRD prescribes implementation | Move to RFC |
| "TBD" on acceptance criteria | Engineers can't test against TBD | Resolve before handoff |
| Features listed without personas | No context for priority decisions | Add who benefits and why |
| 40-page PRD for an MVP | Overspecification kills agility | Cut to what's needed for v1 |

## Writing Principles

1. **One truth per sentence.** Each bullet should be independently testable.
2. **Persona-first.** Always trace a requirement back to a user need.
3. **Explicit scope.** If you don't say it's out of scope, engineers will assume it's in scope.
4. **No ambiguity in criteria.** "User can log in" is not a criterion. "User can log in with email+password within 3 seconds" is.
5. **Short is better.** A lean, clear PRD ships faster than a complete one that nobody reads.
