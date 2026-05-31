# QA Knowledge — Process & Execution

## QA Role Definition

The QA Engineer's job is to find real problems before users do — not to rubber-stamp development output. A QA engineer who never finds bugs is not doing their job; a QA engineer who blocks release without evidence is equally unhelpful.

**Core responsibilities**:
- Execute test cases against built features
- Identify defects, reproduce them reliably, and document clearly
- Assess release risk and make go/no-go recommendation
- Automate regression tests for stable, critical paths

## QA Execution Process

### 1. Pre-Testing Checklist
- [ ] Build/deployment confirmed stable
- [ ] Test environment matches target environment (data, config)
- [ ] Test data and fixtures are in place
- [ ] Test cases reviewed and understood
- [ ] Feature scope confirmed with developer

### 2. Smoke Testing First
Run P0 test cases only. If smoke tests fail, stop and report immediately — do not continue with full test suite on an unstable build.

### 3. Systematic Execution
Execute test cases in priority order: P0 → P1 → P2 → P3.
Document actual result for every test case (pass, fail, or blocked with reason).

### 4. Exploratory Testing
After structured test cases, spend time exploring the feature without a script:
- Try unexpected inputs and sequences
- Check edge cases not covered in test cases
- Test integrations between features
- Verify consistency (does the new feature break any existing flows?)

### 5. Defect Reporting
Every defect gets a bug report immediately. Do not accumulate findings.

## Bug Report Format

```markdown
## BUG-[ID]: [Short descriptive title]

**Severity:** Critical | High | Medium | Low
**Priority:** P0 | P1 | P2 | P3
**Status:** Open | In Progress | Fixed | Verified | Won't Fix
**Platform:** Web Chrome 120 / Android 14 / iOS 17.2 / Flutter
**Build/Version:** [build number or commit SHA]

### Steps to Reproduce
1. [Exact step]
2. [Exact step]
3. [Exact step]

### Expected Result
[What should have happened]

### Actual Result
[What actually happened — be specific, include error messages verbatim]

### Evidence
[Screenshot, screen recording, log output]

### Notes
[Any additional context: frequency (always/sometimes), related issues]
```

## Platform-Specific QA Considerations

### Web
- Test in: Chrome (latest), Firefox (latest), Safari (latest), Edge (latest)
- Test on: Desktop 1920px, Tablet 768px, Mobile 375px
- Check: keyboard navigation, screen reader (VoiceOver/NVDA), print styles

### Android
- Test on: latest Android + one 2-year-old OS version
- Test on: low-end device (budget RAM) + flagship
- Check: back button behavior, rotation, dark mode, large font size, split-screen

### iOS
- Test on: latest iOS + one version back
- Test on: iPhone SE (small) + iPhone Pro Max (large screen)
- Check: safe area insets, Dynamic Type, VoiceOver, landscape mode

### Flutter (Cross-Platform)
- Run test suite on both Android and iOS
- Verify platform-specific adaptive widgets render correctly
- Check system font integration and Dynamic Type / Text Scale

## Automation Strategy

**Automate when**:
- Test case is P0 or P1
- Test case runs more than once per sprint
- Test case is time-consuming but deterministic

**Keep manual when**:
- Exploratory or visual testing
- Test requires subjective judgment
- Feature is likely to change soon (automate after stabilization)

**Framework recommendations**:
- Web E2E: Playwright
- Android: Espresso + UIAutomator2
- iOS: XCUITest
- Flutter: integration_test + flutter_driver
- API: Postman / Newman, Rest-Assured

## Release Go/No-Go Criteria

### Ship (Go)
- All P0 test cases: PASS
- All P1 test cases: PASS or accepted risk documented
- No open Critical or High severity bugs without sign-off
- Regression tests: PASS

### Do Not Ship (No-Go)
- Any P0 test case FAIL without a valid workaround
- Any Critical severity bug open
- High severity bug count exceeds team's defined threshold
- Core user flow (login, purchase, core CRUD) broken

Document every No-Go decision with: failing test cases, severity of issues, estimated fix time.

## QA Metrics

| Metric | Target | Notes |
|---|---|---|
| Defect detection rate | > 90% before production | % of bugs found by QA vs. users |
| Test case pass rate | > 95% before release | Track per sprint for trends |
| Bug re-open rate | < 10% | Indicates fix quality issues |
| Mean time to verify fix | < 1 day | Blockers should not sit |
