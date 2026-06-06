---
name: decision-log-discipline
description: Decision log discipline for assumptions, open questions, resolved decisions, reversals, and escalations across TripleS artifacts
---

# Decision Log Discipline

## Purpose

A TripleS decision log keeps artifacts aligned as work moves from PRD → design → RFC → tasks → test cases → QA. It prevents silent assumptions, repeated debates, and hidden scope changes.

Use a decision log whenever a choice affects user scope, implementation direction, delivery risk, test scope, release criteria, or another agent's handoff.

## Decision Taxonomy

| Type | Meaning | Example | Owner |
|---|---|---|---|
| Assumption | Temporarily accepted because evidence is missing | `[ASSUMPTION] Users can reset passwords by email only.` | Artifact owner |
| Open question | Needs human or agent answer before approval | `Which payment provider is in scope?` | Current agent |
| Decision | Resolved choice with rationale | `Use cursor pagination because data grows unbounded.` | Decision owner |
| Constraint | Non-negotiable limit | `Must support iOS latest + one version back.` | User / product / architecture |
| Escalation | Cannot be resolved by the current agent | `PRD requires offline mode; RFC cost exceeds timeline.` | SeoYeon |
| Reversal | Previously approved decision changed | `Switching from session auth to JWT after RFC review.` | Approver |

## When To Log

Log the item if any answer is yes:

- Another agent needs the choice to continue.
- A future reviewer would ask "why did we do this?"
- The choice changes acceptance criteria, architecture, test coverage, timeline, risk, or release readiness.
- The decision rejects a plausible alternative.
- The item is an assumption that could become wrong.
- The item changes after human approval.

Do not log:

- Obvious restatements of existing artifact content.
- Local implementation preferences with no contract, risk, or scope impact.
- Temporary drafting notes that will not survive artifact approval.

## Required Format

Use this format inside the owning artifact or handoff section:

```markdown
## Decision Log

| ID | Type | Status | Decision / Question | Rationale | Owner | Needed By |
|---|---|---|---|---|---|---|
| D-001 | Assumption | Open | [statement] | [why assumed] | [agent/user] | [artifact/stage] |
```

Status values:

- `Open` — unresolved and blocks or risks later work.
- `Proposed` — recommended but not yet approved.
- `Approved` — accepted by the owning agent or human gate.
- `Superseded` — replaced by a newer decision; include the replacement ID.
- `Escalated` — sent to SeoYeon or the user.

## Promotion Rules

- Assumption → Decision: when the user, artifact owner, or source artifact confirms it.
- Assumption → Open question: when wrongness would alter scope, architecture, tasks, or QA.
- Open question → Escalation: when the current agent cannot answer from approved artifacts.
- Decision → Reversal: when approved direction changes after a gate.
- Any item → Superseded: when a later artifact replaces it; never delete important history.

## Cross-Artifact Alignment

When a decision affects another artifact, copy the ID and summary into that artifact's relevant section.

- PRD decisions affecting technical feasibility must appear in the RFC as constraints or risks.
- Design decisions affecting implementation must appear in the task breakdown or developer handoff.
- RFC decisions affecting testing must appear in test cases as coverage drivers.
- QA decisions affecting release must appear in `workspace/QA_REPORT.md` and SeoYeon's delivery summary.

## Escalation Triggers

Escalate instead of guessing when:

- A decision requires business priority, budget, timeline, or legal judgment.
- Approved PRD, design, RFC, and tasks disagree.
- The same open question blocks two or more agents.
- A change after approval expands scope or invalidates test cases.
- The technical solution cannot satisfy an approved acceptance criterion.

## Quality Checklist

A decision log is acceptable when:

- [ ] Every open item has an owner and needed-by stage.
- [ ] Every approved decision has a rationale.
- [ ] Rejected alternatives are named when the choice is architecture- or scope-significant.
- [ ] Assumptions are clearly labeled and not presented as facts.
- [ ] Reversals preserve the old decision and link to the replacement.
- [ ] No approval gate proceeds with unresolved blockers hidden in prose.

## Anti-Patterns

- **Invisible assumption:** writing requirements as facts without naming the uncertainty.
- **Decision without rationale:** choosing an approach but leaving reviewers unable to evaluate it.
- **Forever-open question:** carrying unresolved blockers through approval gates.
- **History deletion:** removing old choices instead of marking them superseded.
- **Wrong owner:** assigning user/business decisions to developer agents.
