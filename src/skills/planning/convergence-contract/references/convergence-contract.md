---
name: convergence-contract
description: Worker-agent slice of the convergence loop — run-state ledger, resume rule, and stage signals
---

# Convergence Contract — Worker Agents

You produce or check an artifact, then hand off. The orchestrator (SeoYeon) owns the
scored Create→Review→Evaluate→Human-review loop. You only need the ledger and signals
below. Full detail: `planning/convergence-loop.md` (orchestrator-owned).

## Run-State Ledger (token-limit resilience)

Sub-agents keep no memory between invocations — anything not written to disk is lost.
`workspace/RUN_STATE.md` makes every run resumable from the last completed unit.

Status markers: `[ ]` pending · `[~]` in-progress · `[x]` done/approved · `[!]` blocked

```markdown
# Run State — {slug}
<!-- triples-run-state: v1 -->
Updated: {ISO-8601 timestamp} — {agent}
Active stage: {stage}
Next action: {one line — the exact unit to resume}

## Stages
- [x] PRD — JiWoo — approved — workspace/prd/PRD-{slug}.md
- [~] Development — in-progress
- [ ] QA — ShiOn — pending

## Development tasks
- [x] TASK-001 — Kaede — done
- [~] TASK-007 — Kaede — in-progress
```

**Write rule (flush after each unit, never batch):**
1. **Before** starting a unit (task, test case, QA test, bug fix, check), mark its row `[~]` and set `Next action`.
2. **After** it passes its gate, mark it `[x]`, refresh `Updated`, point `Next action` at the next unit.
3. An interruption then loses at most one in-flight unit. You own your own task/test rows; the orchestrator owns the `## Stages` rows.

**Resume:** on resume you are told which rows are `[x]` — do not redo them. Resume at the first `[~]` unit, else the first `[ ]` unit under the active stage. Trust the ledger, never conversation memory.

## Stage signals

Emit exactly one when your stage ends:
- `READY` — quality gates passed (NOT the same as approved-for-next-stage).
- `GAPS FOUND` — list specific gaps + one clarification question each.
- `BLOCKED` — cannot proceed; state why.
- Implementation agents end with `[PLATFORM] TASKS COMPLETE`; checker with `CHECK PASSED`/`CHECK FAILED`; QA with `QA COMPLETE — GO`/`QA COMPLETE — NO-GO`.

## Handoff format

Always include artifact paths and locked decisions — never depend on hidden memory:

```text
Next agent: {name}
Input artifacts: {workspace paths}
Task: {one line}
Open decisions: {numbered list or "none"}
```
