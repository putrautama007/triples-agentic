---
name: mobile-design-system
description: Mobile design-system foundations for iOS, Android, and Flutter — color roles, token mapping, typography scales, touch targets, safe areas, iconography, motion, density, and platform component usage for designers
---

# Mobile Design System

## Core Principle
A mobile design system does not copy web patterns and shrink them. Touch, screen density, safe areas, dynamic type, and platform conventions must be first-class design constraints — not afterthoughts applied at the end.

---

## Token Architecture for Mobile

### Color tokens — platform mapping
Design semantic tokens once; map them to platform-specific system colors so the product works with system dark mode, contrast accessibility, and dynamic color automatically.

| Semantic token | iOS mapping | Android (MD3) mapping |
|----------------|-------------|----------------------|
| `color.surface.default` | `Color(.systemBackground)` | `colorScheme.surface` |
| `color.surface.elevated` | `Color(.secondarySystemBackground)` | `colorScheme.surfaceContainerLow` |
| `color.text.primary` | `Color(.label)` | `colorScheme.onSurface` |
| `color.text.secondary` | `Color(.secondaryLabel)` | `colorScheme.onSurfaceVariant` |
| `color.interactive.primary` | Custom mapped to `tintColor` | `colorScheme.primary` |
| `color.status.error` | Custom mapped + `.destructive` | `colorScheme.error` |
| `color.border.subtle` | `Color(.separator)` | `colorScheme.outlineVariant` |

**Rules:**
- Never hardcode hex colors for system-level surfaces — always use platform semantic colors so dark mode, vibrant accessibility, and dynamic color work automatically
- Custom brand colors must still pass WCAG AA at 4.5:1 in both light and dark mode
- Android Material You (Android 12+): support `dynamicColorScheme()` but define a static fallback for older OS versions

### Spacing tokens — density
Mobile uses the same 4px base grid as web, but tighter density defaults for compact views.

| Token | Value | Mobile usage |
|-------|-------|-------------|
| `spacing.1` | 4px | Micro gaps, icon padding |
| `spacing.2` | 8px | Internal component padding (dense) |
| `spacing.3` | 12px | Internal component padding (default) |
| `spacing.4` | 16px | Section insets, card padding |
| `spacing.6` | 24px | Section separators |
| `spacing.8` | 32px | Screen-level vertical rhythm |

Screen edge insets: 16px phone, 24px large phone, 32px+ tablet.

### Radius tokens
- `radius.sm` — 4px — chips, tags
- `radius.md` — 8px — buttons, inputs
- `radius.lg` — 12px — cards, sheets
- `radius.xl` — 16px — bottom sheets, modals
- `radius.full` — 9999px — pills, FAB
iOS default radius for sheets: 20px (system standard). Match unless brand requires deviation.

### Elevation (Android MD3)
Elevation in Material 3 is expressed as surface tonal overlays, not shadows alone.
| Level | dp | Usage |
|-------|----|-------|
| 0 | 0dp | Default surfaces |
| 1 | 1dp | Cards, list items |
| 2 | 3dp | FAB, menus |
| 3 | 6dp | Modals, dialogs |
| 4 | 8dp | Navigation bar |
| 5 | 12dp | Search bar, sheets |

iOS uses layered materials (`.regular`, `.thick`, `.chrome`) — map elevation intent to the correct material instead of setting shadow values.

---

## Typography Scale — Mobile

### iOS: Dynamic Type
Never hardcode font sizes on iOS. Map to Dynamic Type text styles so the system respects user accessibility text size preferences.

| Semantic use | Dynamic Type style | Default size | Bold weight |
|-------------|-------------------|--------------|-------------|
| Large title | `.largeTitle` | 34pt | — |
| Screen title | `.title` | 28pt | — |
| Section title | `.title2` | 22pt | — |
| Headline | `.headline` | 17pt | Semibold |
| Body | `.body` | 17pt | Regular |
| Callout | `.callout` | 16pt | — |
| Subheadline | `.subheadline` | 15pt | — |
| Footnote | `.footnote` | 13pt | — |
| Caption | `.caption` | 12pt | — |

- Use SF Pro (default system font) unless brand requires a custom font registered with the system
- Custom fonts must also support Dynamic Type scaling via `UIFontMetrics`

### Android: Material 3 Type Scale
Map design tokens to MD3 type scale roles.

