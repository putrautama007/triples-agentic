---
name: least-surprise
description: Principle of Least Surprise — code should behave in the way a reader would expect
---

# Principle of Least Surprise

Code should behave in the way a reader would expect.

- Functions named `getUser` should not modify state
- A method that returns a list should never return `null` — return an empty list
- Avoid side effects in places where callers don't expect them (constructors, getters, equality checks)
- Consistent naming conventions matter: if `save()` persists to DB everywhere, it should do so everywhere
