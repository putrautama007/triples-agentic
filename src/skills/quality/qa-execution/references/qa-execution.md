---
name: qa-execution
description: QA execution process — pre-test checklist, smoke testing, exploratory testing, and platform-specific considerations
---

# QA Execution

## QA Role

The QA Engineer's job is to find real problems before users do — not to rubber-stamp development output. A QA engineer who never finds bugs is not doing their job; a QA engineer who blocks release without evidence is equally unhelpful.

## Execution Process

### 1. Pre-Testing Checklist
- [ ] Build/deployment confirmed stable
- [ ] Test environment matches target environment (data, config)
- [ ] Test data and fixtures are in place
- [ ] Test cases reviewed and understood
- [ ] Feature scope confirmed with developer

### 2. Smoke Testing First
Run P0 test cases only. If smoke tests fail, **stop and report immediately** — do not continue with full test suite on an unstable build.

### 3. Systematic Execution
Execute in priority order: P0 → P1 → P2 → P3.
Document actual result for every test case: Pass / Fail / Blocked / Skipped (with reason).

### 4. Exploratory Testing
After structured cases:
- Try unexpected inputs and sequences
- Check edge cases not covered in test cases
- Test integrations between new and existing features
- Verify consistency with the rest of the product

## Platform-Specific Considerations

### Web
- Browsers: Chrome (latest), Firefox (latest), Safari (latest), Edge (latest)
- Viewports: 375px (mobile), 768px (tablet), 1440px (desktop)
- Check: keyboard navigation, screen reader (VoiceOver/NVDA), print styles

### Android
- OS versions: latest + one 2-year-old version
- Devices: low-end (budget RAM) + flagship
- Check: back button, rotation, dark mode, large font size, split-screen

### iOS
- OS versions: latest + one version back
- Devices: iPhone SE (small) + iPhone Pro Max (large)
- Check: safe area insets, Dynamic Type, VoiceOver, landscape mode

### Flutter (Cross-Platform)
- Run on both Android and iOS
- Verify platform-adaptive widgets render correctly on each
- Check system font integration and text scale
