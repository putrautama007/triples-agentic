---
name: cross-platform-design
description: Cross-platform UI adaptation across web, iOS, Android, and Flutter — navigation, inputs, layout, motion, and platform conventions
---

# Cross-Platform Design

## Core Principle
Consistency matters at the product level, not pixel-for-pixel sameness. Preserve user intent, information hierarchy, and brand while adapting to each platform’s conventions.

## What must stay consistent
- Information architecture and task flow
- Product terminology and core content hierarchy
- Semantic meaning of colors, icons, and status states
- Component intent (e.g., primary action remains primary action)
- Accessibility expectations and error-prevention logic

## What should adapt per platform
- Navigation patterns
- Gestures and touch interactions
- Modal/sheet presentation
- Typography scale and density
- Native component affordances
- Motion style and transition patterns

## Platform Conventions

### Web
- Hover exists; use it as enhancement, not requirement
- Dense tables and multi-column layouts are acceptable on large screens
- Keyboard and screen reader support are mandatory
- Browser constraints matter: address bars, responsive resizing, web performance budgets

### iOS
- Prefer bottom sheets, tab bars, and native back navigation expectations
- Use iOS patterns for pickers, segmented controls, and destructive confirmations
- Respect safe areas and dynamic type scaling
- Motion should feel lighter and more fluid than web

### Android
- Material patterns: clear elevation, system back handling, prominent FAB only when earned
- Sheets, snackbars, and permission prompts should follow Android expectations
- Account for broader device fragmentation and varied screen densities
- Touch feedback/haptics are stronger affordance signals than hover

### Flutter
- Decide up front whether product should feel Material-first, Cupertino-first, or adaptive hybrid
- Component behavior should be explicit when wrapping platform-specific widgets
- Avoid designing interactions that depend on platform-native implementation details without documenting them

## Navigation Adaptation
- Desktop web: sidebar + content or top nav can work
- Mobile web/app: bottom nav or stacked drill-in flows usually better
- iOS: `NavigationStack`, tabs, swipe-back
- Android: top app bar + up nav, bottom nav for top-level destinations

## Input & Form Adaptation
- Mobile: fewer fields per screen, larger touch targets, optimized keyboard types
- Web desktop: multi-column forms acceptable if scanability remains strong
- iOS/Android date/time/file pickers should use native metaphors unless product has strong reason not to

## Layout Adaptation
Define breakpoints and platform shifts explicitly:
- **Phone** — single column, progressive disclosure, sticky bottom CTA if needed
- **Tablet** — split view or two-column when it improves task completion
- **Desktop** — exploit width for comparison, bulk actions, and persistent context

## Motion Adaptation
- Web: subtle, performance-conscious, avoid layout-jank
- iOS: more natural easing and continuity between parent/child screens
- Android: clear material transitions and state changes
- Reduced motion fallback must exist everywhere

## Platform Review Checklist
- [ ] Flow remains recognizable across platforms
- [ ] No desktop-only interaction accidentally required on mobile
- [ ] Native expectations respected for navigation and dismissal
- [ ] Text scaling and localization expansion considered
- [ ] Touch targets remain at least 44×44px on touch devices
- [ ] Keyboard-only path exists on web and desktop-like targets
