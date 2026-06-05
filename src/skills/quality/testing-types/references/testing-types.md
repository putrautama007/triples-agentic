---
name: testing-types
description: Unit, integration, and E2E test types — what to test, recommended tools, and platform-specific frameworks
---

# Testing Types & Tools

## Unit Tests

Test a single function/class in complete isolation. Use mocks/stubs for dependencies.

**What to unit test**:
- Business logic functions
- Data transformation / mapping functions
- Input validation rules
- State machine transitions
- Error handling paths
- Edge cases (empty, null, boundary values)

**What NOT to unit test**:
- Framework internals
- Simple getters/setters with no logic
- Third-party library behaviour

### Tools by Platform

| Platform | Framework | Assertion / Mocking |
|---|---|---|
| Web (JS/TS) | Vitest / Jest | Testing Library, Mockito |
| Node.js | Vitest / Jest | Supertest (HTTP) |
| Android | JUnit 5 | Mockk, Turbine (Flow) |
| iOS | XCTest / Swift Testing | Protocols + fakes |
| Flutter | flutter_test | mockito / mocktail |

## Integration Tests

Test that two or more components work correctly together.

**What to integration test**:
- API endpoint handler + service + database (real DB in test mode)
- Authentication middleware + protected route
- Webhook receiver + event handler

**Common patterns**:
- **Test DB**: real DB with test fixtures; rollback after each test
- **Mock external APIs**: WireMock, MSW, MockWebServer, http.Client mock

## E2E Tests

Test a complete user flow from UI to database.

**What to E2E test** (keep the list short):
- Login / registration flow
- Core purchase / conversion flow
- Critical admin operations
- Signup → first meaningful action

**Tools by Platform**

| Platform | Tool |
|---|---|
| Web | Playwright (preferred), Cypress |
| Android | Espresso, UIAutomator2 |
| iOS | XCUITest |
| Flutter | integration_test + flutter_driver |
| API / Contract | Postman / Newman, REST-assured |

## Test Data Factories

Generate realistic test data:

```typescript
// TypeScript example
function createUser(overrides: Partial<User> = {}): User {
  return {
    id: crypto.randomUUID(),
    email: 'test@example.com',
    name: 'Test User',
    ...overrides,
  };
}
```

Never reuse test data between tests — each test should set up its own state.
