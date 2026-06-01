# agents/

Each file defines one TripleS agent — its identity, persona, domain knowledge, tool guardrails, and step-by-step workflows.

Agents are the **behavior layer**. They contain no domain content themselves; everything they know lives in `knowledge/` and is referenced by path.

---

## File format

```markdown
# AgentName — Role Title
<!-- triples-agent: slug -->
<!-- role: role-id -->
<!-- persona: Short persona description -->
<!-- knowledge: general/dry.md, planning/prd-writing.md, … -->
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
| `knowledge` | Comma-separated list of `knowledge/` paths to load |
| `templates` | Template file(s) in `templates/` used as output scaffolds |
| `human-in-loop` | Whether this agent pauses for user review before handing off |

---

## Sections

### `## Tools`
Specifies which tools the agent should and should not use. This is a behavioral guardrail — not enforced by the platform, but followed by the AI.

- **Planning/document agents** (SeoYeon, JiWoo, YooYeon, NaKyoung, Lynn): `Read` + `Write` only — no `Bash`, no code editing.
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
| OpenAI Codex | Section in `AGENTS.md` | Inline separator |
| Windsurf | Section in `.windsurfrules` | Inline heading |

---

## Adding an agent

1. Copy an existing agent file as a template.
2. Update the metadata comments (`triples-agent`, `role`, `persona`, `knowledge`).
3. Fill in Identity, Persona, Knowledge, Tools, Skills, and Output sections.
4. Reinstall via `npx triples-agentic` to push the new agent to your coding assistant.
