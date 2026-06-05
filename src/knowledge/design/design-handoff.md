---
name: design-handoff
description: Design-to-engineering handoff standards — annotation, redline specs, token mapping, component API contracts, and implementation-readiness checklist
---

# Design Handoff

## Core Principle
A handoff is a contract, not a file share. Engineers must be able to build the design without a follow-up conversation. Every ambiguity in the handoff becomes a decision made without you.

## Implementation-Readiness Checklist
Before marking a design ready to build, verify:
- [ ] All screens in the flow are accounted for (entry, intermediate, success, error, empty, loading)
- [ ] Every interactive element has all visual states (default, hover, focus, active, disabled)
- [ ] All spacing and sizing values reference tokens, not raw pixel numbers
- [ ] Color values reference semantic tokens, not hex codes
- [ ] Text styles reference typography tokens, not ad hoc font declarations
- [ ] Motion/animation specified: property, duration, easing, trigger
- [ ] Responsive breakpoints and layout shift behavior annotated
- [ ] Platform-specific deviations (iOS vs Android vs web) are called out explicitly
- [ ] Accessibility notes included for non-obvious interactions (focus order, ARIA, keyboard)

## Annotation Standards

### Spacing annotations
Reference token names, not pixels: `spacing.inset.md (16px)` not just `16px`. If no token exists, flag it as a token gap for the design system.

### Typography annotations
Call out: `font-size`, `font-weight`, `line-height`, `letter-spacing`, and the token name. Specify truncation and max-lines behavior.

### Color annotations
Use semantic tokens: `color.interactive.primary` not `#3B82F6`. Note opacity values if less than 100%.

### Interaction annotations
For each interactive element specify:
- Trigger (click, hover, focus, swipe, keyboard shortcut)
- Visual state change (what changes and how)
- Behavior outcome (what happens in the product)
- Timing (if animated: duration and easing curve)

### Component annotations
Map each design element to a component:
- Existing design system component → name + variant + props
- Modified existing component → base component + deviation description
- Net new component → mark as "New component needed", provide API sketch

## Component API Contract Sketch
For every new component in the design, provide:
```
Component: [Name]
Purpose: [One sentence — what job does this component do]
Props:
  - variant: primary | secondary | ghost
  - size: sm | md | lg
  - disabled: boolean
  - icon?: leading | trailing
States: default, hover, focus, active, disabled, loading
Accessibility:
  - Role: button
  - Keyboard: Enter / Space to activate
  - aria-label required when no visible text
Token requirements:
  - background → color.interactive.primary
  - text → color.text.inverse
  - border-radius → radius.md
```

## Responsive Handoff
For every layout, document behavior at each breakpoint:
- What reflows (stacks, hides, collapses)
- Which components swap (e.g., bottom sheet on mobile, modal on desktop)
- Touch targets on mobile: minimum 44×44px

## Motion & Animation Specification
For any transition, provide:
- **Property** — what is animating (opacity, transform, height)
- **Duration** — milliseconds (fast: 150ms, standard: 250ms, emphasis: 400ms)
- **Easing** — standard: `ease-in-out`; enter: `ease-out`; exit: `ease-in`; spring for expressive elements
- **Trigger** — what causes the animation
- **Reduced motion alternative** — what to show when `prefers-reduced-motion: reduce`

## Handoff Anti-Patterns to Avoid
- Pixel values without token reference → forces magic numbers in code
- Static screens with no edge-state specs → guarantees surprise bug reports
- Components designed that don't exist in the system without flagging → silent design debt
- Fonts or colors not in the current system without flagging → divergence in the design system
- Platform-specific interaction (swipe, haptics) not called out → mis-implemented on wrong platform
