# triples-agentic

A platform-agnostic software engineering agent orchestrator, named after the 24-member K-pop group **TripleS**.

11 specialized agents covering the full product-to-delivery lifecycle — from PRD to RFC, task breakdown, implementation across 5 platforms, test cases, and QA.

---

## Agent Roster

| S# | Agent | Persona | Role |
|----|-------|---------|------|
| S1 | **SeoYeon** | Engineering Manager | Main Orchestrator |
| S3 | **JiWoo** | Senior Product Manager | PRD Agent |
| S5 | **YooYeon** | Staff Engineer / Tech Lead | RFC Agent |
| S7 | **NaKyoung** | Technical Program Manager | Task Breakdown |
| S8 | **YuBin** | Principal Frontend Engineer | Frontend Web |
| S9 | **Kaede** | Principal Backend Engineer | Backend |
| S12 | **YeonJi** | Senior Android Engineer | Android Native (Kotlin) |
| S14 | **SoHyun** | Senior iOS Engineer | iOS Native (Swift) |
| S11 | **Kotone** | Senior Flutter Engineer | Flutter (Dart) |
| S17 | **Lynn** | QA Lead / Test Lead | Test Cases |
| S20 | **ShiOn** | Senior QA Automation Engineer | QA Execution |

---

## Workflow

```
User → SeoYeon (EM)
         → JiWoo (PRD) [human review loop]
         → YooYeon (RFC) [human review loop]
         → NaKyoung (Tasks) [human review loop]
         → YuBin + Kaede + YeonJi + SoHyun + Kotone [parallel dev]
           + Lynn (Test Cases) [human review loop]
         → ShiOn (QA) → Go/No-Go
```

Full Mermaid diagram: [docs/workflow.md](docs/workflow.md)

---

## Installation

### Install via curl (recommended)

```bash
curl -fsSL https://raw.githubusercontent.com/pauplayground007/triples-agentic/main/install.sh | bash
```

Checks Node.js ≥ 18, then launches the interactive wizard.

Pass a platform directly to skip the wizard:

```bash
# Claude Code — project-level
curl -fsSL https://raw.githubusercontent.com/pauplayground007/triples-agentic/main/install.sh | bash -s -- claude

# Claude Code — global (all projects on your machine)
curl -fsSL https://raw.githubusercontent.com/pauplayground007/triples-agentic/main/install.sh | bash -s -- claude --global

# Cursor AI — global
curl -fsSL https://raw.githubusercontent.com/pauplayground007/triples-agentic/main/install.sh | bash -s -- cursor --global

# All platforms at once
curl -fsSL https://raw.githubusercontent.com/pauplayground007/triples-agentic/main/install.sh | bash -s -- all
```

---

### Interactive wizard

```bash
npx triples-agentic
```

```
╔══════════════════════════════════════════════════╗
║  TripleS Agentic — Skill Plugin Setup            ║
║  Software Engineering Agent Orchestrator         ║
╚══════════════════════════════════════════════════╝

Which coding assistant are you installing for?
  1. Claude Code
  2. Cursor AI
  3. GitHub Copilot
  4. OpenAI Codex
  5. Windsurf
  6. All of the above

Install scope?
  1. Global — applies to all your projects  (~/.claude/skills/)
  2. Project — current directory only       (./.claude/skills/)
```

---

### Direct install (non-interactive)

```bash
# Project-level (run inside your project directory)
npx triples-agentic claude      # Claude Code
npx triples-agentic cursor      # Cursor AI
npx triples-agentic copilot     # GitHub Copilot
npx triples-agentic codex       # OpenAI Codex
npx triples-agentic windsurf    # Windsurf
npx triples-agentic all         # all platforms

# Global install
npx triples-agentic claude --global     # → ~/.claude/skills/
npx triples-agentic cursor --global     # → ~/.cursor/rules/
npx triples-agentic codex --global      # → ~/.codex/AGENTS.md
npx triples-agentic windsurf --global   # → ~/.codeium/windsurf/rules/

# Install into a specific directory
npx triples-agentic claude --target /path/to/project

# Update all existing installations (auto-detects platforms and scope)
npx triples-agentic update
```

---

### Install as a global CLI

```bash
npm install -g triples-agentic
triples-agentic              # interactive wizard
triples-agentic claude       # direct install for Claude Code
```

---

### Files installed per platform

