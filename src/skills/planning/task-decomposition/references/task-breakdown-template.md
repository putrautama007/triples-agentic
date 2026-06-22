# Task Breakdown: [Feature / Sprint Name]

**Author:** NaKyoung (TPM)
**Date:** YYYY-MM-DD
**Related PRD:** workspace/prd/PRD-{slug}.md
**Related RFC:** workspace/rfc/RFC-{slug}.md
**Sprint:** [Sprint N] | **Duration:** [X weeks]
**Total Story Points:** [sum]
**Estimated Timeline:** [X–Y weeks]

---

## Team Allocation

| Agent | Role | Platforms |
|-------|------|-----------|
| YuBin | Frontend Web | Web |
| Kaede | Backend | API / Server |
| YeonJi | Android | Android Native |
| SoHyun | iOS | iOS Native |
| Kotone | Flutter | Android + iOS + Web |

*Only activate agents for platforms confirmed in PRD/RFC.*

---

## Epic: [Epic Name]

> Brief description of what this epic delivers and why.

---

### Story: US-01 — [User Story Title]

> As a [persona], I want [goal] so that [benefit].

---

#### TASK-001: [Short imperative title]

**Story Points:** 3
**Estimated Hours:** 4–8h
**Assignee:** [YuBin / Kaede / YeonJi / SoHyun / Kotone]
**Platform:** [Web / Android / iOS / Flutter / Backend]
**Dependencies:** none / TASK-XXX
**Parallel Group:** PG-1

**Description:**
One paragraph of what needs to be done and why.

**Acceptance Criteria:**
- [ ] [Specific, binary pass/fail criterion]
- [ ] [Specific, binary pass/fail criterion]
- [ ] [Specific, binary pass/fail criterion]

**Technical Notes:**
[Any non-obvious constraints, API endpoints to call, or design assets to reference]

**Definition of Done:**
- [ ] Code written, reviewed, and merged
- [ ] Unit/component tests written and passing
- [ ] Integrated and verified in dev environment
- [ ] No regressions in existing functionality

---

#### TASK-002: [Short imperative title]

**Story Points:** 5
**Estimated Hours:** 1–2 days
**Assignee:** [Agent]
**Platform:** [Platform]
**Dependencies:** TASK-001
**Parallel Group:** PG-2

**Description:**
[Description]

**Acceptance Criteria:**
- [ ] [Criterion]
- [ ] [Criterion]

**Technical Notes:**
[Notes]

**Definition of Done:**
- [ ] Code written, reviewed, and merged
- [ ] Tests written and passing
- [ ] Verified in dev environment

---

### Story: US-02 — [User Story Title]

---

#### TASK-003: [Short imperative title]

**Story Points:** 2
**Estimated Hours:** 2–4h
**Assignee:** [Agent]
**Platform:** Backend
**Dependencies:** none
**Parallel Group:** PG-1

**Description:**
[Description]

**Acceptance Criteria:**
- [ ] [Criterion]

**Technical Notes:**
[Notes]

**Definition of Done:**
- [ ] Code written, reviewed, and merged
- [ ] Integration test passing
- [ ] API documented

---

## Infrastructure / Setup Tasks

> Technical tasks required by the RFC that don't map to user stories.

#### TASK-I01: [Infrastructure task title]

**Story Points:** 3
**Estimated Hours:** 4–8h
**Assignee:** Kaede (Backend)
**Platform:** Backend / DevOps
**Dependencies:** none
**Parallel Group:** PG-1

**Description:**
[e.g., Configure PostgreSQL schema and run initial migration]

**Acceptance Criteria:**
- [ ] Migration runs successfully in dev environment
- [ ] Rollback migration also tested

---

## Dependency Map

```
TASK-I01 (DB setup)
    └── TASK-001 (API endpoint)
            └── TASK-002 (Frontend integration)
                    └── TASK-003 (UI polish)
```

---

## Execution Plan — Parallel Groups (Waves)

Tasks are grouped into waves derived from the dependency map. Tasks in the same wave have no dependency on each other and can be built in parallel; the next wave starts once its dependencies (earlier waves) are done.

| Wave | Tasks | Assignees | Runs after |
|------|-------|-----------|------------|
| PG-1 | TASK-I01, TASK-003 | Kaede, [Agent] | — (no dependencies) |
| PG-2 | TASK-001 | Kaede | PG-1 |
| PG-3 | TASK-002 | YuBin | PG-2 |

> Within a wave, a developer agent may implement its same-group tasks concurrently (e.g. via the `Task` tool). Keep tasks across waves in order.

---

## Timeline Estimate

| Week | Focus | Tasks |
|------|-------|-------|
| Week 1 | Setup + Core API | TASK-I01, TASK-003 |
| Week 2 | Core Features | TASK-001, TASK-002 |
| Week 3 | Polish + QA | Remaining tasks + QA gate |

**Buffer:** Add 20% to account for reviews, bug fixes, and unplanned complexity.

---

## Story Point Summary

| Agent | Tasks | Points | Est. Time |
|-------|-------|--------|-----------|
| YuBin | [N] tasks | [X] pts | [X days] |
| Kaede | [N] tasks | [X] pts | [X days] |
| YeonJi | [N] tasks | [X] pts | [X days] |
| SoHyun | [N] tasks | [X] pts | [X days] |
| Kotone | [N] tasks | [X] pts | [X days] |
| **Total** | | **[X] pts** | **[X–Y weeks]** |
