---
name: defect-triage
description: Defect triage rules for severity, priority, duplicate handling, owner routing, release blocking, retest expectations, and QA evidence
---

# Defect Triage

## Purpose

Defect triage converts QA findings into actionable release decisions and owner-specific rework. A good triage record explains impact, urgency, evidence, owner, and the condition required to close the bug.

## Severity vs Priority

Severity describes user/system impact. Priority describes urgency of fixing.

| Severity | Meaning | Examples |
|---|---|---|
| Critical | Blocks core use, data integrity, security, or release | data loss, auth bypass, payment failure |
| High | Major feature broken or broad user impact | primary flow fails for common users |
| Medium | Important issue with workaround or limited scope | validation message missing, filter wrong for edge case |
| Low | Cosmetic, minor copy, or rare edge issue | alignment bug, typo without legal/product risk |

| Priority | Meaning | Fix expectation |
|---|---|---|
| P0 | Must fix before release/testing continues | immediate |
| P1 | Must fix before normal release | current cycle |
| P2 | Should fix soon; may ship with accepted risk | next planned cycle |
| P3 | Backlog/debt/polish | later |

Critical usually maps to P0. High usually maps to P1. Any mismatch must include rationale.

## Bug Report Required Fields

Every defect should include:

- Bug ID.
- Title with affected behavior.
- Severity and priority.
- Environment, platform, build/version.
- Preconditions and test data.
- Exact reproduction steps.
- Expected result.
- Actual result.
- Evidence: screenshot, log excerpt, trace, or clear observation note.
- Affected acceptance criterion or user story.
- Suspected owner: frontend, backend, Android, iOS, Flutter, design, product, test data, environment.
- Retest criteria.

## Owner Routing Rules

Route by root cause, not by where the symptom was seen:

- UI rendering, accessibility, web state → YuBin.
- API contract, data, auth, backend validation → Kaede.
- Android-only behavior → YeonJi.
- iOS-only behavior → SoHyun.
- Flutter cross-platform behavior → Kotone.
- Missing or contradictory expected behavior → JiWoo or YooYeon via SeoYeon.
- Missing screen state, content, or design instruction → HyeRin via SeoYeon.
- Test case ambiguity → Lynn.
- Environment or fixture issue → ShiOn documents and escalates to SeoYeon.

If ownership is uncertain, assign a suspected owner and mark `Needs diagnosis`; do not leave owner blank.

## Duplicate Handling

Mark as duplicate only when:

- Reproduction steps reach the same root behavior.
- Expected and actual results match the existing bug.
- Affected platform/build overlap is understood.

If the symptom is similar but platform, root cause, or impact differs, link as related instead of duplicate.

## Release Blocking Rules

No-Go if any are true:

- Any open Critical defect.
- Any P0 test case fails.
- Any High/P1 defect in a primary user flow without explicit accepted risk.
- Security, privacy, data integrity, or payment risk is unresolved.
- The build is unstable enough that QA cannot complete P0 coverage.

Go with accepted risk only when:

- The defect is Medium/Low or isolated.
- Workaround is documented.
- User/business owner explicitly accepts the risk.
- Regression scope is defined for the next fix.

## Retest Expectations

A defect can close only when:

- Original reproduction steps no longer fail.
- The affected acceptance criterion passes.
- Regression selection has been executed for nearby flows.
- Evidence is recorded in the QA report or bug file.
- Severity/priority downgrade, if any, is justified.

## Anti-Patterns

- **Priority as emotion:** raising priority because the bug is annoying without user/release impact.
- **Missing expected result:** reporting "broken" without the intended behavior.
- **Ownerless bug:** filing defects that nobody can act on.
- **Duplicate by title:** merging bugs because names are similar while root causes differ.
- **Go by optimism:** shipping with P0/P1 failures because fixes seem easy.
