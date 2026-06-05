---
name: interaction-design
description: Interaction flows, information architecture, task efficiency, and feedback patterns for usable interfaces
---

# Interaction Design

## Core Principle
Good interaction design reduces cognitive load, makes state visible, and helps users recover from mistakes.

## Interaction Heuristics
- Match system to real-world language and mental models
- Keep primary actions obvious and secondary actions available but visually quieter
- Show system status immediately: loading, success, empty, partial, error, offline
- Design for interruption and recovery — users abandon, resume, and retry
- Prefer recognition over recall: visible options beat hidden commands

## User Flow Design
For every major flow define:
- **Entry point** — how user arrives
- **Primary path** — shortest successful route
- **Branch states** — optional paths, shortcuts, alternatives
- **Failure states** — invalid input, backend failure, permission denied, timeout
- **Exit state** — what success looks like and where user lands next

## Form Design
- Group fields semantically
- Ask only for information needed now
- Use inline validation near field, not just global error banners
- Preserve entered data on recoverable errors
- Mark required vs optional fields clearly
- Pick right input control for job: radio for few exclusive choices, select only for longer lists, autocomplete for large datasets

## Navigation & IA
- Keep top-level navigation stable and predictable
- Use progressive disclosure for advanced settings
- Every screen should answer: where am I, what can I do, what happens next
- Limit competing primary actions per screen

## Microinteractions
- Hover, focus, pressed, disabled states must be distinct
- Transitions should communicate change, not decorate it
- Success feedback must confirm completion without requiring reread of entire screen
- Destructive actions require confirmation only when consequences are meaningful and hard to undo

## Edge States Checklist
Every flow should define:
- Empty state
- Loading state
- Skeleton or placeholder strategy
- Error state
- Permission state
- First-time user guidance
- Returning user shortcut
