---
name: regression-selection
description: Regression selection guidance for choosing retest scope after fixes, feature changes, migrations, and release-risk discoveries
---

# Regression Selection

## Purpose

Regression selection decides what to retest after a change so QA catches likely breakage without rerunning everything blindly. Scope should be based on blast radius, defect class, platform impact, and release risk.

## Inputs

Before selecting regression scope, identify:

- Changed files, components, APIs, screens, or platform modules.
- Affected user stories and acceptance criteria.
- Defect severity/priority if this is a fix.
- Dependencies touched: auth, data model, cache, navigation, payment, permissions, notifications.
- Platforms affected: web, Android, iOS, Flutter, backend.
- Existing P0/P1 test cases near the changed behavior.

## Blast Radius Levels

| Level | Meaning | Regression scope |
|---|---|---|
| Local | Isolated copy/style/component behavior | Direct test + one adjacent path |
| Feature | One user flow or screen group | P0/P1 for feature + error/edge paths |
| Subsystem | Shared service, state, API, auth, data model | Related feature suites + integration paths |
| Cross-platform | Shared design/API behavior across targets | Platform matrix for affected flow |
| Release-critical | Core journey, security, data, payment, launch risk | Full P0 smoke + targeted P1/P2 suite |

## Minimum Regression Sets

### UI state or copy fix
- Original failed test.
- Default, error, and edge state for the same screen.
- Accessibility check if visible text, focus, or labels changed.

### Frontend data-fetching fix
- Original failed test.
- Loading, error, retry, empty, and success states.
- Cache invalidation or refresh path.
- Related list/detail screens using the same data.

### Backend/API fix
- Original failed test.
- Contract tests for changed endpoint.
- Auth/permission negative test.
- Data validation and error response tests.
- One consumer flow that depends on the endpoint.

### Mobile platform fix
- Original failed test on affected device/OS.
- Nearby navigation/back behavior.
- Orientation, text scale, and dark mode when UI is involved.
- Cross-platform check if shared API/design changed.

### Data migration or schema fix
- Migration apply path.
- Existing data compatibility.
- Query path using changed fields/indexes.
- Rollback or recovery note if rollback is not executable.

### Security/auth fix
- Original failure path.
- Authorized, unauthorized, forbidden, expired-session, and wrong-tenant cases.
- Audit/logging check when required.
- Full P0 smoke if auth gates primary flows.

## Expand Rules

Expand regression scope when:

- A retest fails after the fix.
- The fix touches shared code used by multiple features.
- The defect involved data integrity, security, payments, or permissions.
- The root cause was misunderstood or owner changed during diagnosis.
- Multiple defects appear in the same subsystem.
- The change happened after human approval or close to release.

## Stop Rules

Stop targeted regression when:

- Original defect is fixed.
- Minimum regression set passes.
- No new related failures appear.
- Remaining risks are documented with owner and accepted risk if needed.

Do not stop if any P0/P1 path near the changed behavior is failing.

## Output Format

Use this section in test cases, bug retests, or QA reports:

```markdown
## Regression Scope

Blast radius: [Local / Feature / Subsystem / Cross-platform / Release-critical]
Reason: [why this scope]
Required retests:
- [test or flow]
- [test or flow]
Expand if:
- [condition]
Stop when:
- [condition]
```

## Anti-Patterns

- **Retest only the bug:** confirming the exact repro works but missing adjacent breakage.
- **Full regression by default:** wasting time without risk-based focus.
- **No platform matrix:** fixing shared behavior but testing only one target.
- **Ignoring changed dependencies:** missing auth, cache, schema, or navigation side effects.
- **Stop on first pass:** closing after one happy path while failure states remain untested.
