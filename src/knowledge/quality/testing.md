# Testing Knowledge — Principles & Strategies

## Testing Pyramid

```
        /\
       /  \    E2E Tests (few, slow, expensive)
      /----\   — Critical user flows only
     /      \
    /--------\  Integration Tests (some, medium speed)
   /          \ — Service boundaries, API contracts
  /------------\ Unit Tests (many, fast, cheap)
 /              \— Pure functions, business logic, utilities
```

**Rule of thumb**: 70% unit, 20% integration, 10% E2E.

## Test Naming Convention

```
[unit_of_work]_[state_under_test]_[expected_behavior]
```

Examples:
- `login_withValidCredentials_returnsAuthToken()`
- `cart_whenItemAdded_totalUpdatesCorrectly()`
- `formatCurrency_withNegativeValue_showsMinusSign()`

## Unit Tests

Test a single function/class in complete isolation. Use mocks/stubs for dependencies.

**What to unit test**:
- Business logic functions
- Data transformation / mapping functions
- Input validation rules
- State machine transitions
- Error handling paths
- Edge cases (empty input, null, boundary values)

**What NOT to unit test**:
- Framework code (don't test that React renders a div)
- Constants / configuration values
- Simple getters/setters with no logic
- Third-party library internals

## Integration Tests

Test that two or more components work together correctly.

**What to integration test**:
- API endpoint handler + service + database (with real DB in test mode)
- Authentication middleware + protected route
- Webhook receiver + event handler

**Common patterns**:
- Test DB: use a real DB (not mocked) with test fixtures; rollback after each test
- Mock external APIs: WireMock, MSW, MockWebServer
- Test data factories: generate realistic test objects (Faker, Factory Bot pattern)

## E2E Tests

Test a complete user flow from UI to database.

**What to E2E test** (keep the list short):
- Login / registration flow
- Core purchase / conversion flow
- Critical admin operations
- Signup → first meaningful action (activation flow)

**Tools**:
- Web: Playwright (preferred), Cypress
- Android: Espresso, UIAutomator
- iOS: XCUITest
- Flutter: integration_test package

## Test Doubles

| Type | Description | Use when |
|---|---|---|
| **Stub** | Returns fixed value | Predictable output needed (dates, IDs) |
| **Mock** | Verifies interactions | Testing that a method was called with right args |
| **Fake** | Working implementation | Need realistic behavior without real dependency (in-memory DB) |
| **Spy** | Wraps real object | Verify calls while keeping real behavior |

Prefer **fakes** over **mocks** — they reveal interface misuse, mocks can pass when the contract is wrong.

## Test Coverage

- Target: 80%+ line coverage for business logic
- 100% coverage does NOT mean no bugs — coverage tests that code runs, not that it's correct
- Track branch coverage, not just line coverage
- Never write tests just to hit a coverage number — test behavior, not lines

## Testing Anti-Patterns

| Anti-Pattern | Problem |
|---|---|
| Testing implementation, not behavior | Tests break on refactoring, not on bugs |
| Mocking everything | Tests pass but production still fails |
| Shared mutable state between tests | Flaky tests, order-dependent failures |
| Sleep/wait in tests | Slow and flaky — use await/callbacks instead |
| Huge test setup | Indicates code is not testable — refactor |
| No assertion in test | Test always passes — caught by linting rules |

## Shift-Left Testing

Testing starts at requirements, not after development:
1. Review acceptance criteria during PRD phase
2. Write test cases before (or alongside) implementation
3. Run unit tests in pre-commit hooks
4. Run integration tests in CI on every PR
5. E2E tests run nightly or before every release
