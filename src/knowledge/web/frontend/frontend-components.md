---
name: frontend-components
description: Component-driven UI development — React/Vue/Angular patterns, component design rules, and CSS architecture
---

# Frontend — Components & Frameworks

## Core Principles

1. **Component-driven development.** Build UIs as a tree of composable, reusable components.
2. **State is the enemy.** Minimize local state. Lift state when shared, externalize when global.
3. **Performance is a feature.** Users feel latency. Design for the P95 experience, not localhost.
4. **Accessible by default.** Screen reader support and keyboard navigation are not optional extras.

## Framework Conventions

### React
- Prefer functional components + hooks over class components
- `useState` for local UI state; `useReducer` for complex local state
- Avoid prop drilling beyond 2 levels — lift to context or state manager
- Server Components (Next.js 13+): use for data-fetching; Client Components only for interactivity
- `useEffect` dependency arrays must be exhaustive — lint rule: `react-hooks/exhaustive-deps`

### Vue 3
- Composition API preferred over Options API for new code
- `ref()` for primitives, `reactive()` for objects
- Pinia for global state (not Vuex)
- `<script setup>` shorthand for all SFCs

### Angular
- Standalone components (Angular 14+) — no NgModule unless maintaining legacy
- Signals for reactive state (Angular 17+)
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
