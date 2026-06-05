---
name: qa-reporting
description: Bug report format, go/no-go release criteria, automation strategy, and QA metrics
---

# QA Reporting & Release Criteria

## Bug Report Format

```markdown
## BUG-[ID]: [Short descriptive title]

**Severity:** Critical | High | Medium | Low
**Priority:** P0 | P1 | P2 | P3
**Status:** Open | In Progress | Fixed | Verified | Won't Fix
**Platform:** Web Chrome 120 / Android 14 / iOS 17.2 / Flutter
**Build/Version:** [build number or commit SHA]

### Steps to Reproduce
1. [Exact step]
2. [Exact step]

### Expected Result
[What should have happened]

### Actual Result
[What actually happened — error messages verbatim]

### Evidence
[Screenshot, screen recording, log output]

### Notes
[Frequency: always/intermittent; related issues]
```

## Go/No-Go Criteria

### Ship (Go)
- All P0 test cases: PASS
- All P1 test cases: PASS or accepted risk documented
- No Critical or High severity bugs open without explicit sign-off
- Regression tests: PASS

### Do Not Ship (No-Go)
- Any P0 test case FAIL without a valid workaround
- Any Critical severity bug open
- High severity bug count above team's defined threshold
- Core user flow (login, purchase, core CRUD) broken

Document every No-Go with: failing test cases, severity, estimated fix time, and what would change the recommendation.

## Automation Strategy

**Automate when**:
- Test case is P0 or P1
- Test runs more than once per sprint
- Test is time-consuming but fully deterministic

**Keep manual when**:
- Exploratory or visual testing
- Test requires subjective judgment
- Feature is likely to change soon (automate after stabilization)

## QA Metrics

| Metric | Target | Notes |
|---|---|---|
| Defect detection rate | > 90% before production | % found by QA vs users |
| Test case pass rate | > 95% before release | Track per sprint for trends |
| Bug re-open rate | < 10% | Indicates fix quality issues |
| Mean time to verify fix | < 1 day | Blockers should not sit |
