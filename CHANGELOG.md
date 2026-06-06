# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.8.0] — 2026-06-06

### Added
- implement immediate handoff after human approval across multiple agents (`4a582e5`)

[2.8.0]: https://github.com/putrautama007/triples-agentic/compare/v2.7.2...v2.8.0

## [2.7.2] — 2026-06-06

### Fixed
- install agents as SKILL.md directories for reliable Claude Code detection (`3f2a2b1`)

[2.7.2]: https://github.com/putrautama007/triples-agentic/compare/v2.7.1...v2.7.2

## [2.7.1] — 2026-06-06

### Fixed
- clean up stale agent directories during Claude install (`50d93fb`)

[2.7.1]: https://github.com/putrautama007/triples-agentic/compare/v2.7.0...v2.7.1

## [2.7.0] — 2026-06-06

### Added
- Enhance project setup capabilities with ChaeWon agent and update documentation (`1f7e64b`)
- Add comprehensive skills and references for planning, quality, and backend testing (`37c494b`)

[2.7.0]: https://github.com/putrautama007/triples-agentic/compare/v2.6.2...v2.7.0

## [2.6.2] — 2026-06-05

### Fixed
- update repository URLs to reflect new ownership (`65ecb10`)

[2.6.2]: https://github.com/putrautama007/triples-agentic/compare/v2.6.1...v2.6.2

## [2.6.1] — 2026-06-05



[2.6.1]: https://github.com/pauplayground007/triples-agentic/compare/v2.6.0...v2.6.1

## [2.6.0] — 2026-06-05

### Added
- add convergence loop and cross-platform handoff to orchestrator (`febc656`)

[2.6.0]: https://github.com/putrautama007/triples-agentic/compare/v2.5.0...v2.6.0

## [2.5.0] — 2026-06-05

### Added
- add UI/UX design agent and mobile design system skills (`bb25b61`)

[2.5.0]: https://github.com/putrautama007/triples-agentic/compare/v2.4.4...v2.5.0

## [2.4.4] — 2026-06-01

### Changed
- split codex setup from installer entrypoint (`bce4785`)

[2.4.4]: https://github.com/putrautama007/triples-agentic/compare/v2.4.3...v2.4.4

## [2.4.3] — 2026-06-01

### Changed
- add workflow_dispatch trigger to release workflow (`50d6117`)

[2.4.3]: https://github.com/putrautama007/triples-agentic/compare/v2.4.2...v2.4.3

## [2.4.2] — 2026-06-01

### Changed
- add registry deployment step to release workflow (`4d46e9c`)

[2.4.2]: https://github.com/putrautama007/triples-agentic/compare/v2.4.1...v2.4.2

## [2.4.1] — 2026-06-01

### Changed
- document curl update command in install.sh and README (`eb81b5c`)

[2.4.1]: https://github.com/putrautama007/triples-agentic/compare/v2.4.0...v2.4.1

## [2.4.0] — 2026-06-01

### Added
- add codex global install support and update command (`511774d`)

[2.4.0]: https://github.com/putrautama007/triples-agentic/compare/v2.3.1...v2.4.0

## [2.3.1] — 2026-06-01

### Fixed
- install from GitHub repo instead of unpublished npm package (`9dc2e9b`)

[2.3.1]: https://github.com/putrautama007/triples-agentic/compare/v2.3.0...v2.3.1

## [2.3.0] — 2026-06-01

### Added
- add safety hooks, agent tool guardrails, curl install, and folder READMEs (`7373c28`)

[2.3.0]: https://github.com/putrautama007/triples-agentic/compare/v2.2.0...v2.3.0

## [2.2.0] — 2026-06-01

### Added
- add TDD knowledge and wire into all developer agents (`ef3b541`)

[2.2.0]: https://github.com/putrautama007/triples-agentic/compare/v2.1.2...v2.2.0

## [2.1.2] — 2026-06-01

### Changed
- split coding-principles into focused files and group web knowledge by layer (`f29d0a2`)

[2.1.2]: https://github.com/putrautama007/triples-agentic/compare/v2.1.1...v2.1.2

## [2.1.1] — 2026-06-01

### Changed
- group mobile knowledge skills into android/ios/flutter subdirs (`acb9c5e`)

[2.1.1]: https://github.com/putrautama007/triples-agentic/compare/v2.1.0...v2.1.1

