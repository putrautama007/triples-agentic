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

### Interactive setup wizard (recommended)

```bash
npx triples-agentic
```

Launches a guided setup — choose your coding assistant and install scope:

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
# Project-level (inside your project directory)
npx triples-agentic claude      # → .claude/skills/         (Claude Code)
npx triples-agentic cursor      # → .cursor/rules/           (Cursor AI)
npx triples-agentic copilot     # → .github/instructions/    (GitHub Copilot)
npx triples-agentic codex       # → AGENTS.md                (OpenAI Codex)
npx triples-agentic windsurf    # → .windsurfrules           (Windsurf)
npx triples-agentic all         # → all platforms

# Global install (applies to every project on your machine)
npx triples-agentic claude --global     # → ~/.claude/skills/
npx triples-agentic cursor --global     # → ~/.cursor/rules/
npx triples-agentic windsurf --global   # → ~/.codeium/windsurf/rules/

# Install into a specific project directory
npx triples-agentic claude --target /path/to/project
```

---

### Install via npm (global CLI)

```bash
npm install -g triples-agentic

# Then from any project:
triples-agentic              # interactive wizard
triples-agentic claude       # direct install for Claude Code
triples-agentic claude --global   # install globally
```

---

### Skill file locations after install

| Coding Assistant | Project-level | Global |
|---|---|---|
| Claude Code | `.claude/skills/*.md` | `~/.claude/skills/*.md` |
| Cursor AI | `.cursor/rules/*.mdc` | `~/.cursor/rules/*.mdc` |
| GitHub Copilot | `.github/instructions/*.instructions.md` | — |
| OpenAI Codex | `AGENTS.md` | — |
| Windsurf | `.windsurfrules` | `~/.codeium/windsurf/rules/.windsurfrules` |

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

## Project Structure

```
triples-agentic/               ← clone this repo
├── src/
│   ├── agents/                # 11 agent definitions (persona, skills, workflow)
│   ├── knowledge/
│   │   ├── planning/          # orchestration, prd, product, rfc, architecture, task-breakdown, estimation
│   │   ├── web/               # frontend, web, backend, api
│   │   ├── mobile/            # android, kotlin, ios, swift, flutter, dart
│   │   └── quality/           # testing, test-case, qa
│   ├── templates/             # prd, rfc, task-breakdown, test-case
│   └── bin/
│       └── setup.js           # Skill installer CLI
├── docs/
│   └── workflow.md            # Full workflow diagram + agent roster
├── CHANGELOG.md
├── .gitignore                 # Excludes generated platform files
└── README.md

── Generated by setup (not committed) ──────────────────────
your-project/
├── .claude/skills/            # Claude Code — generated by setup
├── .cursor/rules/             # Cursor AI   — generated by setup
├── .github/instructions/      # Copilot     — generated by setup
├── AGENTS.md                  # Codex       — generated by setup
└── .windsurfrules             # Windsurf    — generated by setup
```

### `agents/` — Lean behavioral definitions
Each agent file defines: identity, persona, knowledge references, skills, and handoff signals. No domain content — that lives in `knowledge/`.

### `knowledge/` — Domain expertise (grouped by domain)

```
knowledge/
├── planning/         → SeoYeon, JiWoo, YooYeon, NaKyoung
│   ├── orchestration.md
│   ├── prd.md
│   ├── product.md
│   ├── rfc.md
│   ├── architecture.md
│   ├── task-breakdown.md
│   └── estimation.md
├── web/              → YuBin, Kaede (+ shared: api.md → Kotone)
│   ├── frontend.md
│   ├── web.md
│   ├── backend.md
│   └── api.md
├── mobile/           → YeonJi, SoHyun, Kotone
│   ├── android.md
│   ├── kotlin.md
│   ├── ios.md
│   ├── swift.md
│   ├── flutter.md
│   └── dart.md
└── quality/          → Lynn, ShiOn (testing.md shared by both)
    ├── testing.md
    ├── test-case.md
    └── qa.md
```

### `templates/` — Output document templates

```
templates/
├── prd.md            → JiWoo generates workspace/PRD.md
├── rfc.md            → YooYeon generates workspace/RFC.md
├── task-breakdown.md → NaKyoung generates workspace/TASK_BREAKDOWN.md
└── test-case.md      → Lynn generates workspace/TEST_CASES.md
```

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

## Platform Adapter Formats

| Platform | Format | Location |
|----------|--------|----------|
| Claude Code | Markdown skill files | `.claude/skills/*.md` |
| Cursor | MDC rule files | `.cursor/rules/*.mdc` |
| GitHub Copilot | Instruction files | `.github/instructions/*.instructions.md` |
| OpenAI Codex | Single combined file | `AGENTS.md` |
| Windsurf | Single rules file | `.windsurfrules` |

---

## Inspired by

[TripleS](https://triples.fandom.com/wiki/TripleS) — a 24-member multi-national K-pop group under MODHAUS, operating on a decentralized system where members rotate between subunits based on fan participation.

Just like TripleS subunits activate for specific projects, TripleS agents activate for specific phases of software delivery.
