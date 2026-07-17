# TripleS Skill Writing Best Practices

This guide is the source of truth for writing new TripleS skills and keeping existing skills consistent. It adapts the guidance from [`mgechev/skills-best-practices`](https://github.com/mgechev/skills-best-practices) to this repo's agent, knowledge, template, and installer conventions.

## Skill Structure

A production-quality skill should install as a directory:

```text
skill-name/
├── SKILL.md              # required: metadata + core instructions, under 500 lines
├── references/           # optional: just-in-time reference docs, one level deep when possible
├── scripts/              # optional: tiny deterministic CLIs only
└── assets/               # optional: templates, schemas, static output assets
```

Use this repo's source layout as the authoring source of truth:

```text
src/agents/<agent-slug>.md        # behavior skills
src/skills/<group>/<file>.md   # domain reference skills
templates/                        # optional, co-located in skill references/ when owned by a specific skill
src/bin/setup*.js                 # platform-specific skill generation
```

## Frontmatter And Trigger Quality

Skill routing depends on metadata before the model reads the body. Optimize `name` and `description` first.

### Name Rules

- Use lowercase letters, numbers, and hyphens only.
- Keep names stable and 1–64 characters.
- For Codex skill bundles, the `name` must match the parent directory.
- For knowledge skills, prefix by domain to avoid collisions: `planning-prd-writing`, `quality-test-case-writing`, `web-backend-api-design`.

### Description Rules

- Keep descriptions under 1,024 characters.
- Write in third person.
- Include positive triggers: "Use when...".
- Include negative triggers when confusion is likely: "Do not use for...".
- Be specific about artifact, platform, or workflow ownership.

Good:

```yaml
name: jiwoo-prd
description: Creates, reviews, and refines implementation-ready Product Requirements Documents for TripleS workflows. Use when the user needs PRD scope, personas, user stories, acceptance criteria, success metrics, or product clarification. Do not use for technical architecture or implementation tasks.
```

Bad:

```yaml
name: prd
description: Helps with product docs.
```

## Progressive Disclosure

Keep `SKILL.md` as the lean control plane. Put dense details elsewhere.

- Use `SKILL.md` for identity, trigger guidance, procedural steps, required gates, and output contracts.
- Put domain rules in `references/` or `src/skills/`.
- Put long templates in the owning skill bundle's `references/` directory.
- Tell the agent exactly when to read each reference.
- Prefer relative paths with forward slashes.
- Do not create `README.md`, `CHANGELOG.md`, or install docs inside skill bundles.

Recommended pattern:

```markdown
## Procedure

1. Read `references/prd-writing.md` only if drafting or evaluating a PRD.
2. Copy the structure from `assets/prd.md` when creating a new PRD.
3. Run the quality gate in `references/prd-quality-gates.md` before asking for human approval.
```

## Agent Skill Authoring

Agent skills define behavior, not domain knowledge.

### Required Source Sections

Every `src/agents/*.md` file should include:

```markdown
# AgentName — Role Title
<!-- triples-agent: slug -->
<!-- role: role-id -->
<!-- persona: Short persona description -->
<!-- knowledge: group/file.md, group/file.md -->
<!-- templates: template.md -->
<!-- human-in-loop: true|false -->

## Identity
## Persona
## Knowledge
## Skills
## Human-in-the-Loop Gate        # when relevant
## Tools
## Output
```

### Writing Rules

- Use specific step-by-step procedures, not prose essays.
- Keep workflow steps chronological.
- State artifact paths exactly, e.g. `workspace/prd/PRD-{slug}.md`.
- State handoff signals exactly, e.g. `PRD APPROVED`.
- Keep domain rules out of the agent body; reference `skills/...` instead.
- State tool constraints explicitly.
- If a gate depends on human review, say `STOP and wait`.
- Set `human-in-loop: true` only for planning specialists that participate in the
  Codex planning-gate relay; the installer uses it to inject the child v2
  contract. Do not set it for implementation, checker, setup, or QA blockers.
- If quality scoring applies, state formula, minimum threshold, below-threshold behavior, and re-evaluation loop.

## Knowledge Skill Authoring

Knowledge skills are reusable domain references. They should be useful independently and as agent references.

### Required Frontmatter

```yaml
---
name: api-design
description: API design conventions for REST and GraphQL — URL structure, versioning, pagination, filtering, auth boundaries, and documentation. Use when designing or reviewing API contracts. Do not use for frontend component work.
---
```

### Writing Rules

- Write as reference material, not a tutorial.
- Include concise checklists, decision rules, and anti-patterns.
- Avoid agent persona, tool usage, or handoff instructions.
- Keep terminology consistent with agents that load the file.
- If the knowledge includes an evaluation rubric, define output format and pass/fail criteria.
- If the knowledge becomes long or template-heavy, move examples into the owning skill bundle's `references/` directory.

## Scripts And Assets

Use scripts only when deterministic behavior matters.

Good scripts:

- Validate generated skill bundle structure.
- Check frontmatter naming consistency.
- Count `SKILL.md` lines.
- Generate a contact sheet or schema from fixed inputs.

Avoid scripts that:

- Hide broad business logic.
- Duplicate project application code.
- Require the agent to debug a complex library.
- Make network calls unless explicitly required and documented.

Use assets for reusable output structures:

- PRD/RFC/task/test-case templates.
- JSON schemas.
- Static examples.

## Validation Checklist

Run this checklist before adding or changing a skill:

- [ ] `SKILL.md` is under 500 lines after install.
- [ ] Skill `name` matches installed directory name.
- [ ] Description has positive triggers and relevant negative triggers.
- [ ] Dense content lives in references/assets, not main `SKILL.md`.
- [ ] References are loaded just-in-time with explicit paths.
- [ ] Procedures are numbered and deterministic.
- [ ] Output artifact paths and handoff signals are exact.
- [ ] Human review gates say when to stop and wait.
- [ ] Quality gates define score/output when applicable.
- [ ] Agent-referenced knowledge/template paths resolve.
- [ ] No skill bundle contains README, changelog, or install docs.

## LLM Validation Prompts

Use these prompts to test a new skill before release.

### Discovery Validation

Paste only the frontmatter into a fresh model and ask:

```text
Based strictly on this YAML metadata:
1. Generate 3 realistic user prompts that should trigger this skill.
2. Generate 3 similar prompts that should NOT trigger this skill.
3. Critique whether the description is too broad or too narrow and suggest a rewrite.
```

### Logic Validation

Paste the generated `SKILL.md` and directory tree and ask:

```text
Act as an autonomous agent that triggered this skill. Simulate execution step-by-step for [representative task]. For each step, state which file you read or write. Flag any line that forces you to guess.
```

### Edge Case Validation

Ask:

```text
Act as a ruthless QA tester. Ask 3–5 specific questions about edge cases, missing fallbacks, ambiguous instructions, or failure states in this SKILL.md. Do not fix them yet.
```

## Adding A New TripleS Skill

1. Decide whether this is an agent skill, knowledge skill, template, or hook.
2. Copy the closest existing source file from `src/agents/` or `src/skills/`.
3. Update metadata and trigger description first.
4. Move dense rules into the owning skill bundle under `references/`.
5. Reference those files in agent metadata and `## Knowledge`.
6. Keep instructions procedural and deterministic.
7. Reinstall into a temporary target and validate generated structure.
8. Run discovery, logic, and edge-case validation prompts.
9. Update `README.md`, `src/agents/README.md`, or `src/skills/README.md` only when public workflow changes.
