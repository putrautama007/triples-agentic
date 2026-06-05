---
name: fail-fast
description: Fail Fast — detect and surface errors as early and loudly as possible
---

# Fail Fast

Detect and surface errors as early and loudly as possible.

- Validate inputs at system boundaries, not deep inside business logic
- Return or throw immediately on invalid state — don't carry partial state forward
- Assertions and guards at function entry are cheaper than debugging corrupted state later
- An error that surfaces at the point of cause is 10x easier to diagnose than one that surfaces two call frames later
