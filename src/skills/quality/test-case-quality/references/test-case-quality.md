---
name: test-case-quality
description: Test case quality gates, priority levels, suite organisation, and traceability matrix
---

# Test Case Quality Gates & Organisation

## Priority Levels

| Priority | Definition | Examples |
|---|---|---|
| **P0 Critical** | App crashes, data loss, security breach, core flow broken | Login broken, payment fails |
| **P1 High** | Major feature doesn't work; workaround is difficult | Cart can't be updated |
| **P2 Medium** | Feature works but degrades experience | Wrong error message |
| **P3 Low** | Minor cosmetic issue | Typo, incorrect tooltip |

## Quality Gates

ALL of the following must pass before a test case set is marked implementation-ready:

- [ ] Every PRD acceptance criterion has at least one test case
- [ ] Happy path covered for all user stories
- [ ] At least 2 negative/error path cases per major feature
- [ ] Edge cases documented for all input fields
- [ ] P0 test cases identified for smoke test suite
- [ ] All test cases have specific, binary expected results (no "works correctly")
- [ ] Preconditions are unambiguous for all test cases
- [ ] Test data requirements documented
- [ ] Platform coverage specified for all test cases

## Evaluation Output

- `✅ READY (score: X.XX) — Test case suite meets all quality gates.`
- `⚠️ BELOW THRESHOLD (score: X.XX) — Test case suite does not meet minimum quality score. [numbered list of specific missing scenarios or vague criteria]. Escalating to human for clarification.`
- `❌ GAPS FOUND (score: X.XX) — [numbered list of specific missing scenarios or vague criteria]`

## Scoring

Each quality gate has equal weight. Compute the score as:

```
score = number of passing gates / total number of gates
```

Total gates: **9**. Each gate is worth 0.111...

**Minimum threshold: 0.9** (at least 9/9 gates must pass to reach 1.0; 8/9 = 0.889 which is below threshold).

Because each gate is worth 0.111..., the only score ≥ 0.9 is **1.0 (9/9 passed)**. Any failing gate drops the score below threshold.

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

## Test Suite Structure

```
Test Suite: [Feature Name]
├── Smoke Tests (P0 only — run on every deploy, < 5 min)
├── Regression Tests (P0 + P1 — run before release)
├── Full Test Suite (all priorities — run nightly)
└── Exploratory Testing Notes (manual, unscripted sessions)
```

## Traceability Matrix

| Test Case | User Story | Acceptance Criterion |
|---|---|---|
| TC-001 | US-01 | AC-01.1 |
| TC-002 | US-01 | AC-01.2 (error state) |
| TC-003 | US-02 | AC-02.1 |

## Automation Candidates

Flag test cases that should be automated (P0 and P1 that run frequently):

| TC ID | Framework |
|---|---|
| TC-001 | Playwright / XCUITest / Espresso |
| TC-002 | Playwright |
