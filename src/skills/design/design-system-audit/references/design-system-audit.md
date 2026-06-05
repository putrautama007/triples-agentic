---
name: design-system-audit
description: Systematic design system audit — coverage gaps, inconsistency detection, token health, component quality, and deprecation workflow
---

# Design System Audit

## Core Principle
A design system that isn't actively audited grows inconsistent silently. Audit isn't a one-time cleanup; it's a continuous quality gate that keeps design and code in sync.

## When to Audit
- Before adding a new component: check an equivalent doesn't already exist
- When usage divergence is reported: design and code have drifted from the spec
- After a major product expansion: new surfaces may have introduced one-off patterns
- Quarterly health check: detect token drift, component debt, and accessibility regressions

## Audit Scope Levels

### Token audit
Checks design tokens in the system against tokens used in production.
- Are all semantic tokens referenced in at least one component?
- Are there hardcoded colors, spacing values, or font sizes in components (token bypass)?
- Do global tokens map cleanly to semantic tokens without orphan primitives?
- Do dark-mode token values maintain all contrast requirements?

### Component coverage audit
Maps what the product needs against what the system provides.
- For each product surface, catalog all distinct UI patterns
- Mark each pattern: `in system` / `partial` / `missing` / `one-off exists`
- `Partial` = component exists but variant or state needed is absent
- `One-off exists` = a custom implementation lives in the product, not the system

### Component quality audit
For each component in the system, check:
- [ ] All states documented (default, hover, focus, active, disabled, loading, error)
- [ ] All interactive states visually distinct
- [ ] ARIA roles and keyboard behavior specified
- [ ] Token map complete (no hardcoded values)
- [ ] Do/Don't usage guidance present
- [ ] Used in at least one product surface (orphan components are candidates for deprecation)

### Consistency audit
- Are the same patterns implemented the same way across platforms?
- Are component names consistent between design files and code?
- Are spacing and sizing values consistent for the same visual relationships across surfaces?

### Accessibility audit
- Do all color pairings pass WCAG AA minimum?
- Do focus indicators meet 3:1 contrast against adjacent colors?
- Do all interactive components expose correct keyboard behavior?

## Audit Outputs
After each audit, produce a prioritized gap list:

| Priority | Category | Component / Token | Issue | Recommendation |
|----------|----------|-------------------|-------|----------------|
| P0 (blocking) | Accessibility | Color.status.error on white | 2.8:1 contrast — fails WCAG AA | Darken `color.status.error` value |
| P1 (important) | Coverage gap | Table row selection | No selected state defined | Add selected variant to Table component |
| P2 (quality) | Documentation | Modal | No Do/Don't guidance | Author usage doc section |
| P3 (debt) | Token bypass | Button (product codebase) | Uses `#FF5733` hardcoded | Replace with `color.status.error` |

## Component Lifecycle

### Proposing a new component
1. Check audit: does an existing component partially satisfy this?
2. Check usage: will this pattern be needed in 3+ product surfaces?
3. Write a component proposal: purpose, API contract sketch, token requirements, open questions
4. Get sign-off from design and engineering leads before building

### Deprecating a component
1. Identify replacement component or pattern
2. Mark component as `@deprecated` in design file and code
3. Publish migration guide: before/after with code and design examples
4. Give 1 sprint lead time before removal
5. Remove only after all product usage is migrated

## System Health Scorecard
Track quarterly:
| Metric | Formula | Target |
|--------|---------|--------|
| Token coverage | (components using tokens / total components) × 100 | ≥ 95% |
| Component documented | (components with full docs / total components) × 100 | ≥ 90% |
| Accessibility pass rate | (components passing audit / total components) × 100 | 100% |
| One-off component count | raw count in product codebase not in system | decreasing trend |
