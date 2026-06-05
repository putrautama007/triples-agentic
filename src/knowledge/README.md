# knowledge/

Domain expertise loaded by agents at runtime. Pure reference `.md` files — no trigger logic, no skills framework.

Agents declare which files to load via `<!-- knowledge: ... -->` metadata in their agent definition. The AI reads and applies these files as context when it activates.

---

## File format

Every knowledge file has YAML frontmatter followed by markdown content:

```markdown
---
name: api-design
description: REST and GraphQL API design conventions — URL structure, versioning, pagination, filtering, and documentation
---

# API Design

## REST URL Conventions
…
```

| Field | Purpose |
|---|---|
| `name` | Slug used as the skill name when installed to Claude Code |
| `description` | One-line summary shown in the install banner and used as the skill trigger description |

The content is plain markdown — headings, bullet lists, code blocks. Write it as a reference document, not a tutorial.

---

## Directory structure

```
knowledge/
├── general/           Coding principles — loaded by all developer agents
│   ├── dry.md         Don't Repeat Yourself
│   ├── kiss.md        Keep It Simple
│   ├── yagni.md       You Aren't Gonna Need It
│   ├── solid.md       SOLID principles
│   ├── slap.md        Single Level of Abstraction
│   ├── tdd.md         Test-Driven Development
│   ├── fail-fast.md   Validate at boundaries, surface errors early
│   ├── least-surprise.md  Code behaves as readers expect
│   ├── boy-scout-rule.md  Leave code cleaner than you found it
│   └── composition-over-inheritance.md
│
├── planning/          Loaded by SeoYeon, JiWoo, YooYeon, NaKyoung
│   ├── orchestration.md         Workflow sequencing, delegation, escalation
│   ├── prd-writing.md           PRD structure, writing standards, anti-patterns
│   ├── prd-quality-gates.md     PRD review checklist
│   ├── product-principles.md    PM principles, prioritization frameworks
│   ├── product-prioritization.md
│   ├── rfc-writing.md           RFC structure, ADR format, anti-patterns
│   ├── rfc-quality-gates.md     RFC review checklist
│   ├── architecture-patterns.md System design, database selection, scalability
│   ├── architecture-database.md Database design and selection criteria
│   ├── architecture-security.md Security fundamentals for system design
│   ├── task-decomposition.md    Task hierarchy, story mapping, readiness checklist
│   ├── task-readiness.md        Task readiness criteria
│   └── estimation.md            Fibonacci points, time estimation, planning poker
│
├── design/            Loaded by HyeRin
│   ├── ux-research.md         Interviews, usability testing, synthesis, opportunity framing
│   ├── interaction-design.md  User flows, IA, forms, feedback, edge states
│   ├── visual-design.md       Typography, color, spacing, hierarchy, component states
│   ├── design-system.md       Tokens, component taxonomy, documentation, reuse patterns
│   ├── design-handoff.md      Annotation standards, component API contracts, implementation-readiness checklist
│   ├── cross-platform-design.md  Web/iOS/Android/Flutter conventions, navigation, motion adaptation
│   ├── mobile-design-system.md Mobile token mapping, Dynamic Type, `sp` units, safe areas, iconography, motion, platform component usage
│   ├── content-design.md      UX writing, microcopy, error messages, empty states, confirmations
│   └── design-system-audit.md Token health, coverage gaps, component lifecycle, deprecation workflow
│
├── web/
│   ├── frontend/      Loaded by YuBin
│   │   ├── frontend-components.md  React/Vue/Angular patterns, component design
│   │   ├── frontend-state.md       State management patterns
│   │   ├── frontend-performance.md Bundle size, rendering, lazy loading
│   │   ├── web-accessibility.md    WCAG 2.1 AA, semantic HTML, ARIA
│   │   ├── web-performance.md      LCP, CLS, Core Web Vitals
│   │   └── web-security.md         CSP, XSS prevention, secure headers
│   └── backend/       Loaded by Kaede (api-design.md also loaded by Kotone)
│       ├── backend-structure.md    Project layout, layered architecture
│       ├── backend-security.md     Input validation, parameterized queries, secrets
│       ├── api-design.md           REST/GraphQL conventions, versioning, pagination
│       └── api-security.md         Auth, rate limiting, OWASP API top 10
│
├── mobile/
│   ├── android/       Loaded by YeonJi
│   │   ├── android-architecture.md  MVVM, Compose, Hilt, Navigation, Material 3
│   │   ├── android-platform.md      Play Store, permissions, lifecycle
│   │   ├── kotlin-core.md           Null safety, sealed classes, extension functions
│   │   └── kotlin-concurrency.md   Coroutines, Flow, structured concurrency
│   ├── ios/           Loaded by SoHyun
│   │   ├── ios-architecture.md      SwiftUI, MVVM, NavigationStack, Apple HIG
│   │   ├── ios-platform.md          App Store, privacy manifest, safe areas
│   │   ├── swift-core.md            Optionals, value types, async/await, protocols
│   │   └── swift-concurrency.md    actors, async/await, Task, structured concurrency
│   └── flutter/       Loaded by Kotone
│       ├── flutter-architecture.md  Riverpod, GoRouter, Material 3, widget design
│       ├── flutter-platform.md      Play Store + App Store, platform channels
│       ├── dart-core.md             Null safety, collections, classes, mixins
│       └── dart-async.md            async/await, Future, Stream, Isolate
│
└── quality/           Loaded by Lynn and ShiOn
    ├── testing-strategy.md    Testing pyramid, shift-left, anti-patterns
    ├── testing-types.md       Unit, integration, E2E, exploratory definitions
    ├── test-case-writing.md   Test case structure, priority levels, quality gates
    ├── test-case-quality.md   Quality checklist for test case review
    ├── qa-execution.md        Execution process, bug report format, go/no-go criteria
    └── qa-reporting.md        QA report structure, metrics, defect classification
```

---

## How knowledge gets installed

The installer copies each knowledge file to the target platform directory alongside the agent files:

| Platform | Installed path |
|---|---|
| Claude Code | `.claude/skills/knowledge/<group>/<file>.md` (existing frontmatter kept) |
| Cursor AI | `.cursor/rules/knowledge/<group>/<file>.mdc` (frontmatter rewritten for Cursor) |
| GitHub Copilot | `.github/instructions/knowledge/<group>/<file>.instructions.md` |
| OpenAI Codex | Inline section in `AGENTS.md` (frontmatter stripped) |
| Windsurf | Inline section in `.windsurfrules` (frontmatter stripped) |

---

## Adding a knowledge file

1. Create a `.md` file in the appropriate subdirectory.
2. Add frontmatter with `name` and `description`.
3. Write the content as a reference document.
4. Reference it in the agent's `<!-- knowledge: ... -->` metadata and add a line to its `## Knowledge` section.
5. Reinstall: `npx triples-agentic`.

Knowledge files are **read-only reference** — they describe what to know, not what to do. Procedural steps belong in agent `## Skills` sections.
