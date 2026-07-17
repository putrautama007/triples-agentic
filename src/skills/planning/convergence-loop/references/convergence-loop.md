---
name: convergence-loop
description: End-to-end artifact convergence loop from PRD through QA with human review and defect-driven rework
---

# Convergence Loop Knowledge — PRD to Tested Delivery

## Purpose

The convergence loop prevents handoff drift. Each stage produces an artifact, reviews it against quality gates, asks the human only for decisions that cannot be inferred safely, then repeats until the artifact is ready for the next stage.

The loop works in both Claude Code and OpenAI Codex because it uses plain artifact paths, explicit handoff prompts, and stable skill names instead of platform-only features.

## Core Loop

For every planning artifact:

1. **Create** — generate the artifact from the approved upstream artifact and template.
2. **Review** — run the stage-specific quality gate checklist.
3. **Evaluate** — output exactly one state: `READY`, `GAPS FOUND`, or `BLOCKED`.
   - For PRD, RFC, and Test Cases: evaluation MUST include a numeric **quality score** (0.0–1.0) computed as `passing gates / total gates`.
   - Minimum score threshold: **0.9**. If score < 0.9, the agent must escalate to the human with specific clarification questions before revising.
   - Only output `READY` when score ≥ 0.9.
4. **Human review** — ALWAYS required before moving to the next stage, regardless of evaluation result:
   - If `GAPS FOUND`: on Claude Code, use the available `AskUserQuestion` flow; on Codex, return a protocol-v1 document request to the parent, which presents it in Plan mode and re-invokes the owner with correlated answers.
   - If `READY`: on Codex, return the artifact summary so the parent can own the explicit approval request. Preserve the direct human gate on platforms that expose it to the specialist. Do NOT proceed until the user approves.
5. **Revise** — incorporate decisions, preserve approved sections, and record meaningful changes.
6. **Repeat** — continue Review → Evaluate → Human review until the user explicitly approves the artifact.

**Critical rule:** `READY` means quality gates passed. It does NOT mean the artifact is approved for the next stage. The orchestrator must always stop and wait for explicit human approval before delegating the next agent.

**Scoring rule:** For PRD, RFC, and Test Case artifacts, the agent must compute and report a quality score (0.0–1.0). If score < 0.9, the agent must escalate to the human with one specific clarification question per failing gate. Do not revise the artifact until the human answers. After the human clarifies, revise and re-evaluate. Only artifacts with score ≥ 0.9 proceed to the final human approval gate.

## Stage Gates

| Stage | Owner | Artifact | Ready Signal |
|---|---|---|---|
| PRD | JiWoo | `workspace/prd/PRD-{slug}.md` | `PRD APPROVED` |
| Design | HyeRin | `workspace/DESIGN_SPEC.md` | `DESIGN APPROVED` |
| RFC | YooYeon | `workspace/rfc/RFC-{slug}.md` | `RFC APPROVED` |
| Tasks | NaKyoung | `workspace/task-breakdown/TASKS-{slug}.md` | `TASKS APPROVED` |
| Implementation | Developer agents | source files + test output | `[PLATFORM] TASKS COMPLETE` |
| Check | DaHyun | check output (tests, types, lint) | `CHECK PASSED` or `CHECK FAILED` |
| Test Cases | Lynn | `workspace/test-cases/TC-{slug}-*.md` | `TEST CASES APPROVED` |
| QA | ShiOn | `workspace/QA_REPORT.md` + `workspace/BUGS/*.md` | `QA COMPLETE — GO` or `QA COMPLETE — NO-GO` |

**Test Cases is a PRD-driven parallel track.** Lynn starts at PRD approval — not at the Tasks gate — and runs alongside Design → RFC → Tasks → Development. The RFC contributes technical-risk edge cases via an enrichment pass (Update Test Cases) once it is approved. The Test Cases gate sits before QA, not after Tasks; QA still requires both all developers `[PLATFORM] TASKS COMPLETE` **and** Test Cases approved.

