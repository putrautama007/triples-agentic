# skills/

Domain expertise lives as discoverable source skill bundles. Each bundle uses the Codex skill best-practice shape:

```text
skill-name/
├── SKILL.md              # required: metadata + lean routing instructions, under 500 lines
├── references/           # full just-in-time reference docs + templates, one level deep
├── scripts/              # optional deterministic CLIs only
└── assets/               # optional static assets
```

Templates are co-located inside the owning skill's `references/` directory, suffixed `-template.md`.

Knowledge bundles are reference material, not implementation agents. Agent workflow behavior lives in `src/agents/*.md`; domain rules live here and are copied into installed agent references.

For authoring rules, trigger descriptions, progressive disclosure, validation prompts, and bundle structure, see `src/skills-best-practices.md`.

---

## Bundle format

Every knowledge bundle has a `SKILL.md` with YAML frontmatter and a short body:

```markdown
---
name: api-design
description: "API design conventions for REST and GraphQL. Use when designing or reviewing API contracts. Do not use for frontend component work."
---

# Api Design

## Purpose
Use this skill as just-in-time reference material for TripleS web/backend work.

## Procedure
1. Read `references/api-design.md` only when this exact domain guidance is needed.
2. Apply the reference checklists, conventions, anti-patterns, and scoring rules exactly.
3. Keep behavior in owning TripleS agent skills; this bundle provides knowledge only.

## Reference
- `references/api-design.md`
```

Reference docs hold the full domain detail. Templates are placed alongside references with a `-template.md` suffix.

---

## Directory structure

```text
skills/
├── coding-principles/           Coding principles — loaded by developer agents
├── planning/          Loaded by SeoYeon, JiWoo, YooYeon, NaKyoung
├── design/            Loaded by HyeRin
├── web/
│   ├── frontend/      Loaded by YuBin
│   └── backend/       Loaded by Kaede and API-consuming agents
├── mobile/
│   ├── android/       Loaded by YeonJi
│   ├── ios/           Loaded by SoHyun
│   └── flutter/       Loaded by Kotone
└── quality/           Loaded by Lynn and ShiOn
```

Each leaf skill is a directory, for example:

```text
skills/planning/prd-writing/
├── SKILL.md
└── references/
    ├── prd-writing.md
    └── prd-template.md
```

---

## How knowledge gets installed

| Platform | Installed structure |
|---|---|
| Claude Code | `.claude/skills/<group>-<name>/SKILL.md` + `references/<name>.md` |
| OpenAI Codex | `.codex/skills/<group>-<name>/SKILL.md` + `references/<name>.md` |
| Cursor AI | `.cursor/rules/knowledge/<group>/<name>.mdc` |
| GitHub Copilot | `.github/instructions/knowledge/<group>/<name>.instructions.md` |
| Windsurf | Inline section in `.windsurfrules` |

---

## Adding a knowledge skill

1. Create `src/skills/<group>/<skill-name>/SKILL.md`.
2. Add `name` and trigger-rich `description` frontmatter.
3. Put dense domain material in `references/<skill-name>.md`.
4. If the skill owns a template, add it as `references/<name>-template.md` and list it in `## Reference`.
5. Reference the skill in agent `<!-- knowledge: ... -->` metadata using `<group>/<skill-name>.md`.
6. Add a line to the agent `## Knowledge` section with the reference path.
7. Check the bundle against `src/skills-best-practices.md`.
8. Reinstall: `npx triples-agentic`.
