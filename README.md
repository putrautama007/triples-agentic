# triples-agentic

A platform-agnostic software engineering agent orchestrator, named after the 24-member K-pop group **TripleS**.

14 specialized agents covering project setup plus the full product-to-delivery lifecycle — from PRD to UI/UX design, RFC, task breakdown, implementation across 5 platforms, automated code quality checks, test cases, and QA.

---

## Agent Roster

| S# | Agent | Persona | Role | Tier | Claude model | Codex model |
|----|-------|---------|------|------|---------------|-------------|
| S21 | **ChaeWon** | Project Setup Specialist | Local Install / Onboarding | Implementation | sonnet | gpt-5.3-codex |
| S1 | **SeoYeon** | Engineering Manager | Main Orchestrator | Orchestrator | — (Skill, not a subagent) | — (Skill, not a subagent) |
| S3 | **JiWoo** | Senior Product Manager | PRD Agent | Planning | opus | gpt-5.5 |
| S2 | **HyeRin** | Senior UI/UX Designer | UI/UX Design | Planning | opus | gpt-5.5 |
| S5 | **YooYeon** | Staff Engineer / Tech Lead | RFC Agent | Planning | opus | gpt-5.5 |
| S7 | **NaKyoung** | Technical Program Manager | Task Breakdown | Planning | opus | gpt-5.5 |
| S8 | **YuBin** | Principal Frontend Engineer | Frontend Web | Implementation | sonnet | gpt-5.3-codex |
| S9 | **Kaede** | Principal Backend Engineer | Backend | Implementation | sonnet | gpt-5.3-codex |
| S12 | **YeonJi** | Senior Android Engineer | Android Native (Kotlin) | Implementation | sonnet | gpt-5.3-codex |
| S14 | **SoHyun** | Senior iOS Engineer | iOS Native (Swift) | Implementation | sonnet | gpt-5.3-codex |
| S11 | **Kotone** | Senior Flutter Engineer | Flutter (Dart) | Implementation | sonnet | gpt-5.3-codex |
| S17 | **Lynn** | QA Lead / Test Lead | Test Cases | Planning | opus | gpt-5.5 |
| S24 | **DaHyun** | Senior DevOps / CI Engineer | Code Quality Check | Implementation | sonnet | gpt-5.3-codex |
| S20 | **ShiOn** | Senior QA Automation Engineer | QA Execution | Implementation | sonnet | gpt-5.3-codex |

SeoYeon is the only agent that stays a Skill (`/seoyeon` on Claude Code, `$seoyeon` on Codex) — she's the pipeline entry point. The other 13 install as native, model-pinned **subagents**: `.claude/agents/*.md` on Claude Code, `.codex/agents/*.toml` on Codex (see [Files installed per platform](#files-installed-per-platform)).

---

## Workflow

```
User → SeoYeon (EM)
         → JiWoo (PRD) [human review loop]
         → HyeRin (UI/UX Design) [human review loop]
         → YooYeon (RFC) [human review loop]
         → NaKyoung (Tasks) [human review loop]
         → YuBin + Kaede + YeonJi + SoHyun + Kotone [parallel dev]
           + Lynn (Test Cases) [human review loop]
         → DaHyun (Check: tests/types/lint) [auto-loop on failure]
         → ShiOn (QA) → Go/No-Go
```

Full Mermaid diagram: [docs/workflow.md](docs/workflow.md)

---

## Installation

### Install via curl (recommended)

```bash
curl -fsSL https://raw.githubusercontent.com/putrautama007/triples-agentic/main/install.sh | bash
```

Checks Node.js ≥ 18, then launches the interactive wizard.

Pass a platform directly to skip the wizard:

