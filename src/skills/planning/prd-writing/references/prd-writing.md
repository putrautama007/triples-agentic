---
name: prd-writing
description: How to write a Product Requirements Document — structure, user stories, acceptance criteria, and writing principles
---

# PRD Writing — Structure & Standards

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

## Writing Principles

1. **One truth per sentence.** Each bullet should be independently testable.
2. **Persona-first.** Always trace a requirement back to a user need.
3. **Explicit scope.** If you don't say it's out of scope, engineers will assume it's in scope.
4. **No ambiguity in criteria.** "User can log in" is not a criterion. "User can log in with email+password within 3 seconds" is.
5. **Short is better.** A lean, clear PRD ships faster than a complete one that nobody reads.
6. **No implementation leak.** The PRD must not prescribe tech stack, architecture, or database choices — those belong in the RFC.
