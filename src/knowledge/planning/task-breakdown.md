# Task Breakdown Knowledge — Decomposition & Story Mapping

## Hierarchy

```
Initiative (months)
  └── Epic (weeks)
        └── User Story (days)
              └── Task (hours)
```

- **Initiative**: a strategic goal ("launch mobile app")
- **Epic**: a large body of work that delivers meaningful value ("user authentication")
- **User Story**: a single user-facing unit of value ("user can log in with email/password")
- **Task**: a technical work item ("implement JWT middleware")

## What Goes in a Task

```markdown
## Task: [Short imperative title]

**Story Points:** [1 / 2 / 3 / 5 / 8 / 13]
**Estimated Hours:** [X–Y hours]
**Assignee:** [Agent name or role]
**Dependencies:** [Task IDs this depends on]
**Platform:** [Web / Android / iOS / Flutter / Backend / All]

### Description
One paragraph of what needs to be done and why.

### Acceptance Criteria
- [ ] Criterion 1 (testable, binary pass/fail)
- [ ] Criterion 2
- [ ] Criterion 3

### Technical Notes
Any non-obvious implementation notes, constraints, or gotchas.

### Definition of Done
- [ ] Code written and reviewed
- [ ] Unit tests passing
- [ ] Integrated and verified in staging/dev environment
- [ ] QA signed off (for user-facing changes)
```

## Task Decomposition Rules

1. **One task = one concern.** If a task has an "and" in the title, split it.
2. **Tasks must be independently completable.** A task blocked by another should list the dependency explicitly.
3. **No task should be longer than 2 days (16h).** If it is, decompose it further.
4. **Every task must have testable acceptance criteria.** "Done" is not a criterion.
5. **Estimate at the task level, not story level.** Roll up estimates bottom-up.

## Story Mapping

Story mapping organizes user stories by user journey (x-axis) and priority/release (y-axis):

```
User Journey →  Login  →  Browse  →  Purchase  →  Receipt
                -------    -------    ----------    -------
MVP (Row 1)     Email       List       Cart          Email
                login       view       checkout      receipt

v1.1 (Row 2)    Social      Search     Saved cards   PDF
                login       filter     (1-click)     download

v2 (Row 3)      SSO         Recommend  Subscriptions Loyalty
```

Walk the journey before breaking into tasks. This prevents building features in the wrong order.

## Sprint Planning Conventions

- Sprint capacity = (team size × days per sprint × hours per day) × velocity factor (0.7 for sustainable pace)
- Use yesterday's weather for velocity: if the team completes 30 points per sprint, plan 30 points
- Leave 20% of capacity for bug fixes, tech debt, and unplanned work
- Never plan more than 80% of individual capacity — people get sick, have meetings, answer questions

## Task Readiness Checklist (Is a Task Ready to Start?)

- [ ] Acceptance criteria are written and agreed upon
- [ ] Dependencies are identified and unblocked (or scheduled)
- [ ] Story points are estimated by the person who will do the work
- [ ] Design assets/mockups are available (for UI tasks)
- [ ] API contracts are defined (for integration tasks)
- [ ] The task fits within one sprint