## [2.1.0] — 2026-06-01

### Added
- chunk knowledge into 41 focused skill files (`5258625`)

[2.1.0]: https://github.com/putrautama007/triples-agentic/compare/v2.0.1...v2.1.0

## [2.0.1] — 2026-05-31

### Fixed
- tighten BREAKING CHANGE detection to require colon suffix (`9ab844c`)

[2.0.1]: https://github.com/putrautama007/triples-agentic/compare/v2.0.0...v2.0.1

## [2.0.0] — 2026-05-31

### Breaking Changes
- add automated release workflow (`5714541`)

### Added
- initial release — TripleS software engineering agent orchestrator (`e468b32`)

### Fixed
- use version-sorted tags and guard against duplicate tag (`9b33aa3`)

[2.0.0]: https://github.com/putrautama007/triples-agentic/compare/v1.0.0...v2.0.0

## [1.0.0] — 2026-05-31

### Added

#### Agents (`src/agents/`)
11 TripleS-named software engineering agents, each with a professional persona, domain knowledge references, and a create → review → evaluate → update skill loop:

| Agent | TripleS Member | Persona |
|-------|---------------|---------|
| `seoyeon` | S1 SeoYeon | Engineering Manager — main orchestrator |
| `jiwoo-prd` | S3 JiWoo | Senior Product Manager — PRD lifecycle |
| `yooyeon-rfc` | S5 YooYeon | Staff Engineer / Tech Lead — RFC lifecycle |
| `nakyoung-tasks` | S7 NaKyoung | Technical Program Manager — task breakdown |
| `yubin-frontend` | S8 YuBin | Principal Frontend Engineer — web UI |
| `kaede-backend` | S9 Kaede | Principal Backend Engineer — APIs & services |
| `yeonji-android` | S12 YeonJi | Senior Android Engineer — Kotlin / Jetpack |
| `sohyun-ios` | S14 SoHyun | Senior iOS Engineer — Swift / SwiftUI |
| `kotone-flutter` | S11 Kotone | Senior Flutter Engineer — Dart cross-platform |
| `lynn-testcase` | S17 Lynn | QA Lead / Test Lead — test case design |
| `shion-qa` | S20 ShiOn | Senior QA Automation Engineer — execution |

#### Knowledge (`src/knowledge/`)
20 domain expertise files organised into 4 groups:
- `planning/` — orchestration, prd, product, rfc, architecture, task-breakdown, estimation
- `web/` — frontend, web, backend, api
- `mobile/` — android, kotlin, ios, swift, flutter, dart
- `quality/` — testing, test-case, qa

#### Templates (`src/templates/`)
4 structured output templates:
- `prd.md` — Product Requirements Document
- `rfc.md` — Request for Comments
- `task-breakdown.md` — Task breakdown with story points and time estimates
- `test-case.md` — Test case suite with traceability matrix

#### Setup CLI (`src/bin/setup.js`)
Zero-dependency interactive skill installer:
- **Interactive wizard** (`npx triples-agentic`) — choose platform and install scope via prompts
- **Direct install** (`npx triples-agentic claude`) — non-interactive, project-level
- **Global install** (`npx triples-agentic claude --global`) — installs to user home config
- **All platforms** (`npx triples-agentic all`) — installs for every supported assistant

#### Platform support
Skills are generated on demand and installed into the correct directory for each coding assistant:

| Platform | Project-level | Global |
|----------|--------------|--------|
| Claude Code | `.claude/skills/` | `~/.claude/skills/` |
| Cursor AI | `.cursor/rules/` | `~/.cursor/rules/` |
| GitHub Copilot | `.github/instructions/` | — |
| OpenAI Codex | `AGENTS.md` | — |
| Windsurf | `.windsurfrules` | `~/.codeium/windsurf/rules/` |

#### Human-in-the-loop review gates
JiWoo (PRD), YooYeon (RFC), NaKyoung (Tasks), and Lynn (Test Cases) each run an iterative create → review → evaluate → update loop. The agent pauses and presents a numbered gap list to the user when quality gates fail, then incorporates clarifications before re-evaluating.

#### Orchestration workflow
Full pipeline diagram in `docs/workflow.md` (Mermaid). Full pipeline available via `/seoyeon run`.

[1.0.0]: https://github.com/putrautama007/triples-agentic/releases/tag/v1.0.0
