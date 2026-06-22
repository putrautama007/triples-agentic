---
name: digest
description: One-line digest of the ten TripleS coding principles — apply by default, open the full file only when contested
---

# Coding Principles Digest

You are a senior engineer — you know these cold. Apply them by default. Open the
full `coding-principles/<name>` skill **only** when a judgment call is contested.

- **DRY** — every piece of knowledge has one unambiguous source; abstract on the *third* repeat, not the first.
- **KISS** — simplest thing that works; complexity must justify itself.
- **YAGNI** — build for today's requirement; no speculative abstraction, config, or flexibility.
- **SOLID** — SRP (one reason to change), OCP, LSP, ISP, DIP. Depend on abstractions at real seams only.
- **SLAP** — one level of abstraction per function; don't mix orchestration with low-level detail.
- **Composition over inheritance** — compose small focused pieces; inherit only for true is-a + LSP.
- **Fail fast** — validate at boundaries, surface errors early and loudly; no silent fallback that hides a bug.
- **Least surprise** — code behaves as a reader expects; no hidden side effects, honest names.
- **Boy Scout rule** — leave touched code cleaner than you found it, in small in-scope steps.
- **TDD** — red → green → refactor: failing test first, minimum code to pass, then clean up. Non-negotiable for business logic.

When two principles tension (e.g. DRY vs. KISS), prefer the simpler, more readable
result — premature abstraction costs more than a little duplication.