| Token / Role | Size | Weight | Usage |
|--------------|------|--------|-------|
| `display.large` | 57sp | Regular | Hero screens |
| `display.medium` | 45sp | Regular | Feature headers |
| `headline.large` | 32sp | Regular | Screen titles |
| `headline.medium` | 28sp | Regular | Section titles |
| `title.large` | 22sp | Regular | App bar titles |
| `title.medium` | 16sp | Medium | List item headers |
| `body.large` | 16sp | Regular | Primary body text |
| `body.medium` | 14sp | Regular | Secondary text |
| `label.large` | 14sp | Medium | Buttons, tabs |
| `label.small` | 11sp | Medium | Captions, badges |

Use `sp` (scaled pixels) for text — never `dp` — so user text size preferences apply.

---

## Touch Targets & Input Affordances

### Minimum sizes
| Platform | Minimum tap target | Recommended |
|----------|--------------------|------------|
| iOS (HIG) | 44×44pt | 44×44pt |
| Android (MD3) | 48×48dp | 48×48dp |
| Flutter | 48×48dp logical pixels | 48×48dp |

Hit area can be larger than the visual element. Use padding or `GestureDetector`/`.contentShape` to expand target without changing visual appearance.

### Input types for mobile forms
Always specify the correct keyboard type so the OS shows the right keyboard:
| Input | Keyboard type |
|-------|--------------|
| Email | `email` |
| Phone | `tel` / `numberPad` |
| Integer quantity | `numberPad` |
| Decimal / price | `decimalPad` |
| URL | `URL` |
| Search | `search` (shows magnifier action key) |
| Password | Secure text entry, never autocorrect |

Specify `returnKeyType`/`imeOptions` (iOS/Android): `next` when another field follows, `done` or `send` when it's the last action.

---

## Safe Areas & Screen Geometry

### iOS safe areas
- **Top**: Dynamic Island (iPhone 14 Pro+), notch (other Face ID models), or status bar
- **Bottom**: Home indicator bar on all Face ID devices
- **Rule**: interactive content and CTA buttons must never sit below the safe area — they will be obscured by system chrome or the home indicator
- **Floating CTAs**: bottom-pinned buttons must have additional bottom padding equal to `safeAreaInsets.bottom` + design padding

### Android insets
- Use `WindowInsetsCompat` in code; in design, ensure primary actions stay above navigation bar area
- Edge-to-edge mode is default from Android 15 — design for content behind system bars with proper inset handling

### Notch / cutout avoidance
- Status bar content must avoid camera cutouts on both platforms
- Do not place permanent UI in the top corners on notched devices

---

## Iconography for Mobile

### iOS — SF Symbols
- Use SF Symbols (v5) where possible — they scale with Dynamic Type, adapt weight automatically, and are accessible
- Symbol weight must match adjacent text weight
- Use semantic symbols (`.trash`, `.heart`, `.gear`) not descriptive names; rely on context + label not symbol shape alone
- For custom icons: match SF Symbol optical metrics (24pt grid, safe zone, optical center)

### Android — Material Symbols
- Use Material Symbols (filled or outlined, consistent within one product) rather than Material Icons (older set)
- Symbols support optical size variants: 20, 24, 40, 48dp; match the declared icon slot size
- Enable variable font axis: `opsz` for optical size, `FILL` for filled/outlined, `wght` for weight

### Flutter — choose one set
- Default to `Icons.*` (Material Icons, built-in) or add `cupertino_icons` for iOS-style symbols
- Do not mix Material and Cupertino icon families on the same screen

### General icon rules for mobile
- Always pair icon-only controls with a visible text label or a tooltip/accessibility label
- Minimum icon size in a touch target: 24×24dp/pt with 44×44dp/pt surrounding tap area
- Multi-platform products: use same icon intent; adapt the actual symbol to each platform's vocabulary

---

## Motion & Animation — Mobile

### Principles
- Motion clarifies, not decorates: transitions should explain spatial relationships and state changes
- Short and purposeful: excess animation on mobile is slower and draining on older devices

### Duration guidelines
| Interaction type | Duration | Easing |
|-----------------|----------|--------|
| Element enter (small) | 150–200ms | `ease-out` |
| Element exit (small) | 100–150ms | `ease-in` |
| Screen transition | 250–350ms | `ease-in-out` |
| Expressive / spring | 300–500ms | Spring / custom cubic |
| Skeleton → content | immediate | No animation — just swap |

