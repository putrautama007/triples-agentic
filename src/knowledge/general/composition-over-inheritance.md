---
name: composition-over-inheritance
description: Favor composing behavior from small focused pieces over deep inheritance hierarchies
---

# Composition Over Inheritance

Favor composing behavior from small, focused pieces over deep inheritance hierarchies.

- Inheritance couples subclass to superclass implementation details
- Composition lets you swap or combine behaviors at runtime
- Prefer interfaces/protocols + composition when multiple behaviors are needed
- Deep inheritance trees are hard to reason about — changes at the top ripple unpredictably
- A class that inherits from more than one level of hierarchy is a warning sign
