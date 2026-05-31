# Test Case Writing Knowledge

## What Is a Test Case

A test case is a documented procedure that verifies whether a specific feature or behavior works as expected. It is the contract between QA and development.

A well-written test case is:
- **Specific**: one scenario per test case
- **Reproducible**: anyone can run it and get the same result
- **Independent**: does not depend on the result of another test case
- **Traceable**: linked back to a requirement or user story

## Test Case Structure

```markdown
## TC-[ID]: [Short descriptive title]

**Related Requirement:** [PRD section / User Story ID]
**Priority:** P0 (Critical) | P1 (High) | P2 (Medium) | P3 (Low)
**Type:** Functional | UI | Performance | Security | Accessibility
**Platform:** Web | Android | iOS | Flutter | All

### Preconditions
State the system must be in before the test begins.
- User is logged in with a standard account
- Cart has at least one item
- Network connection is available

### Test Steps
1. Navigate to [screen/URL]
2. Perform [action] on [element]
3. Enter [data] into [field]
4. Click/tap [button]

### Expected Result
What the system SHOULD do after the steps above.
- Screen displays "Order confirmed" message
- Email notification is sent within 30 seconds
- Order appears in user's order history with status "Pending"

### Actual Result
[Filled in during test execution]

### Status
[ ] Pass | [ ] Fail | [ ] Blocked | [ ] Skipped

### Notes / Evidence
[Screenshots, logs, or reproduction steps for failures]
```

## Priority Levels

| Priority | Definition | Examples |
|---|---|---|
| **P0 Critical** | App crashes, data loss, security breach, core flow broken | Login broken, payment fails, data disappears |
| **P1 High** | Major feature doesn't work; workaround is difficult | Cart can't be updated, search returns no results |
| **P2 Medium** | Feature works but degrades experience | Wrong error message, UI misalignment |
| **P3 Low** | Minor cosmetic issue | Typo, incorrect tooltip, minor visual glitch |

## Test Types

### Positive (Happy Path)
Tests the intended workflow with valid inputs:
- User logs in with valid credentials → lands on dashboard

### Negative (Error Paths)
Tests what happens with invalid inputs or unexpected actions:
- User logs in with wrong password → error message shown, account not locked

### Edge Cases
Tests boundaries and unusual but valid scenarios:
- User enters maximum allowed characters in a field
- User has 0 items in cart and attempts checkout
- User session expires during checkout

### Boundary Testing
Tests values at the exact boundary of valid/invalid ranges:
- Min: field minimum = 1 character → enter 1 character (pass), enter 0 (fail)
- Max: field max = 255 characters → enter 255 (pass), enter 256 (fail)

### Regression Tests
Tests that previously working functionality has not broken:
- Maintained separately; re-run after every release
- Automate regression tests for P0/P1 scenarios

## Test Suite Structure

```
Test Suite: [Feature Name]
├── Smoke Tests (P0 only — run on every deploy, takes < 5 min)
├── Regression Tests (P0 + P1 — run before release)
├── Full Test Suite (all priorities — run nightly)
└── Exploratory Testing Notes (manual, unscripted sessions)
```

## Quality Gates for Test Cases

ALL of the following must pass before a test case set is marked implementation-ready:

- [ ] Every PRD acceptance criterion has at least one test case
- [ ] Happy path covered for all user stories
- [ ] At least 2 negative/error path cases per feature
- [ ] Edge cases documented for all input fields
- [ ] P0 test cases identified and marked for smoke suite
- [ ] Regression risk areas identified from RFC/architecture
- [ ] Platform-specific cases noted (if multi-platform)
- [ ] Test data requirements documented (what fixtures are needed)

## Writing Principles

1. **Write for someone who has never seen the feature.** No assumed context.
2. **One expected result per test case.** If you have "and then" in the expected result, split the test case.
3. **Be specific about data.** "Enter a valid email" is worse than "Enter `test@example.com`".
4. **Distinguish UI state from system state.** "Button becomes disabled" (UI) vs "Record is saved to database" (system).
5. **Link every test case to a requirement.** Orphaned test cases are usually outdated.
