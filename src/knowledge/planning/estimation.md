# Estimation Knowledge — Story Points & Time Estimates

## Story Points (Fibonacci Scale)

Story points measure **relative complexity**, not hours. The Fibonacci sequence forces meaningful gaps between sizes.

| Points | Complexity | Typical scope |
|--------|-----------|---------------|
| 1 | Trivial | Rename a field, fix a typo, update a config value |
| 2 | Simple | Add a new field to an existing form, write a simple API endpoint |
| 3 | Moderate | New CRUD feature with basic validation, simple mobile screen |
| 5 | Complex | Feature with multiple states, external API integration, new DB table + API |
| 8 | Large | New user-facing flow across multiple screens, complex business logic |
| 13 | Very large | Epic-level scope — should be decomposed further before sprint |
| 21+ | Too big | Always decompose. This is a placeholder, not an estimate. |

## Time Estimates

Pair story points with time estimates for project planning:

| Story Points | Time Estimate | Notes |
|---|---|---|
| 1 | 1–2 hours | Single developer, minimal review needed |
| 2 | 2–4 hours | Half-day work |
| 3 | 4–8 hours | Full day |
| 5 | 1–2 days | May span sprint boundaries |
| 8 | 2–4 days | Needs careful scoping before start |
| 13 | 1–2 weeks | Decompose before committing |

These are medians. Adjust for:
- **Unfamiliar technology**: +50–100%
- **Cross-team dependencies**: +20%
- **Legacy codebase**: +30–50%
- **Clear requirements + prior art**: -20%

## Estimation Anti-Patterns

| Anti-Pattern | Problem |
|---|---|
| Estimating in ideal hours | Ignores interruptions, meetings, reviews. Use calendar time. |
| PM estimating for engineers | The person doing the work estimates. Always. |
| Anchoring ("I think it's 3, right?") | Biases the group. Use blind voting (planning poker). |
| Skipping estimation for "quick tasks" | Quick tasks are where scope surprises come from. |
| Re-estimating mid-sprint when it's harder | Estimate once; capture actuals for calibration. |

## Planning Poker Protocol

1. Facilitator reads the story and acceptance criteria aloud
2. Each estimator privately selects a card (1, 2, 3, 5, 8, 13)
3. All cards revealed simultaneously
4. Outliers (highest and lowest) explain their reasoning
5. Re-vote until consensus or facilitator decides

## Velocity Tracking

Track actuals vs. estimates every sprint:

```
Sprint N: Committed 32 pts → Completed 28 pts → Velocity: 28
Sprint N+1: Committed 28 pts → Completed 30 pts → Velocity: 29
Sprint N+2: Use rolling 3-sprint average for planning capacity
```

Never punish teams for lower velocity — punishment creates inflated estimates.

## Release Planning with Estimates

```
Remaining story points: 150
Team velocity (3-sprint avg): 30 pts/sprint
Sprints remaining: 150 / 30 = 5 sprints
Sprint length: 2 weeks
Estimated completion: 10 weeks from today
Confidence: Medium (add 20% buffer = 12 weeks for a commitment)
```

Always present estimates as ranges, not point estimates. "8–12 weeks" is more honest than "10 weeks."
