# Test Cases: [Feature Name]

**Author:** Lynn (QA Lead)
**Date:** YYYY-MM-DD
**Related PRD:** workspace/PRD.md
**Related RFC:** workspace/RFC.md
**Total Test Cases:** [N]
**Smoke Suite (P0):** [N] cases

---

## Test Data Requirements

Before executing, ensure the following test data is in place:

| Data | Description | Where to Create |
|------|-------------|----------------|
| Standard user | Active account, no special permissions | [Setup instructions] |
| Admin user | Account with admin role | [Setup instructions] |
| [Other fixture] | [Description] | [Setup instructions] |

---

## Test Suite: [Feature / User Story Name]

### TC-001: [Short descriptive title — happy path]

**Priority:** P0
**Type:** Positive / Happy Path
**Platform:** Web / Android / iOS / Flutter / All
**Related:** US-01

**Preconditions:**
- User is logged in with a standard account
- [Other preconditions — precise system state]

**Test Steps:**
1. Navigate to [screen or URL]
2. [Action on specific element]
3. [Enter specific data: use concrete values, not "valid input"]
4. [Click/tap specific button]

**Expected Result:**
- [Specific, observable outcome — not "works correctly"]
- [System state change — e.g., "Record appears in the list"]
- [Performance expectation if applicable — e.g., "Response within 2 seconds"]

**Test Data:**
- Email: `test@example.com`
- Password: `TestPassword123!`

---

### TC-002: [Error path title]

**Priority:** P1
**Type:** Negative / Error Path
**Platform:** Web / All

**Preconditions:**
- [System state]

**Test Steps:**
1. [Step]
2. [Step — with invalid input: e.g., "Enter `invalid-email` in the Email field"]
3. [Step]

**Expected Result:**
- [Specific error message displayed verbatim if possible]
- [System should NOT do X]
- [User remains on the same screen]

---

### TC-003: [Edge case title]

**Priority:** P2
**Type:** Edge Case / Boundary
**Platform:** All

**Preconditions:**
- [Precise state — e.g., "User has exactly 0 items in cart"]

**Test Steps:**
1. [Step]
2. [Step with boundary value — e.g., "Enter 255 characters in the Name field (maximum allowed)"]
3. [Step]

**Expected Result:**
- [Expected boundary behavior]

---

### TC-004: [Platform-specific title]

**Priority:** P1
**Type:** Platform-Specific
**Platform:** Android

**Preconditions:**
- [Android-specific state — e.g., "Device is in portrait orientation"]

**Test Steps:**
1. [Step]
2. [Android-specific action — e.g., "Rotate device to landscape"]
3. [Step]

**Expected Result:**
- [Platform-specific expected behavior]

---

### TC-005: [Regression scenario]

**Priority:** P1
**Type:** Regression
**Platform:** Web

**Preconditions:**
- [State]

**Test Steps:**
1. [Existing flow that should still work]
2. [Step]

**Expected Result:**
- [Existing behavior preserved — confirm no regression]

---

## Automation Candidates

Test cases recommended for automation (P0 and P1):

| TC ID | Title | Framework | Priority |
|-------|-------|-----------|---------|
| TC-001 | [Title] | Playwright / XCUITest / Espresso | P0 |
| TC-002 | [Title] | Playwright | P1 |

---

## Exploratory Testing Notes

Areas for unscripted manual exploration:
- [Area 1: e.g., "Test with slow network connection (DevTools throttling)"]
- [Area 2: e.g., "Test with very long user-generated content"]
- [Area 3: e.g., "Test concurrent actions from two browser tabs"]

---

## Traceability Matrix

| Test Case | User Story | Acceptance Criterion |
|-----------|-----------|---------------------|
| TC-001 | US-01 | AC-01.1 |
| TC-002 | US-01 | AC-01.2 (error state) |
| TC-003 | US-02 | AC-02.1 |
