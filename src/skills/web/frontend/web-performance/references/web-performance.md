---
name: web-performance
description: Web performance optimization — critical rendering path, loading strategies, caching, image optimization, and PWA
---

# Web Performance

## Critical Rendering Path

```
HTML parsed → DOM built → CSS parsed → CSSOM built → Render Tree → Layout → Paint → Composite
```

Minimize blocking resources in `<head>`. Defer non-critical JS. Inline critical CSS.

## Loading Strategies

- **Images**: `loading="lazy"` for below-fold; `loading="eager"` + preload for hero
- **Fonts**: `font-display: swap` to prevent FOIT; preload primary font file
- **Scripts**: `defer` or `async` for non-critical; module scripts are deferred by default
- **CSS**: inline critical CSS; load rest with `rel="preload"` as stylesheet

## Caching

- **Static assets**: `Cache-Control: max-age=31536000, immutable` (with content hash in filename)
- **API responses**: `Cache-Control: private, max-age=60` or `no-cache` based on freshness needs
- **Service Worker**: cache-first for shell, network-first for API data

## Image Optimization

- Use `<picture>` with `srcset` for responsive images
- WebP for photographs, SVG for icons and illustrations
- Always set explicit `width` and `height` attributes to prevent CLS
- Use a CDN with on-the-fly image resizing for user-generated content
- Target hero images < 200KB, other content images < 100KB

## PWA Checklist

- [ ] HTTPS
- [ ] Web App Manifest with icons, name, theme color
- [ ] Service Worker with offline fallback
- [ ] Responsive design (passes mobile-friendly test)
- [ ] Fast initial load (LCP < 2.5s)
- [ ] Installable (meets browser criteria)

## Browser Compatibility

Target: last 2 stable versions of Chrome, Firefox, Safari, Edge.
- Check support at: caniuse.com
- Use feature detection, not user-agent sniffing
- **Test in Safari** — it's the new IE for many modern web features
