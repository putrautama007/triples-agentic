---
name: test-case-writing
description: Test case format, types (positive/negative/edge/boundary), and writing principles for reproducible test cases
---

# Test Case Writing

## What Is a Test Case

A test case is a documented procedure that verifies whether a specific feature or behavior works as expected. It is the contract between QA and development.

A well-written test case is:
- **Specific**: one scenario per test case
- **Reproducible**: anyone can run it and get the same result
- **Independent**: does not depend on the result of another test case
- **Traceable**: linked back to a requirement or user story

## Test Case Format

```markdown
## TC-[ID]: [Short descriptive title]

**Related Requirement:** [PRD section / User Story ID]
**Priority:** P0 (Critical) | P1 (High) | P2 (Medium) | P3 (Low)
**Type:** Functional | UI | Performance | Security | Accessibility
**Platform:** Web | Android | iOS | Flutter | All

### Preconditions
State the system must be in before the test begins.
- User is logged in with a standard account

### Test Steps
1. Navigate to [screen/URL]
2. Perform [action] on [element]
3. Enter [specific data — not "valid input", use real values like test@example.com]

### Expected Result
What the system SHOULD do after the steps above.
- Screen displays "Order confirmed" message
- Email sent within 30 seconds
- Order appears in history with status "Pending"

### Status
[ ] Pass | [ ] Fail | [ ] Blocked | [ ] Skipped
```

## Test Types

### Positive (Happy Path)
Tests the intended workflow with valid inputs.
- User logs in with valid credentials → lands on dashboard

### Negative (Error Paths)
Tests what happens with invalid inputs or unexpected actions.
- User logs in with wrong password → error message shown

### Edge Cases
Tests boundaries and unusual but valid scenarios.
- User enters maximum allowed characters (255) in a field
- User has 0 items in cart and attempts checkout

### Boundary Testing
Tests exact boundary values:
- Min: field minimum = 1 char → enter 1 (pass), enter 0 (fail)
- Max: field max = 255 chars → enter 255 (pass), enter 256 (fail)

### Regression Tests
Tests that previously working functionality has not broken after a change.

## Writing Principles

1. **Write for someone who has never seen the feature.** No assumed context.
2. **One expected result per test case.** If you have "and then", split the test.
3. **Be specific about data.** "Enter a valid email" is worse than "Enter `test@example.com`".
4. **Distinguish UI state from system state.** "Button becomes disabled" (UI) vs "Record is saved to DB" (system).
5. **Link every test case to a requirement.** Orphaned test cases are usually outdated.
