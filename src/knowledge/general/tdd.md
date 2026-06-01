---
name: tdd
description: Test-Driven Development (TDD) — write a failing test first, then write the minimum code to make it pass, then refactor
---

# TDD — Test-Driven Development

Write a failing test before writing any production code. Let the test drive the design.

## The Red-Green-Refactor Cycle

1. **Red** — write a test that describes the desired behavior. Run it. It must fail.
2. **Green** — write the minimum code to make the test pass. No more.
3. **Refactor** — clean up the code without changing behavior. Tests stay green.

Repeat for every new behavior.

## Rules

- Never write production code without a failing test that justifies it
- Write only enough production code to make the current failing test pass
- Never refactor while red — only clean up when tests are passing
- One failing test at a time: don't write the next test until the current one is green

## Why TDD produces better design

- Forces you to think about the interface before the implementation
- Code that is hard to test is a signal of tight coupling or unclear responsibilities — TDD surfaces this early
- The test suite becomes a living specification of what the system does
- Refactoring is safe when every behavior is covered — you move fast without breaking things

## What a good TDD test looks like

```
// Arrange — set up the inputs and context
// Act — call the unit under test
// Assert — verify the outcome

test('calculates order total with discount applied', () => {
  const order = new Order([{ price: 100, qty: 2 }]);

  const total = order.totalWithDiscount(0.1);

  expect(total).toBe(180);
});
```

- One concept per test
- Test name describes the behavior, not the implementation ("returns 180" not "calls applyDiscount")
- No logic in tests (no if/for) — tests should be trivially readable
- Tests are isolated: no shared mutable state between tests

## TDD scope

| Level | What to TDD | Examples |
|---|---|---|
| Unit | Business logic, calculations, transformations | Services, utilities, domain models |
| Integration | Interactions between components | Repository + DB, API handler + service |
| E2E | Critical user flows | Login, checkout, core happy path |

TDD is most valuable at the unit and integration levels. E2E tests are expensive to write first — write them after the feature is built to lock in the happy path.

## When NOT to apply TDD strictly

- **Exploratory / spike code** — when you don't yet know the shape of the solution, write the spike first, then delete it and TDD the real implementation
- **UI layout and styling** — visual behavior is better verified by snapshot or manual review
- **Third-party integrations** — write tests against your wrapper/adapter, not against the external API itself

## TDD and refactoring

The refactor step is not optional. Green tests without refactoring accumulates design debt. After each green:

- Remove duplication (DRY)
- Rename for clarity
- Extract if a function is doing more than one thing (SRP)
- The test suite must still be fully green after every change