| Platform | Agent skills | Hook config |
|---|---|---|
| **Claude Code** | `.claude/skills/*.md` | `.claude/settings.json` (PreToolUse hook) |
| **Cursor AI** | `.cursor/rules/*.mdc` | `.cursor/rules/triples-safety.mdc` (always-applied rule) |
| **GitHub Copilot** | `.github/instructions/*.instructions.md` | `.github/instructions/triples-safety.instructions.md` |
| **OpenAI Codex** | `AGENTS.md` (project) / `~/.codex/AGENTS.md` (global) | `.codex/config.toml` / `~/.codex/config.toml` (PreToolUse hook) |
| **Windsurf** | `.windsurfrules` | `.windsurf/hooks.json` (pre_run_command hook) |

Global install paths:

| Platform | Skills | Hook config |
|---|---|---|
| Claude Code | `~/.claude/skills/` | `~/.claude/settings.json` |
| Cursor AI | `~/.cursor/rules/` | `~/.cursor/rules/triples-safety.mdc` |
| OpenAI Codex | `~/.codex/AGENTS.md` | `~/.codex/config.toml` |
| Windsurf | `~/.codeium/windsurf/rules/` | `~/.codeium/windsurf/hooks.json` |

---

## Safety Guardrails

Every install includes safety enforcement that blocks dangerous shell commands before they run.

### How it works per platform

| Platform | Mechanism | Enforcement |
|---|---|---|
| **Claude Code** | `PreToolUse` hook in `.claude/settings.json` | Hard — harness blocks the command |
| **OpenAI Codex** | `PreToolUse` hook in `.codex/config.toml` | Hard — same engine as Claude Code |
| **Windsurf** | `pre_run_command` hook in `.windsurf/hooks.json` | Hard — exit code 2 blocks execution |
| **Cursor AI** | `alwaysApply: true` rule in `.cursor/rules/` | Soft — AI-level instruction |
| **GitHub Copilot** | `applyTo: "**"` instruction in `.github/instructions/` | Soft — AI-level instruction |

### Blocked commands

- **Filesystem** — `rm -rf`, `rm -fr`, recursive force delete
- **Git destructive** — `git reset --hard`, `git checkout --`, `git restore .`
- **Git push force** — `git push --force`, `git push -f`
- **SQL destructive** — `DROP TABLE`, `DROP DATABASE`, `DELETE FROM <table>;`
- **Store publish** — `fastlane deliver/supply`, `gradlew publishBundle`, `xcrun altool`
- **Package publish** — `npm publish`, `npx ... publish`

Safe commands (`npm test`, `git push origin branch`, `flutter test`, etc.) pass through without interruption.

### Adding or editing safety rules

All hook definitions live in [`src/hooks/`](src/hooks/):

- `dangerous-commands.json` — per-platform hook configs (Claude Code, Codex, Windsurf)
- `dangerous-commands.md` — text-based safety rules (Cursor, Copilot)

Edit these files and reinstall to update the rules across all platforms.

---

## Usage

### Full pipeline (Claude Code)
```
/seoyeon run
```
SeoYeon walks you through the complete workflow and delegates to each agent.

### Individual agents
```
/jiwoo-prd       Create, review, and finalize a PRD
/yooyeon-rfc     Create, review, and finalize an RFC
/nakyoung-tasks  Create task breakdown with story points and estimates
/yubin-frontend  Implement frontend web features
/kaede-backend   Implement backend API and services
/yeonji-android  Implement Android (Kotlin + Compose) features
/sohyun-ios      Implement iOS (Swift + SwiftUI) features
/kotone-flutter  Implement Flutter (Dart) cross-platform features
/lynn-testcase   Create, review, and finalize test cases
/shion-qa        Execute tests and produce Go/No-Go report
/seoyeon status  Check current run state
```

### With other coding assistants
Ask for the agent by name — e.g., "Act as JiWoo and create a PRD for [description]"

---

## Human-in-the-Loop Gates

JiWoo, YooYeon, NaKyoung, and Lynn all have built-in review loops:

1. Agent creates artifact
2. Agent reviews against quality gate checklist
3. Agent evaluates: `READY` or `GAPS: [list]`
4. On gaps: agent presents numbered list to user with specific questions
5. User provides clarifications
6. Agent updates and loops → repeat until `READY`

This ensures PRD, RFC, task breakdown, and test cases are implementation-ready before moving forward.

---

## Project Structure

