---
name: dry
description: DRY (Don't Repeat Yourself) — every piece of knowledge must have a single, unambiguous representation in the system
---

# DRY — Don't Repeat Yourself

Every piece of knowledge must have a single, unambiguous representation in the system.

- Extract repeated logic into a named function, class, or module
- Repeated data belongs in a constant or configuration, not scattered literals
- Duplication of intent is worse than duplication of text — two functions that do the same thing but look different are the hardest to catch

**When NOT to apply:** Premature abstraction to avoid three similar-looking lines produces worse code than the duplication. Wait for a third repetition before extracting. Deduplication that crosses wrong boundaries creates tight coupling.
