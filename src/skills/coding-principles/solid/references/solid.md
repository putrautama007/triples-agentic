---
name: solid
description: SOLID principles for object-oriented design — SRP, OCP, LSP, ISP, DIP
---

# SOLID Principles (Object-Oriented Design)

## S — Single Responsibility Principle
A class (or module, or function) should have one reason to change.

- A class that handles both business logic and database access has two reasons to change
- Split responsibilities along the axis of change: what causes this to need updating?
- Small, focused units are easier to test, reuse, and rename

## O — Open/Closed Principle
Open for extension, closed for modification.

- Add new behavior by adding new code, not by editing existing code
- Use polymorphism, strategy pattern, or composition to extend behavior
- Modifying existing code risks breaking existing behavior; adding new code does not

## L — Liskov Substitution Principle
Subtypes must be substitutable for their base types without breaking the program.

- If `class B extends A`, then anywhere `A` is used, `B` must work correctly
- Violations: a subclass that throws on a method the base class supports, or returns a narrower result
- If you find yourself overriding a method to do nothing or throw, the inheritance hierarchy is wrong

## I — Interface Segregation Principle
No client should be forced to depend on methods it does not use.

- Prefer several small, focused interfaces over one large general-purpose interface
- A class that implements a large interface but only needs 2 of 10 methods is a sign the interface should be split
- Applies to function parameters too: pass only what the callee actually needs

## D — Dependency Inversion Principle
High-level modules should not depend on low-level modules. Both should depend on abstractions.

- Business logic should not import a specific database library directly — it should depend on a repository interface
- Makes high-level policy independent of implementation details
- Enables swapping implementations (e.g., real DB vs. in-memory for tests) without changing business logic

## When to apply SOLID
SOLID is most valuable at module and service boundaries. Inside a small, private function, rigid SOLID application adds noise without benefit. Don't add abstractions until you have two concrete use cases.
