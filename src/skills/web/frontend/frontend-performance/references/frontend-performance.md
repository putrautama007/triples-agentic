---
name: frontend-performance
description: Frontend performance budgets, Core Web Vitals targets, bundle optimization, and frontend testing strategies
---

# Frontend — Performance & Testing

## Performance Budgets

| Metric | Target | Tool |
|---|---|---|
| Largest Contentful Paint (LCP) | < 2.5s | Lighthouse |
| First Input Delay (FID) | < 100ms | Web Vitals |
| Cumulative Layout Shift (CLS) | < 0.1 | Lighthouse |
| Bundle size (initial JS) | < 200KB gzipped | webpack-bundle-analyzer |
| Image size (hero) | < 200KB WebP | Squoosh / ImageOptim |

## Bundle Optimization

- Code-split at the route level — each route loads only its own JS
- Tree-shake unused exports (ensure your bundler config enables it)
- Audit bundle size before merging large dependency additions
- Prefer lighter alternatives: `date-fns` over `moment`, `zod` over `yup`

## Render Performance

- Avoid unnecessary re-renders: use `memo`, `useMemo`, `useCallback` only when measured, not preemptively
- Use `React.lazy` / dynamic imports for below-fold components
- Use `ListView.builder` pattern (virtual list) for large dynamic lists
- Avoid inline object/function creation in JSX that defeats memoization

## Testing Frontend Code

- **Unit test**: pure functions, custom hooks, utility functions
- **Component test**: render component → simulate user action → assert output (Testing Library)
- **E2E test**: critical user flows only (login, checkout, core CRUD) — Playwright or Cypress

### Testing Library Principles
- Query by role, label, or text — not by CSS class or test ID
- Test what the user sees, not implementation details
- `getByRole('button', { name: /submit/i })` not `getByTestId('submit-btn')`
