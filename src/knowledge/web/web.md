# Web Standards Knowledge — Accessibility, Performance & Best Practices

## Accessibility (a11y)

The Web Content Accessibility Guidelines (WCAG 2.1 AA) is the target standard.

### Semantic HTML
Use the correct element for the job:
- `<button>` for actions, `<a>` for navigation — never `<div>` with onClick
- `<nav>`, `<main>`, `<aside>`, `<footer>` for landmark regions
- Heading hierarchy: one `<h1>` per page, `<h2>` for sections, `<h3>` for subsections (no skipping)
- `<table>` with `<thead>`, `<th scope="col">`, `<caption>` for data tables

### ARIA
Use ARIA only when semantic HTML is insufficient:
- `aria-label` — when text content doesn't describe the element (icon buttons)
- `aria-expanded` — for accordion/disclosure patterns
- `aria-live` — for dynamic content updates (loading states, notifications)
- Never add `role="button"` to a `<div>` — use `<button>` instead

### Keyboard Navigation
- All interactive elements must be reachable via `Tab`
- All actions must be triggerable via `Enter` / `Space`
- Focus must be visible (`:focus-visible` CSS)
- Modal dialogs must trap focus while open; restore focus on close
- Skip nav links for screen readers: `<a href="#main-content">Skip to main</a>`

### Color & Contrast
- Text contrast ratio ≥ 4.5:1 (normal text), ≥ 3:1 (large text, 18px+ or bold 14px+)
- Never use color alone to convey information (add icons, patterns, or text)
- Check with: WebAIM Contrast Checker, axe DevTools

## Web Performance

### Critical Rendering Path
1. HTML parsed → DOM built
2. CSS parsed → CSSOM built
3. DOM + CSSOM → Render Tree
4. Layout → Paint → Composite

Minimize blocking resources in `<head>`. Defer non-critical JS. Inline critical CSS.

### Loading Strategies
- **Images**: `loading="lazy"` for below-fold, `loading="eager"` + preload for hero
- **Fonts**: `font-display: swap` to prevent FOIT; preload primary font
- **Scripts**: `defer` or `async` for non-critical; module scripts are deferred by default
- **CSS**: critical CSS inlined; rest loaded with `rel="preload"`

### Caching
- Static assets: `Cache-Control: max-age=31536000, immutable` (with content hash in filename)
- API responses: `Cache-Control: private, max-age=60` or `no-cache` based on data freshness needs
- Service Worker: cache-first for shell, network-first for API

### Image Optimization
- Use `<picture>` with `srcset` for responsive images
- WebP format for photographs, SVG for icons/illustrations
- Always set explicit `width` and `height` attributes to prevent CLS
- Use a CDN with on-the-fly image resizing for user-generated content

## Security (Web)

- **Content Security Policy (CSP)**: block inline scripts and unauthorized origins
- **HTTPS**: enforce via HSTS header (`Strict-Transport-Security: max-age=31536000`)
- **X-Frame-Options**: `DENY` or `SAMEORIGIN` to prevent clickjacking
- **XSS prevention**: never `innerHTML` with user content; use textContent or sanitize with DOMPurify
- **CSRF protection**: SameSite cookies + CSRF tokens for state-changing operations
- **Subresource Integrity (SRI)**: add `integrity` attributes to third-party scripts/styles

## Browser Compatibility

Target: last 2 stable versions of Chrome, Firefox, Safari, Edge.

- Check support at: caniuse.com
- Use feature detection (`if ('fetch' in window)`) not user-agent sniffing
- Polyfills only for genuinely needed features; don't polyfill everything
- Test in Safari! It's the new IE for many modern web features.

## Progressive Web App (PWA) Checklist

- [ ] HTTPS
- [ ] Web App Manifest (`manifest.json`) with icons, name, theme color
- [ ] Service Worker with offline fallback
- [ ] Responsive design (passes mobile-friendly test)
- [ ] Fast initial load (LCP < 2.5s)
- [ ] Installable (meets browser criteria)
