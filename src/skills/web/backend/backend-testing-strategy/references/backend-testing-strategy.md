---
name: backend-testing-strategy
description: Backend testing strategy for services, APIs, contracts, integrations, migrations, auth, error paths, and operational behavior
---

# Backend Testing Strategy

## Purpose

Backend tests prove that business rules, API contracts, data changes, security boundaries, and operational failure paths behave as intended. They should catch regressions before QA finds them manually.

## Test Pyramid

| Layer | Purpose | Examples |
|---|---|---|
| Unit | Pure business logic and validation | service functions, policy checks, mappers |
| Contract | Public API shapes and error contracts | request/response schema, status codes |
| Integration | Real boundaries with controlled dependencies | database, queue, cache, auth middleware |
| Migration | Schema/data evolution safety | migrate up/down, seed compatibility |
| End-to-end smoke | Critical path confidence | create account, authenticate, complete core transaction |

Favor many fast unit/contract tests, enough integration tests to prove boundaries, and a small set of high-value smoke tests.

## Coverage Checklist

For each backend task, cover:

- [ ] Happy path for each acceptance criterion.
- [ ] Input validation at API boundaries.
- [ ] Authorization and permission failures.
- [ ] Authentication expiry or missing credentials.
- [ ] Not-found, conflict, and duplicate cases.
- [ ] External dependency failure or timeout.
- [ ] Database constraint and transaction behavior.
- [ ] Pagination, filtering, sorting, and limits when applicable.
- [ ] Structured error shape and status code contract.
- [ ] Logging/metrics side effects when operationally important.

## API Contract Tests

API tests should assert:

- Endpoint method and path.
- Required headers and auth boundary.
- Request schema and validation failures.
- Response schema for success and error paths.
- Status codes and stable error identifiers.
- Pagination metadata and cursor behavior.
- Backward compatibility for public clients.

## Data and Migration Tests

Use migration tests when a change adds or modifies schema, indexes, constraints, or seed data.

Check:

- Migration applies cleanly to current schema.
- Rollback path is documented or tested when supported.
- Required indexes exist for common query paths.
- Nullability/defaults protect existing rows.
- Unique and foreign-key constraints match domain rules.
- Data backfill handles empty, partial, and malformed legacy data.

## Test Data Rules

- Use minimal fixtures that name the behavior under test.
- Avoid shared mutable fixtures across tests.
- Prefer factory helpers over large static blobs.
- Include boundary values and invalid values, not only typical examples.
- Keep secrets and production identifiers out of fixtures.

## Reliability and Operations

For production-critical services, test or review:

- Retry policy for idempotent external calls.
- No retry for unsafe non-idempotent calls unless an idempotency key exists.
- Timeout behavior and fallback response.
- Correlation ID propagation.
- No PII/secrets in logs.
- Health check behavior for dependencies.

## Anti-Patterns

- **Controller-only tests:** testing HTTP handlers while business rules remain untested.
- **Mocking the database everywhere:** missing transaction, constraint, and query issues.
- **Snapshot API contracts:** hiding meaningful response changes in broad snapshots.
- **Happy-path auth:** testing success while skipping forbidden, expired, and wrong-tenant cases.
- **Unowned migrations:** schema changes with no safety test or rollback note.
- **Flaky integration:** relying on external network services instead of controlled fakes or test containers.
