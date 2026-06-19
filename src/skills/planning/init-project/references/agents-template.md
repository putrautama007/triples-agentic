# Agentic Coding Project Guidance

<!-- triples-agentic:start -->
## TripleS Agentic

This project has local TripleS Agentic support for Codex and other coding agents.

### Installed local files

- `.codex/agents/` — 12 TripleS specialist subagents (PRD, design, RFC, tasks, implementation, test case, QA) as Codex custom agent TOML files, each with its own pinned model.
- `.codex/skills/seoyeon/` — SeoYeon, the orchestrator skill — entry point for the full pipeline.
- `.codex/skills/` — bundled knowledge references (coding principles, planning, design, web, mobile, quality).
- `.codex/config.toml` — safety hooks that block dangerous commands before they run.
- `AGENTS.md` — this project guidance file for agentic coding tools.

### Start here in Codex

- Use `$seoyeon` for the full PRD → Design → RFC → Tasks → Development → Test Cases → QA pipeline — SeoYeon delegates to each specialist agent automatically.
- Use `/skills` to browse the orchestrator skill and bundled knowledge references.
- Or ask Codex to spawn a specialist agent directly when you need a single stage (Codex agents are explicit-invocation only — name the agent in your request):
  - `jiwoo-prd` — Product Requirements Document (gpt-5.5)
  - `hyerin-design` — UI/UX design spec (gpt-5.5)
  - `yooyeon-rfc` — technical RFC (gpt-5.5)
  - `nakyoung-tasks` — task breakdown (gpt-5.5)
  - `lynn-testcase` — test case design (gpt-5.5)
  - `yubin-frontend`, `kaede-backend`, `yeonji-android`, `sohyun-ios`, `kotone-flutter` — implementation (gpt-5.3-codex)
  - `shion-qa` — QA execution and go/no-go (gpt-5.3-codex)
  - `chaewon-init-setup` — explain or audit the local TripleS setup (gpt-5.3-codex)

### Working rules

- Treat artifacts in `workspace/` as the source of truth during TripleS workflows.
- Keep `.codex/agents/` and `.codex/skills/` as the canonical Codex instruction source; this file is supplemental guidance.
- Do not skip human approval gates for PRD, design, RFC, task breakdown, or test cases.
- Run `npx triples-agentic update` to refresh installed agents, skills, and managed guidance.

<!-- triples-agentic:end -->
