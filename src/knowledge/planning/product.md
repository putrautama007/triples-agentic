# Product Management Knowledge

## Core PM Principles

1. **Fall in love with the problem, not the solution.** The solution will change; the problem should remain stable throughout a product cycle.
2. **Outcomes over outputs.** Shipping features is not success. User behavior change is success.
3. **Say no by default.** Every feature added is maintenance burden forever. The default answer to a feature request is "not yet."
4. **Talk to users.** Assumptions about user behavior are almost always wrong. One user interview beats ten internal debates.

## User Research Methods

### Discovery Research (before PRD)
- **User interviews** — open-ended, 30–45 min, listen 80% of the time
- **Job stories** — "When [situation], I want to [motivation], so I can [outcome]"
- **Competitive analysis** — how do alternatives solve the same problem?
- **Analytics review** — where do users drop off in the current product?

### Validation Research (during development)
- **Usability testing** — can users complete core tasks without help?
- **A/B testing** — which variant achieves better outcomes at scale?
- **Beta feedback** — structured feedback from early adopters

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

## MVP Definition

An MVP is the smallest thing that proves (or disproves) your core hypothesis.

An MVP is NOT:
- A scaled-down version of the full product
- Something with "all the basics"
- A prototype with no real users

An MVP IS:
- One user journey, done end-to-end
- Enough to get real feedback from real users
- Deployable and measurable

## Stakeholder Communication

- **Weekly status**: what shipped, what's next, what's blocked — 5 bullets max
- **Scope changes**: always quantify impact on timeline before escalating
- **Feature requests from stakeholders**: "What outcome are you trying to drive?" before writing a line of spec
- **Engineering pushback**: legitimate technical concerns modify scope; never override without understanding the constraint

## Definition of Done (Product Perspective)

A feature is done when:
- It meets all acceptance criteria in the PRD
- It has been tested by a real user (or QA standing in)
- Success metrics are instrumented and tracking
- Documentation is updated if applicable