## Run-State Ledger & Resume (token-limit resilience)

Long runs get cut off mid-stage — a usage-limit reset, a context compaction, or a closed terminal. Child context can also become unavailable, so anything not written to disk may be lost. The run-state ledger makes every run resumable from the last completed unit of work, with no dependence on conversation memory. It works the same in Claude Code and Codex.

### The ledger file

One file per run: `workspace/RUN_STATE.md`. Plain Markdown — both tools read and edit it, and a human can eyeball it. Status markers:

`[ ]` pending · `[~]` in-progress · `[x]` done / approved · `[!]` blocked

```markdown
# Run State — {slug}
<!-- triples-run-state: v1 -->
Updated: {ISO-8601 timestamp} — {agent}
Active stage: {stage}
Next action: {one line — the exact unit to resume}

## Stages
- [x] PRD — JiWoo — approved — workspace/prd/PRD-{slug}.md
- [x] Design — HyeRin — approved — workspace/DESIGN_SPEC.md
- [x] RFC — YooYeon — approved — workspace/rfc/RFC-{slug}.md
- [x] Tasks — NaKyoung — approved — workspace/task-breakdown/TASKS-{slug}.md
- [~] Development — in-progress
- [ ] Check — DaHyun — pending
- [ ] Test Cases — Lynn — pending
- [ ] QA — ShiOn — pending

## Development tasks
- [x] TASK-001 — Kaede — done
- [~] TASK-007 — Kaede — in-progress
- [ ] TASK-008 — YuBin — pending

## Test cases
- (one line per TC during the Test Cases stage)

## QA tests
- (one line per test / bug during QA)

## Planning input queue
- [!] 001 — {request-id} — {clarification | escalation | approval} — pending
  - Protocol: request v1; response v1; attempts 1/2
  - Target: {owning document specialist | parent-owned approval}
  - Owner / stage: {owner} / {stage}
  - Artifacts: {workspace paths}
  - Questions: {q1: pending; q2: answered — concise summary}
- [x] 000 — {request-id} — {kind} — resolved
  - Protocol: request v1; response v1; attempts 1/2
  - Target: {owning document specialist}
  - Owner / stage: {owner} / {stage}
  - Artifacts: {workspace paths}
  - Answers: {q1: concise summary; q2: concise summary}
```

Queue numbers are assigned in arrival order. Concurrent planning requests and
parent-owned approvals are processed FIFO: only the oldest pending entry is
presented. When every required answer is present, change `[!]` to `[x] — resolved`
and retain the owner, correlation IDs, and concise answer summary. A second
malformed child response is instead retained as `[!] — protocol_error` with both
validation attempts; no decision is guessed. This remains compatible with
`triples-run-state: v1`; no separate ledger migration is required.

### Write rule (every agent)

Flush after each completed unit — never batch:
1. **Before** starting a unit (a task, a test case, a QA test, a bug fix), mark it `[~]` and set `Next action` to that unit.
2. **After** the unit passes its gate, mark it `[x]`, refresh `Updated`, and point `Next action` at the next unit.
3. An interruption therefore loses at most one in-flight unit.

The orchestrator creates the ledger at run start and owns the `## Stages` rows (one update per stage transition or approval). Producing agents own their own task/test rows.

A run may start at a later stage (`/seoyeon run --from rfc|dev|…`) using upstream artifacts the user supplies — pre-placed in `workspace/` or attached in the prompt. Skipped upstream stages are seeded `[x] — provided` so resume treats them as done and never re-runs them. A provided upstream document may still be revised mid-run (the orchestrator spawns its owning agent) and then re-enters its human-approval gate — its ledger row flips `[x] — provided` → `[~]` → `[x]` across the revision.

### Resume rule

