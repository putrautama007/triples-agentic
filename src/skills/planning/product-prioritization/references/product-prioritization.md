---
name: product-prioritization
description: Prioritization frameworks (RICE, MoSCoW), stakeholder communication, and feature request handling
---

# Product Prioritization & Stakeholder Communication

## Prioritization Frameworks

### RICE Score
- **Reach** — how many users affected per time period?
- **Impact** — how much does it move the metric? (1=minimal, 3=massive)
- **Confidence** — how sure are we? (expressed as %)
- **Effort** — person-weeks to build
- Score = (Reach × Impact × Confidence) / Effort

### MoSCoW
- **Must have** — without this, the product fails
- **Should have** — important but workarounds exist
- **Could have** — nice to have, cut if time is tight
- **Won't have** — explicitly out of scope for this release

### Opportunity Scoring
Rate each opportunity on two axes:
- How important is this to users? (1–10)
- How satisfied are users with current solutions? (1–10)

High importance + low satisfaction = highest priority opportunity.

## Stakeholder Communication

- **Weekly status**: what shipped, what's next, what's blocked — 5 bullets max
- **Scope changes**: always quantify impact on timeline before escalating
- **Feature requests from stakeholders**: "What outcome are you trying to drive?" before writing a line of spec
- **Engineering pushback**: legitimate technical concerns modify scope; never override without understanding the constraint
- **Conflict resolution**: trace every requirement back to a user need; if it can't be traced, cut it

## Handling Feature Requests

1. "What problem does this solve for the user?"
2. "What happens if we don't build this?"
3. "How many users face this problem, and how often?"
4. "What's the simplest version that proves value?"

Never say "yes, we'll build it." Say "yes, we'll consider it in the next planning cycle against other priorities."