### Platform motion conventions
**iOS**
- Use hero transitions for navigation (the element carries across screens)
- Standard push uses horizontal slide; modal uses vertical slide-up
- Spring animations for interactive dismissal (rubber-band feel)
- Sheet dismiss with drag must use interactive spring following finger velocity

**Android MD3**
- Container transform: shared element expands from source card into detail screen
- Forward/backward nav: `SharedAxisTransition` (horizontal for depth, vertical for hierarchy)
- FAB → full screen: `FadeThrough` or container transform
- Avoid dramatic spring effects — MD3 motion is decisive and efficient

**Flutter**
- `Hero` widget for shared element transitions
- `AnimatedSwitcher` for content state swaps
- `SlideTransition` + `FadeTransition` for modal and bottom-sheet entrances
- Use `MediaQuery.of(context).disableAnimations` to respect reduced-motion preference

### Reduced motion
Every animated transition must have a static fallback:
- Instant swap instead of a fly-in
- Fade instead of a transform
- No animation if `prefers-reduced-motion` (web) or `UIAccessibility.isReduceMotionEnabled` (iOS) or `Settings.Global.TRANSITION_ANIMATION_SCALE = 0` (Android)

---

## Mobile Component Usage: Platform Conventions

### Navigation
| Pattern | iOS | Android | Flutter adaptive |
|---------|-----|---------|-----------------|
| Top-level destinations | `TabBar` (bottom) | `NavigationBar` (bottom) | `NavigationBar` or `NavigationRail` |
| Deep navigation | `NavigationStack` push | `NavHost` composable | `GoRouter` push |
| Overflow actions | `...` in nav bar → action sheet | 3-dot menu (overflow menu) | `PopupMenuButton` |
| Tab count | 2–5 tabs | 3–5 tabs | 3–5 |

### Modals and Sheets
| Pattern | iOS | Android |
|---------|-----|---------|
| Confirmation | `UIAlertController` style (centered) | `AlertDialog` |
| Partial task | `UISheetPresentationController` (bottom sheet, detents) | `ModalBottomSheet` |
| Full task | Full-screen modal (`.fullScreenCover`) | Full-screen modal activity or `BottomSheet` |
| Dismiss | Swipe down or Cancel button | Back gesture or Cancel |

### Lists & Scrolling
- Deceleration: iOS has a lighter flick/coast feel; Android lands faster — this is handled by the OS, do not try to design it away
- Pull-to-refresh: native on both; always label the loading state
- Infinite scroll: show a loading indicator at the bottom, not a "Load more" button

### Form Controls
| Element | iOS | Android |
|---------|-----|---------|
| Single choice | `Picker` wheel or segmented control | `RadioButton` group |
| Toggle | `Toggle` (UISwitch style) | `Switch` (MD3) |
| Date/time | `DatePicker` | `DatePickerDialog` / `TimePickerDialog` |
| Text input | `TextField` rounded rect | `OutlinedTextField` or `FilledTextField` |
| Multi-select | Checkmark list | `Checkbox` list or `FilterChip` |

---

## Mobile Design System Checklist

### Tokens
- [ ] All colors reference platform semantic color tokens (system colors + semantic overrides)
- [ ] All text uses Dynamic Type (iOS) or `sp` units (Android)
- [ ] All spacing values are multiples of 4px
- [ ] All border radius values come from the radius token scale
- [ ] No hardcoded hex, raw pixel, or ad-hoc font declarations

### Touch & ergonomics
- [ ] Every interactive element has a minimum 44×44pt (iOS) or 48×48dp (Android) tap target
- [ ] Bottom CTAs clear safe area insets
- [ ] Input fields specify the correct keyboard type and return key action

### Platform conventions
- [ ] Navigation pattern follows platform conventions for the target OS
- [ ] Modal dismissal follows platform conventions (swipe-down on iOS, back on Android)
- [ ] Icons use the correct set per platform (SF Symbols on iOS, Material Symbols on Android)
- [ ] Motion durations and easing match platform conventions
- [ ] Reduced-motion fallback specified for every animated transition

### Accessibility
- [ ] Text meets Dynamic Type or `sp` scaling requirements
- [ ] Custom icons and images have accessibility labels
- [ ] Color contrast passes WCAG AA in both light and dark mode
- [ ] Destructive actions require confirmation
