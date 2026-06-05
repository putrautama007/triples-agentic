---
name: prd-quality-gates
description: PRD quality gate checklist, anti-patterns to avoid, and pass/fail evaluation criteria
---

# PRD Quality Gates & Anti-Patterns

## Quality Gates

ALL of the following must pass before a PRD is marked implementation-ready:

- [ ] **Problem statement** — clear, specific, one paragraph, explains user pain
- [ ] **Primary persona** — at least one user persona defined with goals and context
- [ ] **Feature scope** — both in-scope AND out-of-scope explicitly stated
- [ ] **User stories** — at least 3 stories covering core journeys
- [ ] **Acceptance criteria** — every major feature has measurable pass/fail criteria (no vague "works well")
- [ ] **Success metrics** — at least one quantitative metric defined
- [ ] **No implementation leak** — PRD does not prescribe tech stack, architecture, or database choices
- [ ] **Open questions addressed** — no blockers left unanswered before handoff

## Evaluation Output

Run all gates and output exactly one of:

- `✅ READY (score: X.XX) — PRD meets all quality gates.`
- `⚠️ BELOW THRESHOLD (score: X.XX) — PRD does not meet minimum quality score. [numbered list of failing gates with specific questions to resolve]. Escalating to human for clarification.`
- `❌ GAPS FOUND (score: X.XX) — [numbered list of failing gates with specific questions to resolve]`

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

| Anti-Pattern | Why It's Wrong | Fix |
|---|---|---|
| "The system should be fast" | Not measurable | "Page load under 2s on 3G" |
| "Use React for the frontend" | PRD prescribes implementation | Move to RFC |
| "TBD" on acceptance criteria | Engineers can't test against TBD | Resolve before handoff |
| Features listed without personas | No context for priority decisions | Add who benefits and why |
| 40-page PRD for an MVP | Overspecification kills agility | Cut to what's needed for v1 |
| "And" in a user story | Too many concerns in one story | Split into separate stories |
| Acceptance criteria with "should" | "Should" is not binary | Use "must" or rewrite as Given/When/Then |
