---
name: task-readiness
description: Task format template, definition of done, and readiness checklist for tasks before development starts
---

# Task Readiness & Format

## Task Format

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
- [ ] Integrated and verified in dev environment
- [ ] QA signed off (for user-facing changes)
```

## Readiness Checklist (Is a Task Ready to Start?)

- [ ] Acceptance criteria are written and agreed upon
- [ ] Dependencies are identified and unblocked (or sequenced)
- [ ] Story points are estimated by the person who will do the work
- [ ] Design assets/mockups are available (for UI tasks)
- [ ] API contracts are defined (for integration tasks)
- [ ] The task fits within one sprint (≤ 2 days / 16 hours)

## Dependency Mapping

Express dependencies explicitly between tasks:

```
TASK-I01 (DB setup)
    └── TASK-001 (API endpoint)
            └── TASK-002 (Frontend integration)
                    └── TASK-003 (UI polish)
```

Never start a task with unresolved upstream dependencies. If the dependency can't be resolved, flag it to the orchestrator (SeoYeon) immediately.

## Evaluation Output

Run all gates and output exactly one of:

- `✅ READY — All tasks meet the readiness checklist.`
- `❌ GAPS FOUND: [numbered list of specific unclear or missing items]`
