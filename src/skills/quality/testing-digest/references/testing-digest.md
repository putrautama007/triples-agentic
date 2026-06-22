---
name: testing-digest
description: Condensed testing reference — pyramid, test types, per-platform tools, anti-patterns
---

# Testing Digest

Default baseline for implementation/QA-check agents. For full depth (suite design)
open `quality/testing-strategy` or `quality/testing-types`.

## Pyramid
~70% unit (fast, pure logic) · ~20% integration (service/API boundaries) · ~10% E2E (critical flows only).

## What to test at each level
- **Unit** — business logic, data transforms, validation, state transitions, error paths, edge cases (empty/null/boundary). Skip framework internals, trivial getters, 3rd-party behavior.
- **Integration** — handler + service + real test DB (rollback per test), auth middleware + protected route, webhook + handler. Mock external APIs (MSW/WireMock/MockWebServer).
- **E2E** — login/registration, core conversion flow, critical admin ops. Keep the list short.

## Naming
`[unitOfWork]_[stateUnderTest]_[expectedBehavior]` — e.g. `login_withValidCredentials_returnsAuthToken`.

## Tools by platform
| Platform | Unit | E2E |
|---|---|---|
| Web (JS/TS) | Vitest/Jest + Testing Library | Playwright (preferred), Cypress |
| Node | Vitest/Jest + Supertest | — |
| Android | JUnit5 + Mockk, Turbine | Espresso, UIAutomator2 |
| iOS | XCTest/Swift Testing + fakes | XCUITest |
| Flutter | flutter_test + mocktail | integration_test |

## Anti-patterns (avoid)
Testing implementation not behavior · mocking everything (prefer fakes — they reveal interface misuse) · shared mutable state · sleep/wait (use await) · huge setup (code isn't testable) · no-assertion tests.

## Coverage
Target 80%+ on business logic; track **branch** coverage. 100% ≠ no bugs — test behavior, never write tests just to hit a number. (Some agents enforce a higher per-task gate, e.g. ≥90% lines — follow your own agent's gate when stated.)
