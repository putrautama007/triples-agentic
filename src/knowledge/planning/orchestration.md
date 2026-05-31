# Orchestration Knowledge — Workflow Coordination

## Role of the Engineering Manager in Agent Orchestration

The orchestrator's job is to route work, not do it. Delegate early, track progress, escalate blockers.

## Standard Workflow Sequence

```
User Input → PRD → RFC → Task Breakdown → (Dev ∥ Test Cases) → QA → Delivery
```

Human review gates are mandatory at: PRD, RFC, Task Breakdown, Test Cases.
Development and Test Case creation run in parallel once Task Breakdown is approved.

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
