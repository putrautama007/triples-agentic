---
name: frontend-state
description: Frontend state management decision guide, routing conventions, and form handling patterns
---

# Frontend — State, Routing & Forms

## State Management Decision

```
Is the state:
├── Used by one component only?          → useState / ref()
├── Used by a subtree of components?     → Context / provide-inject
├── Used app-wide, changes frequently?   → Zustand / Pinia / NgRx
└── Server data (API responses)?         → React Query / SWR / TanStack Query
```

Never use global state for server data — that's what data-fetching libraries are for.

## Recommended Libraries

| Need | React | Vue 3 | Angular |
|---|---|---|---|
| Server state | TanStack Query / SWR | VueQuery | NgRx/data or custom |
| Global client state | Zustand / Jotai | Pinia | NgRx |
| Forms | React Hook Form + Zod | VeeValidate + Zod | Reactive Forms |
| Routing | React Router / Next.js | Vue Router / Nuxt | Angular Router |

## Routing Conventions

- File-based routing where supported (Next.js, Nuxt, SvelteKit)
- Route names map to user intent: `/dashboard`, `/settings/profile`, not `/page3`
- Lazy-load route components to reduce initial bundle
- Guard authenticated routes at the router level, not inside components

## Form Handling

- **React**: React Hook Form (minimal re-renders) + Zod for schema validation
- **Vue**: VeeValidate + Zod
- **Angular**: Reactive Forms + Zod or built-in validators
- Never submit a form without client-side validation
- Never trust client-side validation on the server — validate both sides

## Data Fetching Patterns

```typescript
// React Query example
const { data, isLoading, error } = useQuery({
  queryKey: ['users', userId],
  queryFn: () => fetchUser(userId),
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Mutation
const mutation = useMutation({
  mutationFn: updateUser,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
});
```
