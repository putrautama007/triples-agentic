# UI/UX Design Specification: [Feature / Product Name]

**Author:** HyeRin (Senior UI/UX Designer)
**Status:** Draft | Under Review | Approved
**Date:** YYYY-MM-DD
**Version:** 1.0
**PRD Reference:** `workspace/PRD.md`
**RFC Reference:** `workspace/RFC.md` (if available)

---

## Design Overview

> One paragraph. What are we designing? What user problem does this design solve? What principles drove key decisions?

---

## User Flows

### Primary Flow: [Flow Name — e.g., User Onboarding]
Describe the end-to-end path for the most important user journey from entry to success state.

1. **Entry point** — [where user arrives and how]
2. **Step 1** — [screen or action, what user sees, what they do]
3. **Step 2** — [screen or action]
4. **Success state** — [what confirms completion, where user lands]

### Secondary Flow: [Flow Name — e.g., Error Recovery]
_(Repeat for additional flows as needed)_

---

## Screen / View Specifications

### Screen 1: [Screen Name]
**Purpose:** [What does this screen accomplish for the user?]

#### Layout & Hierarchy
- [Primary content area: what it contains, what draws the eye first]
- [Secondary content: supporting information or controls]
- [Actions: primary button, secondary actions, nav]

#### Components & States
| Component | States Required | Notes |
|-----------|----------------|-------|
| [Component name] | default, hover, focus, disabled | [Any design notes or constraints] |
| [Component name] | default, loading, error | |

#### Empty State
[What does the user see when there is no data? Include illustration guidance, headline, and call-to-action.]

#### Loading State
[Skeleton pattern or spinner placement, loading message if needed.]

#### Error State
[Inline field error / banner error / page-level error — specify which and where. Copy direction.]

#### Validation State
[How and when validation appears — on blur, on submit, inline. What passes, what fails.]

---

### Screen 2: [Screen Name]
_(Repeat for each screen in scope)_

---

## Information Architecture

```
[Top-level area]
├── [Section / Screen]
│   ├── [Sub-section]
│   └── [Sub-section]
└── [Section / Screen]
    └── [Sub-section]
```

---

## Component & Design-System Guidance

### Reuse Existing Components
| Component | Usage in this feature | Design-system token / variant |
|-----------|----------------------|-------------------------------|
| [e.g., Button] | [Primary CTA on checkout] | `intent=primary`, `size=md` |
| [e.g., Input] | [Email input on login] | `type=email`, `state=error` |

### New Components Required
| Component | Rationale | Proposed API / Props | Token requirements |
|-----------|-----------|---------------------|-------------------|
| [Component name] | [Why existing patterns don't cover this] | [props] | [token names] |

---

## Visual Direction

### Typography
- **Headings:** [scale and weight — e.g., 24px/Semibold for screen title]
- **Body:** [e.g., 16px/Regular, 1.5 line-height]
- **Labels & captions:** [e.g., 12px/Medium for field labels]

### Color Tokens
| Semantic token | Usage in this feature |
|---------------|----------------------|
| `color.interactive.primary` | [Primary CTA buttons] |
| `color.status.error` | [Validation messages, destructive states] |
| [Add tokens as needed] | |

### Spacing
- Internal component padding: [e.g., 12px horizontal, 8px vertical]
- Section spacing: [e.g., 24px between logical sections]
- Mobile adjustments: [e.g., reduce to 16px section spacing]

---

## Responsive & Platform Behavior

| Breakpoint | Layout changes | Interaction changes |
|------------|---------------|-------------------|
| Mobile (< 768px) | [e.g., single column, bottom sheet for modal] | [e.g., swipe gesture replaces hover] |
| Tablet (768–1024px) | [e.g., two column] | |
| Desktop (> 1024px) | [e.g., sidebar + content] | |

---

## Accessibility Requirements

- **Color contrast:** all text and interactive elements must meet WCAG 2.1 AA (4.5:1 normal, 3:1 large)
- **Focus management:** [specify focus trap for modals, focus restoration after dialog close, etc.]
- **Keyboard navigation:** [tab order, Enter/Space for interactive controls, Escape to close overlays]
- **Screen reader:** [required aria-labels, live regions for status updates, roles for custom components]
- **Motion:** [animations must respect `prefers-reduced-motion`]

---

## Edge Cases & Open Design Questions

| # | Edge Case / Question | Proposed Handling | Decision Owner |
|---|---------------------|-------------------|----------------|
| 1 | [e.g., User has no data on first load] | [Empty state with onboarding CTA] | HyeRin / PM |
| 2 | [e.g., Long user names overflow card] | [Truncate with tooltip on hover/focus] | HyeRin |

---

## Handoff Notes for Developers

- [Any specific behavior that is easy to misread from the spec — call it out explicitly]
- [Animation or transition details not captured in components]
- [Z-index or layering notes for overlapping elements]
- [Content length constraints: e.g., headline max 40 chars, truncate after 2 lines]

---

## Update History

| Version | Date | Changed By | Summary |
|---------|------|------------|---------|
| 1.0 | YYYY-MM-DD | HyeRin | Initial design spec |
