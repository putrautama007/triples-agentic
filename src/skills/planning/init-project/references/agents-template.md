# Agentic Coding Project Guidance

<!-- triples-agentic:start -->
## TripleS Agentic

This project has local TripleS Agentic support for Codex and other coding agents.

### Installed local files

- `.codex/agents/` — 13 TripleS specialist subagents (PRD, design, RFC, tasks, implementation, checker, test case, QA) as Codex custom agent TOML files, each with its own pinned model.
- `.codex/skills/seoyeon/` — SeoYeon, the orchestrator skill — entry point for the full pipeline.
- `.codex/skills/` — bundled knowledge references (coding principles, planning, design, web, mobile, quality).
- `.codex/config.toml` — safety hooks that block dangerous commands before they run.
- `AGENTS.md` — this project guidance file for agentic coding tools.

### Start here in Codex

- Use a natural `$seoyeon` request for document work, such as `$seoyeon draft the PRD for account recovery`. SeoYeon reads `workspace/RUN_STATE.md`, then automatically starts or resumes PRD, Design, RFC, Task Breakdown, or Test Case drafting without a `run` or `resume` subcommand.
- A natural `$seoyeon continue` resumes the ledger's active run after a token-limit reset or closed session.
- Use `$seoyeon` for the full PRD → Design → RFC → Tasks → Development → Check → Test Cases → QA pipeline — SeoYeon delegates to each specialist agent automatically.
- Use `/skills` to browse the orchestrator skill and bundled knowledge references.
- Or ask Codex to spawn a specialist agent directly when you need a single stage (Codex agents are explicit-invocation only — name the agent in your request):
  - `jiwoo-prd` — Product Requirements Document (gpt-5.5)
  - `hyerin-design` — UI/UX design spec (gpt-5.5)
  - `yooyeon-rfc` — technical RFC (gpt-5.5)
  - `nakyoung-tasks` — task breakdown (gpt-5.5)
  - `lynn-testcase` — test case design (gpt-5.5)
  - `yubin-frontend`, `kaede-backend`, `yeonji-android`, `sohyun-ios`, `kotone-flutter` — implementation (gpt-5.3-codex)
  - `dahyun-checker` — code quality checks: tests, types, lint (gpt-5.3-codex)
  - `shion-qa` — QA execution and go/no-go (gpt-5.3-codex)
  - `chaewon-init-setup` — explain or audit the local TripleS setup (gpt-5.3-codex)

### Working rules

- Treat artifacts in `workspace/` as the source of truth during TripleS workflows; `workspace/RUN_STATE.md` is the resumable run ledger.
- Keep `.codex/agents/` and `.codex/skills/` as the canonical Codex instruction source; this file is supplemental guidance.
- Codex Plan mode is mandatory before SeoYeon mutates a document run or invokes JiWoo, HyeRin, YooYeon, NaKyoung, or Lynn, including direct invocation of those five document agents. Read the ledger first, then confirm `request_user_input` is callable. If it is unavailable, do not mutate or spawn; stop with: "Select Codex Plan mode and resend the same `$seoyeon` request. SeoYeon will automatically start or resume the document workflow."
- Setup, implementation, checker, and QA specialists do not require the document Plan-mode preflight and keep their normal Codex interaction behavior.
- Do not skip human approval gates for PRD, design, RFC, task breakdown, or test cases.
- Every `TRIPLES_USER_INPUT_REQUIRED` question must provide two or three mutually exclusive options with exactly one recommendation; custom answers use the interactive UI's built-in free-form choice. On the first malformed payload, give the same child one corrective retry. On a second malformed payload, record `protocol_error` and keep the workflow blocked.
- Persist valid pending requests in `workspace/RUN_STATE.md`, then use `request_user_input` without a timeout or automatic resolution. If the tool becomes unavailable or fails, retain the pending request, do not ask it in chat, and require the same natural `$seoyeon` request to be resent in Plan mode. After every question is answered, re-invoke the owning specialist with `TRIPLES_USER_INPUT_RESPONSE`; never rely on the old child thread's memory.
- When a specialist returns `READY`, the parent owns the approval and presents exactly **Approve** and **Request changes** through `request_user_input`. A pending approval never advances the workflow.
- Run `npx triples-agentic update` to refresh installed agents, skills, and managed guidance.

<!-- triples-agentic:end -->
