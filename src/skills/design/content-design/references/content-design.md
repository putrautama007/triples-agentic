---
name: content-design
description: UX writing principles, microcopy patterns, error messages, empty states, and tone-of-voice guidelines for product interfaces
---

# Content Design

## Core Principle
Words are UI. Every label, error message, tooltip, and empty state is a design decision with the same weight as spacing or color. Vague copy produces confused users; condescending copy produces frustrated ones.

## UX Writing Principles

### Be clear before being brief
Clarity always wins over conciseness. A 6-word label that is unambiguous beats a 2-word label that requires inference.

### Match the user's mental model
Use the words users use, not internal engineering or business jargon. If research shows users call it "schedule" not "calendar", use "schedule".

### Speak in actions, not features
- ❌ "Profile customization module"
- ✅ "Update your profile"

### Front-load critical information
Headlines and button labels must communicate the most important word first. Users scan from left to right; bury nothing important at the end.

### Avoid hedging language
- ❌ "It seems like something may have gone wrong."
- ✅ "Something went wrong. Try again."

## Button & CTA Labels
- Describe the action, not the result: "Save changes" not "Done"
- Be specific: "Delete account" not just "Delete"
- Pair primary/cancel symmetrically: "Delete account" / "Keep account"
- Never use "Click here" or "Learn more" without context — they are meaningless out of context

## Error Messages
Structure: **What happened** + **Why it matters** + **What to do**

| Type | Pattern | Example |
|------|---------|---------|
| Validation error | State the rule that was violated | "Password must be at least 8 characters" |
| System error | Acknowledge + recovery action | "We couldn't save your changes. Check your connection and try again." |
| Permission error | What's blocked and why | "You don't have permission to edit this workspace. Ask your admin for access." |
| Not found | What's missing + next step | "We couldn't find that page. Go to the homepage." |

**Anti-patterns:**
- Error codes without explanation: "Error 403" → explain what it means
- Blaming the user: "You entered the wrong password" → "The password is incorrect"
- Vague catch-all: "Something went wrong" without recovery path

## Empty States
Every empty state needs three things:
1. **Context** — what is empty and why
2. **Orientation** — what this place is for
3. **Action** — how to fill it or what to do next

| Scenario | Pattern |
|----------|---------|
| First use, empty product | Welcome message + primary action to get started |
| User has no content yet | Explain the value, give creation CTA |
| Search/filter returns nothing | Confirm what was searched, offer to clear filters |
| No permissions to see content | Explain access restriction, provide escalation path |
| Error caused empty state | Separate from content-empty; show error + retry |

## Tooltips & Helper Text
- Tooltips: use for non-obvious icon-only controls; not for critical information (mobile has no hover)
- Helper text (below fields): explain constraints before user errors, not after
- Keep helper text under 60 characters; if more is needed, use a disclosure link

## Loading Copy
- Progress: "Saving your changes…" not just a spinner
- For long operations: indicate what's happening "Generating report…" + estimated time if over 5 seconds
- Never leave users with a blank spinning state over 3 seconds without acknowledgment

## Confirmation Dialogs
Only use confirmation for destructive or hard-to-reverse actions. If used:
- Title: name the action "Delete project?"
- Body: state the consequence "This will remove all tasks and comments. This can't be undone."
- Buttons: "Delete project" / "Keep project" — avoid generic "Yes" / "No"

## Capitalization
- **Sentence case** for all UI labels, error messages, body copy
- **Title Case** for product features, page names, navigation labels only if the product's brand convention requires it
- Never ALL CAPS except for established acronyms

## Content Design Checklist
- [ ] All button labels describe the action, not the result
- [ ] Error messages have what/why/what-to-do structure
- [ ] Empty states have context, orientation, and a next action
- [ ] No jargon, internal abbreviations, or unexplained acronyms
- [ ] Confirmation dialogs use specific language, not generic Yes/No
- [ ] Placeholder text does not serve as a substitute for labels
