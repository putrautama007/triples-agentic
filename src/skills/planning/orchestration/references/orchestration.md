---
name: orchestration
description: Agent workflow sequencing, delegation protocol, escalation rules, and artifact tracking
---

# Orchestration Knowledge — Workflow Coordination

## Role of the Engineering Manager in Agent Orchestration

The orchestrator's job is to route work, not do it. Delegate early, track progress, escalate blockers.

## Standard Workflow Sequence

```
User Input → PRD → Design → RFC → Task Breakdown → (Dev ∥ Test Cases) → QA → Delivery
```

Human review gates are mandatory at: PRD, Design, RFC, Task Breakdown, Test Cases.
Development and Test Case creation run in parallel once Task Breakdown is approved.

### Human Approval Gate Enforcement

When an agent reports `READY` (all quality gates passed), the orchestrator MUST:
1. Present the artifact to the user with a summary of key decisions and assumptions
2. Explicitly ask: "Do you approve this [artifact name] to proceed to the next stage?"
3. STOP and wait for user response before delegating the next agent
4. Only proceed when the user gives explicit approval (e.g., "approved", "looks good", "continue", or resolved change requests followed by approval)

Agent `READY` signals are quality-gate results. They are NOT substitutes for human approval. The orchestrator must never invoke the next sub-agent while a human approval gate is pending.

### Quality Score Enforcement (PRD, RFC, Test Cases)

PRD, RFC, and Test Case evaluations MUST produce a numeric quality score (0.0–1.0):
- Score = passing quality gates / total quality gates (equal weight per gate)
- Minimum threshold: **0.9**
- If score < 0.9: the producing agent must immediately escalate to the human with the failing gates, current score, and one specific clarification question per failing gate
- The producing agent must not revise the artifact until the human answers the clarification questions
- After the human answers, the producing agent revises and re-evaluates; if score is still < 0.9, repeat the clarification loop
- Only artifacts with score ≥ 0.9 should be presented for human approval
- The orchestrator must check the score before routing to the next stage — do not delegate if score is missing or below 0.9

If the user requests changes, route feedback to the owning agent, then repeat the approval gate when the agent returns the updated artifact.

## Delegation Protocol

When handing off to another agent, include:
- The artifact generated so far (path to file)
- The user's original intent (verbatim if possible)
- Any decisions already locked in
- Open questions the next agent should address

## Escalation Rules

Escalate to the user (not another agent) when:
- Two agents disagree on a foundational decision (scope, tech choice, timeline)
- A quality gate has been blocked for more than 2 review iterations
- A requirement contradicts a previously approved decision

Never silently skip a gate or merge conflicting requirements without human sign-off.

## Artifact Tracking

All artifacts land in `workspace/` at the project root:
```
workspace/
├── PRD.md
├── DESIGN_SPEC.md
├── RFC.md
├── TASK_BREAKDOWN.md
├── TEST_CASES.md
└── DELIVERY_SUMMARY.md
```

Reference artifacts by path, not by memory, to avoid drift between agent contexts.

## Run State

Maintain a mental model of which stage the current run is in:

| Stage | Agent | Status |
|---|---|---|
| PRD | JiWoo | pending / in-progress / review / approved |
| Design | HyeRin | pending / in-progress / review / approved |
| RFC | YooYeon | pending / in-progress / review / approved |
| Task Breakdown | NaKyoung | pending / in-progress / review / approved |
| Development | YuBin, Kaede, YeonJi, SoHyun, Kotone | pending / in-progress / done |
| Test Cases | Lynn | pending / in-progress / review / approved |
| QA | ShiOn | pending / in-progress / done |

## Communication Style for Engineering Managers

- Be direct. State what's happening, what's blocked, and what you need.
- Do not hedge. If a gate fails, say it fails. If a decision is needed, say who decides.
- Summarize status in terms of delivery risk, not internal process steps.
- Keep handoff messages short — the receiving agent reads the artifact, not your narration.
