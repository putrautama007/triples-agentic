---
name: design-system
description: Design system principles, token architecture, component taxonomy, and documentation standards for scalable UI foundations
---

# Design System

## Core Principle
A design system is a shared language between design and engineering — not a component library, not a style guide alone, but both working together at every level.

## Design Token Architecture

Tokens are named design decisions organized in three tiers:

```
Global Tokens (primitives)
  → Semantic Tokens (intent)
    → Component Tokens (component-level overrides)
```

### Global tokens
Raw values: `color.blue.500 = #3B82F6`, `spacing.4 = 16px`. Never reference these directly in components.

### Semantic tokens
Intent-based names: `color.interactive.primary = {color.blue.500}`, `spacing.inset.md = {spacing.4}`. These are what components consume.

### Component tokens
Component-specific overrides: `button.background.primary = {color.interactive.primary}`. Only used when a component truly diverges from semantic defaults.

## Component Taxonomy
- **Primitives** — Text, Icon, Divider, Spacer; no logic; pure display
- **Elements** — Button, Input, Checkbox, Badge, Avatar; single-purpose, self-contained
- **Patterns** — Form Group, Navigation Item, Card; composed from elements; define layout
- **Layouts** — Page Shell, Sidebar, Header, Modal; structural scaffolding; never carry content logic
- **Templates** — full page arrangements assembled from layouts + patterns

## Component Contract
Every component must define:
- **Props API** — all properties, types, defaults, required vs optional
- **Variants** — all visual states as documented examples (size, intent, state)
- **Accessibility** — ARIA role, keyboard behavior, focus management
- **Token map** — which design tokens control which visual properties
- **Do / Don't** — explicit usage examples

## Documentation Standards
Each component doc includes:
- Intent: what problem this component solves and when to use it
- All variants with live examples
- Props table
- Accessibility checklist
- Do / Don't guidance
- Related components

## Versioning and Change Management
- Additive changes → minor version
- Breaking API changes → major version with migration guide
- Visual changes to tokens → documented as breaking if semantic meaning changes

## Design System Checklist
- [ ] Token names describe intent, not value
- [ ] No magic numbers in component definitions
- [ ] All components have all interaction states (hover, focus, disabled, error)
- [ ] Color tokens all pass WCAG AA contrast
- [ ] Component documented with Do/Don't examples
- [ ] Cross-platform behavior is consistent or differences are documented
