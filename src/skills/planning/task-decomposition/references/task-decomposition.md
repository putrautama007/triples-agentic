---
name: task-decomposition
description: Task hierarchy (epic/story/task), decomposition rules, story mapping, and sprint planning conventions
---

# Task Decomposition

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

## Decomposition Rules

1. **One task = one concern.** If a task has an "and" in the title, split it.
2. **Tasks must be independently completable.** A task blocked by another should list the dependency explicitly.
3. **No task should be longer than 2 days (16h).** If it is, decompose it further.
4. **Every task must have testable acceptance criteria.** "Done" is not a criterion.
5. **Estimate at the task level, not story level.** Roll up estimates bottom-up.

## Story Mapping

Story mapping organises user stories by user journey (x-axis) and priority/release (y-axis):

```
User Journey →  Login  →  Browse  →  Purchase  →  Receipt
                -------    -------    ----------    -------
MVP (Row 1)     Email       List       Cart          Email
                login       view       checkout      receipt

v1.1 (Row 2)    Social      Search     Saved cards   PDF
                login       filter     (1-click)     download
```

Walk the journey before breaking into tasks. This prevents building features in the wrong order.

## Sprint Planning Conventions

- Sprint capacity = (team size × days per sprint × hours per day) × 0.7 (sustainable pace)
- Use yesterday's weather for velocity: if the team completes 30 points per sprint, plan 30 points
- Leave 20% capacity for bug fixes, tech debt, and unplanned work
- Never plan more than 80% of individual capacity

## Infrastructure Tasks

Technical tasks required by the RFC that don't map to user stories must also be included:
- Database migrations and schema setup
- CI/CD pipeline configuration
- Third-party service integration setup
- Environment and secrets configuration

These should be estimated and sequenced like any other task.
