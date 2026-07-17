# agents/

Each file defines one TripleS agent — its identity, persona, domain knowledge, tool guardrails, and step-by-step workflows.

Agents are the **behavior layer**. They contain no domain content themselves; everything they know lives in `skills/` and is referenced by path.

For broader skill authoring rules, trigger descriptions, progressive disclosure, validation prompts, and bundle structure, see `src/skills-best-practices.md`.

---

## File format

```markdown
# AgentName — Role Title
<!-- triples-agent: slug -->
<!-- role: role-id -->
<!-- persona: Short persona description -->
<!-- knowledge: coding-principles/dry.md, planning/prd-writing.md, … -->
<!-- templates: prd.md -->          ← optional, for document-generating agents
<!-- human-in-loop: true|false -->

## Identity
Who the agent is and what they own.

## Persona
How the agent thinks and behaves — opinionated bullet list.

## Knowledge
Which knowledge files to load, with a one-line description of each.

## Tools
Which tools to use and which to avoid (behavioral guardrails).

## Skills
Named workflows — step-by-step instructions for each task.

## Output
What the agent produces and what signal it sends when done.
```

### Metadata comments

| Field | Purpose |
|---|---|
| `triples-agent` | Slug used as the skill/command name after install |
| `role` | Machine-readable role category |
| `persona` | Short label shown in the install banner |
| `knowledge` | Comma-separated list of `skills/` paths to load |
| `templates` | Runtime template name(s) copied from owning skill `references/*-template.md` files |
| `human-in-loop` | Whether this workflow requires human review before handing off |
| `tools` | Claude Code subagent tool allowlist; Codex agents inherit the parent tool surface |
| `codex-model` | Model pinned in the generated Codex custom-agent TOML |

---

## Sections

### `## Tools`
Specifies which tools the agent should and should not use. Claude Code also
receives the source `tools` metadata as an enforced subagent allowlist. Codex
does not receive a custom-agent tool array; its subagents inherit the parent
task's available tools and use these instructions as behavioral guardrails.

- **Planning/document agents** (SeoYeon, JiWoo, YooYeon, NaKyoung, Lynn): `Read` + `Write` only — no `Bash`, no code editing.
- **Design agent** (HyeRin): `Read` + `Write` only — no `Bash`, no code editing.
- **Developer agents** (YuBin, Kaede, YeonJi, SoHyun, Kotone): `Read`, `Edit`, `Write`, `Bash` — blocked from store publish and destructive shell commands.
- **QA agent** (ShiOn): `Read`, `Write`, `Bash` to run tests — blocked from editing source files.

### `## Skills`
Each skill is a named procedure (e.g., `### Implement Backend Task`). Skills are step-by-step workflows, not invocable functions — the AI executes them as instructions.

---

## How agents get installed

The installer (`src/bin/setup.js`) wraps each agent file in platform-specific frontmatter and copies it to the target directory:

| Platform | Output path | Wrapper added |
|---|---|---|
| Claude Code | `.claude/skills/<slug>.md` | YAML `name` + `description` |
| Cursor AI | `.cursor/rules/<slug>.mdc` | `description` + `alwaysApply: false` |
| GitHub Copilot | `.github/instructions/<slug>.instructions.md` | `applyTo: "**"` |
| OpenAI Codex | `.codex/agents/<slug>.toml`; SeoYeon remains `.codex/skills/seoyeon/SKILL.md` | Custom-agent TOML + managed project `AGENTS.md` |
| Windsurf | Section in `.windsurfrules` | Inline heading |

---

## Adding an agent

1. Copy an existing agent file as a template.
2. Update the metadata comments (`triples-agent`, `role`, `persona`, `knowledge`).
3. Fill in Identity, Persona, Knowledge, Tools, Skills, and Output sections.
4. Check the new agent against `src/skills-best-practices.md`.
5. Reinstall via `npx triples-agentic` to push the new agent to your coding assistant.
