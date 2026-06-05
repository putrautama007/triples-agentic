---
name: visual-design
description: Typography, color systems, spacing, hierarchy, and component visual language for consistent, accessible UI
---

# Visual Design

## Core Principle
Visual design communicates hierarchy, brand, and meaning — not decoration. Every visual decision should support comprehension or interaction, not compete with it.

## Typography
- **Scale** — use a modular type scale (e.g., 12/14/16/18/24/32/40/48px); never set font sizes ad hoc
- **Hierarchy** — three levels maximum per context: heading, body, supporting; more levels create visual noise
- **Line length** — 60–80 chars for body text; narrower for UI labels
- **Line height** — 1.4–1.6 for body text; tighter for headings only
- **Weight** — use weight contrast (Regular + Medium + Semibold/Bold) to signal importance; avoid relying solely on size

## Color
- **Color system** — define semantic tokens: `brand`, `surface`, `text`, `border`, `interactive`, `status` (success/warning/error/info)
- **Contrast** — minimum 4.5:1 for normal text; 3:1 for large text and UI components (WCAG AA)
- **Do not use color as the only signal** — pair with icon, text, pattern, or position for color-blind users
- **Dark mode** — design color tokens to invert; never hardcode colors
- **Neutrals** — define a neutral ramp (3–5 steps) for backgrounds, borders, and disabled states

## Spacing
- **4px base grid** — all spacing values multiple of 4
- **Density** — cozy (4–8px internal padding) for data-dense UIs; comfortable (12–16px) for consumer apps
- **White space** — negative space groups related elements and separates unrelated ones; don't fill it reflexively
- **Consistency** — same visual relationship should use same spacing token, always

## Iconography
- Use a consistent icon library; don't mix icon styles
- Icons must have text labels except for universally recognized patterns (close, home, search)
- Size icons proportionally to adjacent text: 16px with 14px body text, 20px with 16–18px body

## Component Visual Language
- Consistent border radii within a radius scale (none/sm/md/lg/full); don't mix
- Elevation: use 2–3 shadow levels only; shadow should imply clickability or layering, not random decoration
- States: default, hover, focus-visible, active/pressed, disabled — all six must be visually distinct
- Focus ring must always be visible and high-contrast; never remove outline without a custom visible replacement

## Visual Hierarchy Checklist
For every screen verify:
- One clear primary action at visual apex
- Supporting information visually subordinate
- Color and weight used consistently as semantic signals
- Alignment and grouping reinforce relationships
- No competing calls to action at same visual weight
