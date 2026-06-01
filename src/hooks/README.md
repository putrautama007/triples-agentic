# hooks/

Safety guardrail definitions — the source of truth for dangerous-command blocking across all platforms.

The installer reads these files and generates platform-specific hook configs. Edit here, reinstall, and every platform gets the update.

---

## Files

| File | Purpose |
|---|---|
| `dangerous-commands.json` | Per-platform executable hook configs (Claude Code, Codex, Windsurf) |
| `dangerous-commands.md` | Text-based safety rules for platforms without executable hooks (Cursor, Copilot) |

---

## `*.json` — Executable hook configs

Each JSON file describes one safety rule and carries per-platform configurations under a `platforms` key.

```json
{
  "name": "dangerous-commands",
  "description": "Block dangerous shell commands before execution",
  "platforms": {
    "claude": {
      "event": "PreToolUse",
      "matcher": "Bash",
      "hooks": [{ "type": "command", "command": "...", "statusMessage": "..." }]
    },
    "codex": {
      "event": "PreToolUse",
      "matcher": "Bash",
      "hooks": [{ "type": "command", "command": "...", "statusMessage": "..." }]
    },
    "windsurf": {
      "event": "pre_run_command",
      "command": "...",
      "show_output": true
    }
  }
}
```

### Platform differences

| Platform | Event name | Input key | Block mechanism |
|---|---|---|---|
| Claude Code | `PreToolUse` | `tool_input.command` | stdout JSON `{"decision":"block"}` |
| OpenAI Codex | `PreToolUse` | `tool_input.command` | stdout JSON `{"decision":"block"}` (same engine) |
| Windsurf | `pre_run_command` | `tool_info.command_line` | exit code `2` |

All hooks receive the tool input as JSON on stdin and run as a bash command.

### How the installer uses this

- `platforms.claude` → merged into `.claude/settings.json` under `hooks.PreToolUse`
- `platforms.codex` → appended to `.codex/config.toml` under `[[hooks.PreToolUse]]`
- `platforms.windsurf` → merged into `.windsurf/hooks.json` under `hooks.pre_run_command`

Reinstalling is idempotent — the installer removes the previous triples-agentic entry before writing the new one.

---

## `*.md` — Text-based safety rules

Used for platforms that have no executable hook mechanism. The installer strips the frontmatter and injects the body as an always-applied rule.

```markdown
---
name: dangerous-commands-safety
description: Safety guardrails — never run dangerous commands without explicit user confirmation
platform: all
---

## Safety Guardrails

Never run these commands without explicit user confirmation:
…
```

### How the installer uses this

| Platform | Output |
|---|---|
| Cursor AI | `.cursor/rules/triples-safety.mdc` with `alwaysApply: true` |
| GitHub Copilot | `.github/instructions/triples-safety.instructions.md` with `applyTo: "**"` |

---

## Adding a new safety rule

1. Edit the pattern list in the `command` field of `dangerous-commands.json` (all three platform sections).
2. Add the human-readable description to `dangerous-commands.md`.
3. Reinstall: `npx triples-agentic`.

## Adding a new platform

1. Add a `"<platform>"` key under `platforms` in each `.json` hook file.
2. Add a loader function and settings writer in `src/bin/setup.js`.
3. Call the settings writer from the platform's `install*` function.