```bash
# Claude Code — project-level
curl -fsSL https://raw.githubusercontent.com/putrautama007/triples-agentic/main/install.sh | bash -s -- claude

# Claude Code — global (all projects on your machine)
curl -fsSL https://raw.githubusercontent.com/putrautama007/triples-agentic/main/install.sh | bash -s -- claude --global

# Cursor AI — global
curl -fsSL https://raw.githubusercontent.com/putrautama007/triples-agentic/main/install.sh | bash -s -- cursor --global

# All platforms at once
curl -fsSL https://raw.githubusercontent.com/putrautama007/triples-agentic/main/install.sh | bash -s -- all

# Update all existing installations (auto-detects platforms and scope)
curl -fsSL https://raw.githubusercontent.com/putrautama007/triples-agentic/main/install.sh | bash -s -- update
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
npx triples-agentic codex --global      # → ~/.codex/skills/
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

| Platform | Specialist agents | Orchestrator + knowledge | Hook config |
|---|---|---|---|
| **Claude Code** | `.claude/agents/*.md` (13 model-pinned subagents) | `.claude/skills/seoyeon/` + `.claude/skills/*` + project `CLAUDE.md` | `.claude/settings.json` (PreToolUse hook) |
| **Cursor AI** | — (all agents are rules) | `.cursor/rules/*.mdc` | `.cursor/rules/triples-safety.mdc` (always-applied rule) |
| **GitHub Copilot** | — (all agents are instructions) | `.github/instructions/*.instructions.md` | `.github/instructions/triples-safety.instructions.md` |
| **OpenAI Codex** | `.codex/agents/*.toml` (13 model-pinned subagents) | `.codex/skills/seoyeon/` + `.codex/skills/*` + project `AGENTS.md` | `.codex/config.toml` (PreToolUse hook) |
| **Windsurf** | — (all agents are rules) | `.windsurfrules` | `.windsurf/hooks.json` (pre_run_command hook) |

Subagents are explicit-invocation only (Agent tool on Claude Code, "spawn the `<name>` agent" on Codex) — SeoYeon delegates to them automatically during `/seoyeon run` / `$seoyeon`, or you can invoke one directly. See the [Agent Roster](#agent-roster) for the model pinned to each.

Global install paths:

| Platform | Agents | Skills | Hook config |
|---|---|---|---|
| Claude Code | `~/.claude/agents/` | `~/.claude/skills/` | `~/.claude/settings.json` |
| Cursor AI | — | `~/.cursor/rules/` | `~/.cursor/rules/triples-safety.mdc` |
| OpenAI Codex | `~/.codex/agents/` | `~/.codex/skills/` | `~/.codex/config.toml` |
| Windsurf | — | `~/.codeium/windsurf/rules/` | `~/.codeium/windsurf/hooks.json` |

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
/seoyeon status  Check current run state
/seoyeon resume  Continue after a token-limit reset or closed session
```
SeoYeon walks you through the complete workflow and delegates to each agent.

Long runs are resumable. SeoYeon keeps a ledger at `workspace/RUN_STATE.md` and every agent flushes it after each completed unit of work, so if you hit a usage limit mid-pipeline, `/seoyeon resume` picks up from the last in-flight task — not the start of the stage.

### Specialist subagents (Claude Code Agent tool)
SeoYeon delegates to these automatically during `/seoyeon run`, or invoke one directly:

```
chaewon-init-setup [sonnet]  Explain or audit local TripleS setup
jiwoo-prd          [opus]    Create, review, and finalize a PRD
hyerin-design      [opus]    Create, review, and finalize a design spec
yooyeon-rfc        [opus]    Create, review, and finalize an RFC
nakyoung-tasks     [opus]    Create task breakdown with story points and estimates
yubin-frontend     [sonnet]  Implement frontend web features
kaede-backend      [sonnet]  Implement backend API and services
yeonji-android     [sonnet]  Implement Android (Kotlin + Compose) features
sohyun-ios         [sonnet]  Implement iOS (Swift + SwiftUI) features
kotone-flutter     [sonnet]  Implement Flutter (Dart) cross-platform features
lynn-testcase      [opus]    Create, review, and finalize test cases
dahyun-checker     [sonnet]  Run tests, type checks, and lint; report failures by platform
shion-qa           [sonnet]  Execute tests and produce Go/No-Go report
```

### In Codex
Use `$seoyeon` to orchestrate the full pipeline, or `/skills` to browse the orchestrator skill and bundled knowledge references. Specialist agents are Codex custom subagents — they're explicit-invocation only, so name the agent in your request:

```text
$seoyeon to orchestrate this feature from PRD through QA with human review gates and a QA rework loop.
Ask Codex to spawn the jiwoo-prd agent to draft the PRD for this feature.
Ask Codex to spawn the kaede-backend agent to implement the backend task from the breakdown.
Ask Codex to spawn the chaewon-init-setup agent to explain or audit the local TripleS setup.
```

### Claude + Codex continuity

SeoYeon handoffs include both platform forms so you can continue the same run in either assistant:

```text
Next agent: JiWoo PRD
Claude: invoke the `jiwoo-prd` subagent (Agent tool)
Codex: ask Codex to spawn the `jiwoo-prd` agent
Input artifacts: workspace/PRD.md
Task: Review and revise until READY.
Open decisions: none
```

Artifacts in `workspace/` are the source of truth, not chat memory.

### With other coding assistants
Ask for the agent by name — e.g., "Act as JiWoo and create a PRD for [description]"

---

## Human-in-the-Loop Gates

JiWoo, HyeRin, YooYeon, NaKyoung, and Lynn all have built-in review loops:

1. Agent creates artifact
2. Agent reviews against quality gate checklist
3. Agent evaluates: `READY` or `GAPS: [list]`
4. On gaps: agent presents numbered list to user with specific questions
5. User provides clarifications
6. Agent updates and loops → repeat until `READY`

This ensures PRD, design spec, RFC, task breakdown, and test cases are implementation-ready before moving forward.

## Code Quality Check Loop

After all developer agents finish and test cases are approved, SeoYeon delegates to DaHyun (`dahyun-checker`), who runs tests, type checks, and lint per platform and writes `workspace/CHECK_REPORT.md`. On `CHECK FAILED`, SeoYeon routes the failures (grouped by platform ownership) back to the owning developer agent, then re-invokes DaHyun. ShiOn (QA) only starts once DaHyun signals `CHECK PASSED`.

Escalation happens if the loop runs more than 5 times without a clean check.

## QA Rework Loop

If ShiOn returns `QA COMPLETE — NO-GO`, SeoYeon routes defects back to the owning developer agents, then asks ShiOn to re-test fixes and regression-risk areas. The loop repeats until `QA COMPLETE — GO` or the human explicitly accepts documented release risk.

Escalation happens when the same QA defect survives 2 fix attempts, the same planning gate fails 3 times, or a fix requires changing approved scope, design behavior, or architecture.

---

## Project Structure

```
triples-agentic/
├── install.sh                 # curl installer
├── src/
│   ├── agents/                # 14 agent definitions (identity, persona, knowledge, tools, workflow)
│   │   ├── chaewon-init-setup.md
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
│   │   ├── dahyun-checker.md
│   │   └── shion-qa.md
│   ├── hooks/                 # Safety guardrail definitions (source of truth)
│   │   ├── dangerous-commands.json   # per-platform hook configs
│   │   └── dangerous-commands.md     # text-based safety rules
│   ├── skills/                # Domain expertise — skill bundles (SKILL.md + references/)
│   │   ├── coding-principles/           # coding principles shared by all developer agents
│   │   │   └── dry/, kiss/, yagni/, solid/, slap/, tdd/, …
│   │   ├── planning/          # InitSetup, SeoYeon, JiWoo, YooYeon, NaKyoung
│   │   │   └── init-project/, orchestration/, prd-writing/, rfc-writing/, decision-log-discipline/, implementation-readiness/, …
│   │   ├── design/            # HyeRin
│   │   │   └── design-system/, design-handoff/, state-coverage/, …
│   │   ├── web/
│   │   │   ├── frontend/      # YuBin
│   │   │   │   └── frontend-components/, frontend-state/, frontend-data-fetching/, web-accessibility/, …
│   │   │   └── backend/       # Kaede
│   │   │       └── backend-structure/, backend-testing-strategy/, api-design/, api-security/, …
│   │   ├── mobile/
│   │   │   ├── android/       # YeonJi
│   │   │   │   └── android-architecture/, kotlin-core/, kotlin-concurrency/, …
│   │   │   ├── ios/           # SoHyun
│   │   │   │   └── ios-architecture/, swift-core/, swift-concurrency/, …
│   │   │   └── flutter/       # Kotone
│   │   │       └── flutter-architecture/, dart-core/, dart-async/, …
│   │   └── quality/           # Lynn, ShiOn
│   │       └── testing-strategy/, test-case-writing/, qa-execution/, defect-triage/, regression-selection/, …
│   └── bin/
│       ├── setup.js           # Platform installer CLI entrypoint
│       └── setup/
│           └── codex.js       # Codex-specific installer
├── docs/
│   └── workflow.md            # Full workflow diagram + agent roster
└── CHANGELOG.md

── Generated by installer (not committed to your repo) ────────────────────
your-project/
├── CLAUDE.md                  # Claude Code project guidance (project install)
├── AGENTS.md                  # Codex / agentic coding guidance (project install)
├── .claude/
│   ├── agents/                # 13 model-pinned Claude Code subagents (*.md)
│   ├── skills/seoyeon/        # SeoYeon orchestrator skill
│   ├── skills/                # knowledge skills (coding principles, planning, design, …)
│   └── settings.json          # Claude Code PreToolUse safety hook
├── .cursor/rules/             # Cursor AI agent rules + safety rule
├── .github/instructions/      # Copilot agent instructions + safety instruction
├── .codex/
│   ├── agents/                # 13 model-pinned Codex subagents (*.toml)
│   ├── skills/seoyeon/        # SeoYeon orchestrator skill
│   ├── skills/                # knowledge skills (project install)
│   └── config.toml            # Codex PreToolUse safety hook
├── .windsurf/hooks.json       # Windsurf pre_run_command safety hook
└── .windsurfrules             # Windsurf agent rules
```

---

### `agents/` — Behavioral definitions

Each agent file defines: identity, persona, knowledge references, tool guardrails, skills (workflows), and handoff signals. Domain content lives in `skills/` — agents only reference it.

Each agent includes a `## Tools` section that specifies which tools to use and which to avoid (e.g., planning agents never use `Bash`; QA agent never edits source files).

Two metadata comments control per-agent model pinning at install time: `<!-- model: opus|sonnet -->` (read by the Claude Code installer) and `<!-- codex-model: gpt-5.5|gpt-5.3-codex -->` (read by the Codex installer). `seoyeon.md` has neither — she installs as a Skill, not a subagent, on both platforms.

### `hooks/` — Safety guardrails (source of truth)

Hook definitions live in `src/hooks/` as platform-agnostic source files. The installer reads them and generates the appropriate config for each platform:

- **`.json` files** carry per-platform hook configs under a `platforms` key (`claude`, `codex`, `windsurf`)
- **`.md` files** carry text-based safety rules for platforms without executable hooks (`cursor`, `copilot`)

### `skills/` — Domain expertise

Pure reference `.md` files — no trigger logic, no skills framework. Agents declare which files to load via `<!-- knowledge: ... -->` metadata in their agent file. The knowledge files travel with the agents during install.

---

## Inspired by

[TripleS](https://triples.fandom.com/wiki/TripleS) — a 24-member multi-national K-pop group under MODHAUS, operating on a decentralized system where members rotate between subunits based on fan participation.

Just like TripleS subunits activate for specific projects, TripleS agents activate for specific phases of software delivery.
