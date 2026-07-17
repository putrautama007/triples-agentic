---
name: orchestration
description: Agent workflow sequencing, delegation protocol, escalation rules, and artifact tracking
---

# Orchestration Knowledge — Workflow Coordination

## Role of the Engineering Manager in Agent Orchestration

The orchestrator's job is to route work, not do it. Delegate early, track progress, escalate blockers.

## Standard Workflow Sequence

```
User Input → PRD → Design → RFC → Task Breakdown → Dev → QA → Delivery
                  └─────────── Test Cases (PRD-driven, parallel) ──────────┘
```

Human review gates are mandatory at: PRD, Design, RFC, Task Breakdown, Test Cases.
Test Case creation is PRD-driven: it starts at PRD approval and runs in parallel with Design, RFC, Task Breakdown, and Development (enriched by the RFC once approved). Development starts once Task Breakdown is approved. QA requires Development complete **and** Test Cases approved.

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

### Codex Parent Human-Input Relay

Codex specialists do not own the user conversation. On `GAPS FOUND`, `BLOCKED`,
or another human decision, they return a sentinel-wrapped
`TRIPLES_USER_INPUT_REQUIRED` JSON payload with one to three questions and stop.
The orchestrator must:

1. Persist the request ID, kind, owner, stage, artifact paths, pending status, and
   resume action in `workspace/RUN_STATE.md` before asking anything.
2. Use `request_user_input` only when it is callable and every question has two
   or three mutually exclusive choices with exactly one recommendation. Otherwise
   use a plain-text fallback.
3. Keep the gate blocked for partial, duplicate, unrelated, or malformed answers.
4. Mark the request resolved only after all required answers exist, then re-invoke
   the owner with `TRIPLES_USER_INPUT_RESPONSE` and the canonical artifact paths.
5. Create approval requests at the parent level after `READY`; never accept a
   specialist's self-approval as a human gate.

This relay applies to planning gates, developer clarification, QA blockers, and
direct specialist invocation. Re-invocation is required after context loss; do
not depend on an earlier child thread's memory.

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
├── RUN_STATE.md                       # resumable run ledger (see below)
├── prd/PRD-{slug}.md
├── DESIGN_SPEC.md
├── rfc/RFC-{slug}.md
├── task-breakdown/TASKS-{slug}.md
├── test-cases/TC-{slug}-*.md
├── QA_REPORT.md
├── BUGS/*.md
└── DELIVERY_SUMMARY.md
```

Reference artifacts by path, not by memory, to avoid drift between agent contexts.

## Run State

Do **not** keep run state only in your head — persist it to `workspace/RUN_STATE.md` so the run survives a usage-limit reset, context compaction, or a closed session. The orchestrator creates the ledger at run start, updates the stage rows at every transition and approval, and reads it on resume. Producing agents own their own task/test rows. Format and rules: see `planning/convergence-loop.md` → "Run-State Ledger & Resume".

The stages tracked in the ledger:

| Stage | Agent | Status |
|---|---|---|
| PRD | JiWoo | pending / in-progress / review / approved |
| Design | HyeRin | pending / in-progress / review / approved |
| RFC | YooYeon | pending / in-progress / review / approved |
| Task Breakdown | NaKyoung | pending / in-progress / review / approved |
| Development | YuBin, Kaede, YeonJi, SoHyun, Kotone | pending / in-progress / done |
| Check | DaHyun | pending / in-progress / passed / failed |
| Test Cases | Lynn | pending / in-progress / review / approved |
| QA | ShiOn | pending / in-progress / done |

### Resume protocol (`/seoyeon resume`)

When the user resumes after a limit reset (or says "continue"):
1. Read `workspace/RUN_STATE.md`. If it is missing, fall back to inferring the stage from which artifacts exist.
2. Find the resume point: the first `[~]` (in-progress) unit, else the first `[ ]` (pending) unit under the active stage.
3. If the resume point is behind a pending **human approval gate**, stop and re-request that approval — do not auto-advance.
4. Otherwise re-invoke the owning agent with the completed units listed as "done — do not redo" and the resume point named explicitly.
5. Present the cross-platform handoff block so the run can also continue in Codex.

## Communication Style for Engineering Managers

- Be direct. State what's happening, what's blocked, and what you need.
- Do not hedge. If a gate fails, say it fails. If a decision is needed, say who decides.
- Summarize status in terms of delivery risk, not internal process steps.
- Keep handoff messages short — the receiving agent reads the artifact, not your narration.