```
triples-agentic/
├── install.sh                 # curl installer
├── src/
│   ├── agents/                # 11 agent definitions (identity, persona, knowledge, tools, workflow)
│   │   ├── seoyeon.md
│   │   ├── jiwoo-prd.md
│   │   ├── yooyeon-rfc.md
│   │   ├── nakyoung-tasks.md
│   │   ├── yubin-frontend.md
│   │   ├── kaede-backend.md
│   │   ├── yeonji-android.md
│   │   ├── sohyun-ios.md
│   │   ├── kotone-flutter.md
│   │   ├── lynn-testcase.md
│   │   └── shion-qa.md
│   ├── hooks/                 # Safety guardrail definitions (source of truth)
│   │   ├── dangerous-commands.json   # per-platform hook configs
│   │   └── dangerous-commands.md     # text-based safety rules
│   ├── knowledge/             # Domain expertise loaded by agents (knowledge-only .md files)
│   │   ├── general/           # coding principles shared by all developer agents
│   │   │   └── dry.md, kiss.md, yagni.md, solid.md, slap.md, tdd.md, …
│   │   ├── planning/          # SeoYeon, JiWoo, YooYeon, NaKyoung
│   │   │   └── orchestration.md, prd-writing.md, rfc-writing.md, task-decomposition.md, …
│   │   ├── web/
│   │   │   ├── frontend/      # YuBin
│   │   │   │   └── frontend-components.md, frontend-state.md, web-accessibility.md, …
│   │   │   └── backend/       # Kaede
│   │   │       └── backend-structure.md, api-design.md, api-security.md, …
│   │   ├── mobile/
│   │   │   ├── android/       # YeonJi
│   │   │   │   └── android-architecture.md, kotlin-core.md, kotlin-concurrency.md, …
│   │   │   ├── ios/           # SoHyun
│   │   │   │   └── ios-architecture.md, swift-core.md, swift-concurrency.md, …
│   │   │   └── flutter/       # Kotone
│   │   │       └── flutter-architecture.md, dart-core.md, dart-async.md, …
│   │   └── quality/           # Lynn, ShiOn
│   │       └── testing-strategy.md, test-case-writing.md, qa-execution.md, …
│   ├── templates/             # Output document templates
│   │   ├── prd.md             # → workspace/PRD.md
│   │   ├── rfc.md             # → workspace/RFC.md
│   │   ├── task-breakdown.md  # → workspace/TASK_BREAKDOWN.md
│   │   └── test-case.md       # → workspace/TEST_CASES.md
│   └── bin/
│       └── setup.js           # Platform installer CLI
├── docs/
│   └── workflow.md            # Full workflow diagram + agent roster
└── CHANGELOG.md

── Generated by installer (not committed to your repo) ────────────────────
your-project/
├── .claude/
│   ├── skills/                # Claude Code agent + knowledge skills
│   └── settings.json          # Claude Code PreToolUse safety hook
├── .cursor/rules/             # Cursor AI agent rules + safety rule
├── .github/instructions/      # Copilot agent instructions + safety instruction
├── .codex/config.toml         # Codex PreToolUse safety hook
├── .windsurf/hooks.json       # Windsurf pre_run_command safety hook
├── AGENTS.md                  # Codex agent context
└── .windsurfrules             # Windsurf agent rules
```

---

### `agents/` — Behavioral definitions

Each agent file defines: identity, persona, knowledge references, tool guardrails, skills (workflows), and handoff signals. Domain content lives in `knowledge/` — agents only reference it.

Each agent includes a `## Tools` section that specifies which tools to use and which to avoid (e.g., planning agents never use `Bash`; QA agent never edits source files).

### `hooks/` — Safety guardrails (source of truth)

Hook definitions live in `src/hooks/` as platform-agnostic source files. The installer reads them and generates the appropriate config for each platform:

- **`.json` files** carry per-platform hook configs under a `platforms` key (`claude`, `codex`, `windsurf`)
- **`.md` files** carry text-based safety rules for platforms without executable hooks (`cursor`, `copilot`)

### `knowledge/` — Domain expertise

Pure reference `.md` files — no trigger logic, no skills framework. Agents declare which files to load via `<!-- knowledge: ... -->` metadata in their agent file. The knowledge files travel with the agents during install.

---

## Inspired by

[TripleS](https://triples.fandom.com/wiki/TripleS) — a 24-member multi-national K-pop group under MODHAUS, operating on a decentralized system where members rotate between subunits based on fan participation.

Just like TripleS subunits activate for specific projects, TripleS agents activate for specific phases of software delivery.
