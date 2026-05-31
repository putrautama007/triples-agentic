# Frontend Development Knowledge

## Core Principles

1. **Component-driven development.** Build UIs as a tree of composable, reusable components.
2. **State is the enemy.** Minimize local state. Lift state when shared, externalize when global.
3. **Performance is a feature.** Users feel latency. Design for the P95 experience, not localhost.
4. **Accessible by default.** Screen reader support and keyboard navigation are not optional extras.

## Framework Guidance

### React
- Prefer functional components + hooks over class components
- `useState` for local UI state; `useReducer` for complex local state; Context / Zustand / Jotai for shared state
- Avoid prop drilling beyond 2 levels — lift to context or state manager
- Server Components (Next.js 13+): use for data-fetching; Client Components only for interactivity
- `useEffect` dependency arrays must be exhaustive — lint rule: `react-hooks/exhaustive-deps`

### Vue 3
- Composition API preferred over Options API for new code
- `ref()` for primitives, `reactive()` for objects
- Pinia for global state (not Vuex — deprecated pattern)
- `<script setup>` shorthand for all SFCs

### Angular
- Standalone components (Angular 14+) — no NgModule unless maintaining legacy
- Signals for reactive state (Angular 17+)
- Inject function over constructor injection where possible
- OnPush change detection by default for performance

## Component Design Rules

- One component = one responsibility
- Props down, events up (unidirectional data flow)
- Keep components small: if it needs a scroll to read, split it
- Naming: `UserProfileCard`, not `Card3` or `ProfileThing`
- Extract presentational components from smart/container components

## CSS Architecture

- **Utility-first (Tailwind)**: fast iteration, no CSS naming decisions, co-located styles
- **CSS Modules**: scoped styles without a framework; pairs well with React/Vue
- **BEM**: use only in large teams where Tailwind is not adopted

Avoid global CSS except for: CSS resets, font imports, CSS custom properties (tokens).

## Performance Budgets

| Metric | Target | Tool |
|---|---|---|
| Largest Contentful Paint (LCP) | < 2.5s | Lighthouse |
| First Input Delay (FID) | < 100ms | Web Vitals |
| Cumulative Layout Shift (CLS) | < 0.1 | Lighthouse |
| Bundle size (initial JS) | < 200KB gzipped | webpack-bundle-analyzer |
| Image size (hero) | < 200KB WebP | Squoosh / ImageOptim |

## State Management Decision

```
Is the state:
├── Used by one component only?          → useState / ref()
├── Used by a subtree of components?     → Context / provide-inject
├── Used app-wide, changes frequently?   → Zustand / Pinia / NgRx
└── Server data (API responses)?         → React Query / SWR / TanStack Query
```

Never use global state for server data — that's what data-fetching libraries are for.

## Routing Conventions

- File-based routing where supported (Next.js, Nuxt, SvelteKit)
- Route names map to user intent: `/dashboard`, `/settings/profile`, not `/page3`
- Lazy-load route components to reduce initial bundle
- Guard authenticated routes at the router level, not inside components

## Form Handling

- **React**: React Hook Form (minimal re-renders) + Zod for schema validation
- **Vue**: VeeValidate + Zod
- **Angular**: Reactive Forms + Zod or built-in validators
- Never submit a form without client-side validation. Never trust client-side validation on the server.

## Testing Frontend Code

- Unit test: pure functions, custom hooks, utility functions
- Component test: render component → simulate user action → assert output (Testing Library)
- E2E test: critical user flows only (login, checkout, core CRUD) — Playwright or Cypress
