# Claude Code Project Guidance

<!-- triples-agentic:start -->
## TripleS Agentic

This project has local TripleS Agentic support for Claude Code.

### Installed local files

- `.claude/agents/` — 12 TripleS specialist subagents (PRD, design, RFC, tasks, implementation, test case, QA), each invoked via the Agent tool with its own pinned model.
- `.claude/skills/seoyeon/` — SeoYeon, the orchestrator skill — entry point for the full pipeline.
- `.claude/skills/` — bundled knowledge references (coding principles, planning, design, web, mobile, quality).
- `.claude/settings.json` — safety hooks that block dangerous commands before they run.
- `CLAUDE.md` — this project guidance file.

### Start here

- Use `/seoyeon run` for the full PRD → Design → RFC → Tasks → Development → Test Cases → QA pipeline — SeoYeon delegates to each specialist subagent automatically.
- Use `/seoyeon status` to check pipeline state, or `/seoyeon` for other orchestrator commands.
- Or invoke a specialist subagent directly via the Agent tool when you need a single stage:
  - `jiwoo-prd` — Product Requirements Document (opus)
  - `hyerin-design` — UI/UX design spec (opus)
  - `yooyeon-rfc` — technical RFC (opus)
  - `nakyoung-tasks` — task breakdown (opus)
  - `lynn-testcase` — test case design (opus)
  - `yubin-frontend`, `kaede-backend`, `yeonji-android`, `sohyun-ios`, `kotone-flutter` — implementation (sonnet)
  - `shion-qa` — QA execution and go/no-go (sonnet)
  - `chaewon-init-setup` — explain or audit the local TripleS setup (sonnet)

### Working rules

- Treat artifacts in `workspace/` as the source of truth during TripleS workflows.
- Do not skip human approval gates for PRD, design, RFC, task breakdown, or test cases.
- Use `/seoyeon status` when the workflow state is unclear.
- Run `npx triples-agentic update` to refresh installed skills and managed guidance.

<!-- triples-agentic:end -->
