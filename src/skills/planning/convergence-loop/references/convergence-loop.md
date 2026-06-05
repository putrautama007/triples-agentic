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
   - If `GAPS FOUND`: ask the user specific questions to resolve the gaps, then revise and re-evaluate.
   - If `READY`: present the artifact summary and ask the user for explicit approval. Do NOT proceed until the user approves.
5. **Revise** — incorporate decisions, preserve approved sections, and record meaningful changes.
6. **Repeat** — continue Review → Evaluate → Human review until the user explicitly approves the artifact.

**Critical rule:** `READY` means quality gates passed. It does NOT mean the artifact is approved for the next stage. The orchestrator must always stop and wait for explicit human approval before delegating the next agent.

**Scoring rule:** For PRD, RFC, and Test Case artifacts, the agent must compute and report a quality score (0.0–1.0). If score < 0.9, the agent must escalate to the human with one specific clarification question per failing gate. Do not revise the artifact until the human answers. After the human clarifies, revise and re-evaluate. Only artifacts with score ≥ 0.9 proceed to the final human approval gate.

## Stage Gates

| Stage | Owner | Artifact | Ready Signal |
|---|---|---|---|
| PRD | JiWoo | `workspace/PRD.md` | `PRD APPROVED` |
| Design | HyeRin | `workspace/DESIGN_SPEC.md` | `DESIGN APPROVED` |
| RFC | YooYeon | `workspace/RFC.md` | `RFC APPROVED` |
| Tasks | NaKyoung | `workspace/TASK_BREAKDOWN.md` | `TASKS APPROVED` |
| Test Cases | Lynn | `workspace/TEST_CASES.md` | `TEST CASES APPROVED` |
| Implementation | Developer agents | source files + test output | `[PLATFORM] TASKS COMPLETE` |
| QA | ShiOn | `workspace/QA_REPORT.md` + `workspace/BUGS/*.md` | `QA COMPLETE — GO` or `QA COMPLETE — NO-GO` |

## Cross-Platform Invocation Contract

Claude Code may expose agents as slash commands. Codex exposes them as skills. The orchestrator should write handoffs in both forms so either tool can continue the run.

Use this format:

```text
Next agent: JiWoo PRD
Claude: /jiwoo-prd
Codex: Use $jiwoo-prd
Input artifacts: workspace/PRD.md
Task: Review and revise until READY.
Open decisions: [numbered list or "none"]
```

Do not depend on hidden conversation memory. Every handoff must include artifact paths and locked decisions.

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
