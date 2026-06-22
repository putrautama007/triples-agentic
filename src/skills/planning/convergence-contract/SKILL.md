---
name: convergence-contract
description: "Worker-agent slice of the convergence loop — run-state ledger format, resume rule, and stage signals. Use when a developer, checker, or QA agent needs the handoff/resume contract without the full orchestration loop. Do not use as an implementation agent."
---

# Convergence Contract

## Purpose
Use this skill as just-in-time reference material for the worker-agent side of the TripleS convergence loop — the run-state ledger and stage signals. The full scored loop lives in `planning/convergence-loop.md` and is owned by the orchestrator.

## Procedure
1. Read `references/convergence-contract.md` when you need the ledger format, resume rule, or handoff/signal shape.
2. Keep `workspace/RUN_STATE.md` current per the write rule — flush after every unit.
3. Emit your stage signal exactly as specified; the orchestrator owns routing and scoring.

## Reference
- `references/convergence-contract.md`
