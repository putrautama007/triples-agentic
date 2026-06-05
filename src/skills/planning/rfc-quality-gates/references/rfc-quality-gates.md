---
name: rfc-quality-gates
description: RFC quality gate checklist, anti-patterns, and evaluation criteria for implementation readiness
---

# RFC Quality Gates & Anti-Patterns

## Quality Gates

ALL of the following must pass before an RFC is marked implementation-ready:

- [ ] **Architecture decision** — the chosen approach is stated clearly with a rationale
- [ ] **Alternatives documented** — at least 2 alternatives considered and rejected with reasoning
- [ ] **Data model** — entities and relationships defined (even if approximate)
- [ ] **API contracts** — public interfaces defined with request/response shapes
- [ ] **Risk assessment** — at least one risk identified with a mitigation
- [ ] **Rollback plan** — how to undo this change if it goes wrong
- [ ] **No scope creep** — RFC stays within the bounds of the approved PRD
- [ ] **Open questions closed** — no unresolved technical blockers before handoff

## Evaluation Output

Run all gates and output exactly one of:

- `✅ READY (score: X.XX) — RFC meets all quality gates.`
- `⚠️ BELOW THRESHOLD (score: X.XX) — RFC does not meet minimum quality score. [numbered list of failing gates with specific technical questions to resolve]. Escalating to human for clarification.`
- `❌ GAPS FOUND (score: X.XX) — [numbered list of failing gates with specific technical questions to resolve]`

## Scoring

Each quality gate has equal weight. Compute the score as:

```
score = number of passing gates / total number of gates
```

Total gates: **8**. Each gate is worth 0.125.

**Minimum threshold: 0.9** (at least 8/8 gates must pass to reach 1.0; 7/8 = 0.875 which is below threshold).

Because each gate is worth 0.125, the only score ≥ 0.9 is **1.0 (8/8 passed)**. Any failing gate drops the score below threshold.

### Reiteration Rule

If score < 0.9:
1. The agent MUST NOT output `READY`.
2. The agent MUST identify which gates failed and why.
3. The agent MUST immediately escalate to the human — do NOT silently auto-revise.
4. Present the failing gates as specific, numbered questions the human needs to clarify or decide on:
   > "**[Agent name] evaluation scored X.XX/1.00 (minimum: 0.9). The following gates need your input to improve the score:**
   > 1. [Failing gate — specific question to resolve]
   > 2. [Failing gate — specific question to resolve]
   >
   > Please clarify so I can revise and re-evaluate."
5. Wait for human response.
6. Revise the artifact incorporating the human's clarifications.
7. Re-run Evaluate. If score ≥ 0.9, proceed to human approval gate. If score still < 0.9, repeat from step 3.

## Anti-Patterns to Avoid

| Anti-Pattern | Problem | Fix |
|---|---|---|
| "We'll figure out the DB schema later" | Blocks task estimation | Design the schema now, mark as draft |
| RFC written after code is done | Not a design doc, a post-mortem | Write RFC before implementation |
| No alternatives section | Appears like the first idea was the only idea | Always document what was rejected |
| "Industry standard approach" without citation | Vague justification | Name the standard and link to it |
| Mixing security concerns into every section | Hard to review | Dedicated security section |
| Rollout plan missing | No way to safely deploy | Always include feature flag + rollback |
| Vague risk ("could be slow") | Not actionable | Quantify: "p95 > 500ms under 1000 RPS" |