On `/seoyeon resume` (or "continue"):
1. Read `workspace/RUN_STATE.md`.
2. If `## Planning input queue` contains `[!]`, process the oldest entry only. Re-present just its unanswered questions and do not advance the affected gate.
3. Otherwise the resume point is the first `[~]` unit; if none, the first `[ ]` unit under the active stage.
4. For a resolved planning request, re-invoke its recorded owner with the artifacts, ledger, and correlated v1 response. For ordinary stage resume, tell the owner: "These units are `[x]` — do not redo them. Resume at {unit}."
5. If no ledger exists, fall back to artifact inference (existing behavior).

Never trust conversation memory to know where a run stopped — trust the ledger.

## Cross-Platform Invocation Contract

Claude Code and Codex expose specialists as custom subagents; SeoYeon remains the
orchestrator skill. The orchestrator should write handoffs in both forms so either
tool can continue the run.

Use this format:

```text
Next agent: JiWoo PRD
Claude: invoke the `jiwoo-prd` subagent (Agent tool)
Codex: ask Codex to spawn the `jiwoo-prd` agent
Input artifacts: workspace/prd/PRD-{slug}.md
Task: Review and revise until READY.
Open decisions: [numbered list or "none"]
```

Do not depend on hidden conversation memory. Every handoff must include artifact paths and locked decisions.

## Codex Document Relay

The strict relay is limited to JiWoo, HyeRin, YooYeon, NaKyoung, and Lynn.
Before a document mutation or invocation, the parent confirms that native
`request_user_input` is callable. If it is unavailable, state remains unchanged
and the user is directed to select Codex Plan mode and resend the same natural
`$seoyeon` request.

Document children emit `TRIPLES_USER_INPUT_REQUIRED` protocol v1 with a stable
request ID, owner, stage, artifact paths, and one to three questions. Every
question has two or three mutually exclusive options with exactly one
recommendation; custom answers use the interactive UI's built-in free-form
choice. The parent persists valid requests in the FIFO queue above, then calls
`request_user_input` without a timeout or automatic resolution. It never
downgrades a document request to a chat question.

One malformed response receives one corrective retry to the same child. A second
invalid response becomes `protocol_error` without guessing. After all answers
arrive, the parent re-invokes the owning specialist with a correlated protocol-v1
`TRIPLES_USER_INPUT_RESPONSE`. If interactive prompting fails after persistence,
the request remains pending and the pipeline stays blocked until the natural
request is resent in Plan mode.

`READY` returns to the parent, which owns exactly **Approve / Request changes**.
Approval advances immediately; changes return to the producer. Developer,
checker, setup, and QA blocker behavior is unchanged.

## Development and QA Convergence

After task approval, development and test-case creation run in parallel. QA then checks implementation against the approved test suite.

If QA returns `NO-GO`:

1. SeoYeon reads `workspace/QA_REPORT.md` and `workspace/BUGS/*.md`.
2. SeoYeon groups defects by owning platform agent.
3. SeoYeon routes each defect back to the owner with reproduction steps, expected result, actual result, and affected acceptance criteria.
4. Developer agent fixes only assigned defects and reruns relevant checks.
5. ShiOn retests fixed defects and regression-risk areas.
6. Loop repeats until `QA COMPLETE — GO` or human accepts documented release risk.

## Escalation Threshold

Escalate to the human when:

- Same quality gate fails 3 times on the same artifact.
- QA reports the same defect after 2 fix attempts.
- Fix requires changing approved PRD scope, design behavior, or RFC architecture.
- Two agents disagree on source of truth.
- Release can proceed only by accepting Critical or High risk.

## Human Review Prompt Shape

Ask for decisions, not vague feedback.

```text
Human review needed before next stage.
Gate: [PRD / Design / RFC / Tasks / Test Cases / QA]
Blocking gaps:
1. [specific gap]
Decision needed: [clear question]
Recommended option: [agent recommendation + reason]
Impact if deferred: [delivery or quality risk]
```

## Delivery Summary Inputs

Final delivery summary must cite:

- Approved artifacts and paths.
- Platforms implemented.
- Tests run and result.
- Open defects or accepted risks.
- Go/No-Go recommendation.
- Follow-up tasks, if any.
