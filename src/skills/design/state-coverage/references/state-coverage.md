---
name: state-coverage
description: Design state coverage for complete TripleS UX flows, screens, components, and QA planning
---

# State Coverage

## Purpose

State coverage ensures a product experience is designed and testable beyond the happy path. Every user flow should specify what users see, what they can do, and how the system recovers when data, permissions, network, validation, or dependencies fail.

## State Inventory

Cover these states when relevant:

| State | Design question | Required output |
|---|---|---|
| Initial | What appears before user action? | Default content and primary action |
| Loading | What happens while waiting? | Skeleton/spinner/progress copy and timeout behavior |
| Success | What confirms completion? | Confirmation, next step, or navigation |
| Empty | What if no data exists? | Explanation, orientation, optional CTA |
| Error | What failed and how does user recover? | Error copy, retry path, support path |
| Validation | What input is invalid? | Field-level and form-level feedback |
| Disabled | Why is action unavailable? | Disabled reason or prerequisite |
| Permission | What if access is missing? | Permission request, denial, fallback |
| Offline | What works without network? | Offline message, cached state, retry/sync behavior |
| Conflict | What if data changed elsewhere? | Conflict message and resolution path |
| Destructive | What protects irreversible action? | Confirmation, consequence, undo/restore if available |
| Edge | What if data is extreme? | Long text, many items, zero/one/max cases |

## Coverage Matrix

For each screen or flow, document:

```markdown
| Screen / Flow | Initial | Loading | Empty | Error | Validation | Success | Permission | Offline | Edge Notes |
|---|---|---|---|---|---|---|---|---|---|
| [name] | [defined] | [defined] | [n/a or defined] | [defined] | [defined] | [defined] | [defined] | [defined] | [notes] |
```

Use `n/a` only with a reason. Example: `n/a — static marketing copy, no remote data or user input`.

## Microcopy Rules

- Error copy must explain what happened, why if known, and what to do next.
- Empty states must orient the user before presenting a CTA.
- Loading states should avoid false precision unless progress is measurable.
- Destructive confirmations must name the consequence, not just ask "Are you sure?"
- Permission prompts must explain user value before asking for access.

## Platform Checks

### Web
- Keyboard focus after loading, validation, dialogs, and error recovery is defined.
- Screen-reader announcements exist for async status changes.
- Responsive behavior covers smallest supported width.

### iOS
- Dynamic Type does not break empty/error states.
- VoiceOver labels exist for icon-only and status elements.
- Safe areas are respected for fixed CTAs and dialogs.

### Android
- Large font and TalkBack behavior are considered.
- Back navigation behavior is defined for loading, dialogs, and partial completion.
- Offline and retry states account for lifecycle changes.

### Flutter
- Platform-adaptive states are specified when widgets differ by target OS.
- Text scale and theming do not create clipped state messages.

## QA Mapping

State coverage should become test coverage:

- Loading → delayed network or pending operation test.
- Empty → no-data fixture test.
- Error → failed request or invalid dependency test.
- Validation → invalid, boundary, and missing input tests.
- Permission → granted, denied, and revoked permission tests.
- Offline → network unavailable and reconnect tests.
- Conflict → stale data or concurrent update test.
- Destructive → cancel, confirm, and recovery/undo tests.

## Quality Checklist

A design spec has acceptable state coverage when:

- [ ] Every user flow has primary, branch, failure, and success paths.
- [ ] Every data-driven screen has loading, empty, error, and success states.
- [ ] Every form has field-level validation and submission failure states.
- [ ] Every destructive action names consequence and recovery behavior.
- [ ] Every platform target has relevant accessibility and navigation state notes.
- [ ] Test cases can be derived without inventing missing states.

## Anti-Patterns

- **Happy-path-only design:** only showing the ideal content state.
- **Generic error:** using one message for all failures, including user-correctable ones.
- **Spinner dead end:** loading state has no timeout, cancel, or retry expectation.
- **Invisible disabled state:** controls are disabled without explaining the prerequisite.
- **Unowned edge case:** acknowledging a state exists but assigning no design or test expectation.
