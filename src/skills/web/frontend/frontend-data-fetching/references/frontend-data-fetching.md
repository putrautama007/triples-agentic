---
name: frontend-data-fetching
description: Frontend data-fetching guidance for async UI states, cache boundaries, retries, invalidation, optimistic updates, and API error handling
---

# Frontend Data Fetching

## Purpose

Frontend data fetching turns API contracts into user-visible states. A good implementation makes remote data predictable, recoverable, accessible, and testable.

This guidance applies to web UI work using tools such as TanStack Query, SWR, framework loaders, GraphQL clients, or equivalent data libraries.

## Data Ownership

Separate state by ownership:

| State type | Owner | Examples |
|---|---|---|
| Server state | API/cache layer | user profile, orders, notifications |
| Client UI state | component or client store | dialog open, selected tab, draft filter |
| Form state | form library/component | dirty fields, validation, submission status |
| URL state | router | page, sort, filters that should be shareable |

Do not copy server state into global client state unless there is a specific synchronization reason.

## Query Checklist

For every remote read:

- [ ] Loading, success, empty, error, and retry states are rendered.
- [ ] Request key includes every input that changes the result.
- [ ] Cache lifetime matches data volatility and user expectations.
- [ ] Stale data behavior is intentional and visible when needed.
- [ ] Pagination or infinite loading handles first, next, last, and empty pages.
- [ ] Error handling distinguishes user-correctable, auth, permission, network, and server failures when the API supports it.
- [ ] Accessibility announcements exist for significant async status changes.

## Mutation Checklist

For every remote write:

- [ ] Submit state prevents duplicate unsafe submissions.
- [ ] Validation errors map to fields when possible.
- [ ] Success state confirms the result or navigates intentionally.
- [ ] Failure state preserves user input unless security requires clearing it.
- [ ] Cache invalidation updates every affected query.
- [ ] Optimistic updates include rollback behavior.
- [ ] Destructive mutations include confirmation and clear consequence copy.

## Cache and Invalidation Rules

- Invalidate by affected resource, not by unrelated screen.
- Prefer refetching canonical data after important writes unless latency requires optimistic UI.
- Keep cache keys stable and colocated with the query definition.
- Do not let one screen depend on another screen's mounted query to be correct.
- Use URL state for shareable filters; use local state for purely visual filters.

## Error Handling

Use error categories instead of one generic failure path:

| Category | UI response |
|---|---|
| Network unavailable | Offline/retry message; preserve current content if safe |
| Unauthorized | Route to sign-in or refresh session path |
| Forbidden | Explain missing permission; avoid retry loops |
| Not found | Empty/not-found state with safe navigation |
| Validation | Field-level errors and form summary |
| Conflict | Show stale data/conflict resolution path |
| Server error | Retry or support path; avoid exposing internal details |

## Skeletons and Loading

- Use skeletons for repeatable content layout.
- Use spinners for short unknown waits where layout is not known.
- Avoid replacing existing usable content with a blank loading state during background refresh.
- Indicate background refresh subtly when stale content remains visible.

## Testing Targets

At minimum, test:

- Initial loading → success.
- Loading → empty.
- Loading → error → retry → success.
- Mutation success with cache update.
- Mutation validation error with preserved input.
- Duplicate-submit prevention.
- Optimistic update rollback when used.

## Anti-Patterns

- **Cache as business logic:** using cache state to decide permissions or server truth.
- **Global everything:** storing all fetched data in app-wide state.
- **Silent stale UI:** mutation succeeds but affected lists/details do not update.
- **Spinner-only UX:** no empty, retry, or error state.
- **Retry storm:** automatic retries for permission, validation, or destructive failures.
- **Lost form input:** clearing user-entered data on recoverable submission errors.
