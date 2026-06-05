---
name: testing-strategy
description: Testing pyramid, shift-left testing, test naming conventions, and common testing anti-patterns
---

# Testing Strategy

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

## Shift-Left Testing

Testing starts at requirements, not after development:
1. Review acceptance criteria during PRD phase
2. Write test cases before (or alongside) implementation
3. Run unit tests in pre-commit hooks
4. Run integration tests in CI on every PR
5. E2E tests run nightly or before every release

## Testing Anti-Patterns

| Anti-Pattern | Problem |
|---|---|
| Testing implementation, not behavior | Tests break on refactoring, not on bugs |
| Mocking everything | Tests pass but production still fails |
| Shared mutable state between tests | Flaky tests, order-dependent failures |
| Sleep/wait in tests | Slow and flaky — use await/callbacks instead |
| Huge test setup | Indicates code is not testable — refactor |
| No assertion in test | Test always passes — caught by linting |

## Test Doubles

| Type | Description | Use when |
|---|---|---|
| **Stub** | Returns fixed value | Predictable output needed |
| **Mock** | Verifies interactions | Testing that a method was called |
| **Fake** | Working implementation | Need realistic behavior (in-memory DB) |
| **Spy** | Wraps real object | Verify calls while keeping real behavior |

Prefer **fakes** over **mocks** — they reveal interface misuse; mocks can pass when the contract is wrong.

## Coverage

- Target: 80%+ line coverage for business logic
- Track **branch** coverage, not just line coverage
- 100% coverage does NOT mean no bugs
- Never write tests just to hit a number — test behavior, not lines
