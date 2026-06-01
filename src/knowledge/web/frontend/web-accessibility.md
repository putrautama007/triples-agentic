---
name: web-accessibility
description: WCAG 2.1 AA compliance — semantic HTML, ARIA patterns, keyboard navigation, and color contrast
---

# Web Accessibility (a11y)

Target: **WCAG 2.1 AA**

## Semantic HTML

Use the correct element for the job:
- `<button>` for actions, `<a>` for navigation — never `<div>` with onClick
- `<nav>`, `<main>`, `<aside>`, `<footer>` for landmark regions
- Heading hierarchy: one `<h1>` per page, `<h2>` for sections (no skipping)
- `<table>` with `<thead>`, `<th scope="col">`, `<caption>` for data tables
- `<form>` with `<label>` associated to every input (via `for` attribute or wrapping)

## ARIA

Use ARIA only when semantic HTML is insufficient:
- `aria-label` — when text content doesn't describe the element (icon-only buttons)
- `aria-expanded` — for accordion/disclosure patterns
- `aria-live="polite"` — for dynamic content updates (loading states, notifications)
- `aria-describedby` — to link error messages to their input fields
- Never add `role="button"` to a `<div>` — use `<button>` instead

## Keyboard Navigation

- All interactive elements must be reachable via `Tab`
- All actions must be triggerable via `Enter` / `Space`
- Focus must be visible (`:focus-visible` CSS, never `outline: none` without a replacement)
- Modal dialogs must trap focus while open; restore focus on close
- Skip nav link: `<a href="#main-content" class="skip-link">Skip to main content</a>`

## Color & Contrast

- Text contrast ratio ≥ 4.5:1 (normal text), ≥ 3:1 (large text: 18px+ or bold 14px+)
- Never use color alone to convey information — add icons, patterns, or text
- Check with: WebAIM Contrast Checker, axe DevTools browser extension

## Common Mistakes to Avoid

| Mistake | Fix |
|---|---|
| `<div onClick>` | Use `<button>` or `<a>` |
| Missing alt text | Add `alt=""` for decorative, meaningful alt for content |
| Form inputs without labels | Add `<label for="id">` or `aria-label` |
| Low contrast text | Minimum 4.5:1 ratio |
| Focus indicator hidden | Never `outline: none` without a visible replacement |
| Only color indicates errors | Add icon + text alongside color |
