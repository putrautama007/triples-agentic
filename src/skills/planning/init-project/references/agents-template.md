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

- Use `$seoyeon` for the full PRD → Design → RFC → Tasks → Development → Check → Test Cases → QA pipeline — SeoYeon delegates to each specialist agent automatically.
- Ask SeoYeon to `resume` to continue a run after a token-limit reset or closed session — she reads `workspace/RUN_STATE.md` and picks up from the last in-flight unit of work.
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
- Do not skip human approval gates for PRD, design, RFC, task breakdown, or test cases.
- Run `npx triples-agentic update` to refresh installed agents, skills, and managed guidance.

### Codex planning-gate relay (orchestrated and direct invocation)

This relay applies only to the five planning specialists: `jiwoo-prd`,
`hyerin-design`, `yooyeon-rfc`, `nakyoung-tasks`, and `lynn-testcase`. Developer,
checker, setup, and QA blockers keep their existing behavior.

- Retain the exact child target when spawning a planning specialist. If it returns
  `TRIPLES_USER_INPUT_REQUIRED`, the parent owns the user interaction and must not
  advance the workflow.
- Accept v1 and v2 requests during migration. Normalize v1 `artifact_paths` and
  `questions[].id` to v2 `artifacts` and `questions[].question_id`. Generated
  specialists emit v2 only; parent responses are always correlated v2:

  ```text
  TRIPLES_USER_INPUT_RESPONSE
  {"version":2,"request_id":"<same-id>","answers":[{"question_id":"q1","answer":"..."}]}
  ```

- Validate the stable request ID, owner, stage, artifacts, and one to three
  questions. A choice question has two or three options with exactly one
  recommendation; `free_text` is allowed only when meaningful choices do not
  exist.
- Persist every pending and resolved request in `workspace/RUN_STATE.md`, including
  arrival order, exact child target, request/question IDs, artifacts, answers,
  status, and protocol attempts. Queue concurrent requests FIFO and present only
  the oldest pending item.
- Use `request_user_input` without timeout or auto-resolution only when it is
  callable and all questions are native-compatible choices. Otherwise ask the
  same numbered questions and options in plain text. Partial, duplicate, or
  unrelated answers remain pending.
- On the first malformed payload, send one corrective follow-up to the same target.
  A second malformed response becomes a recorded `protocol_error`; keep the gate
  blocked and never guess.
- Once all answers are correlated by request and question IDs, mark the request
  resolved and follow up the **same idle child target** in the same parent turn.
  Respawn only if that target is unavailable or its context is lost, seeding the
  replacement from artifacts and the ledger.
- `READY` returns to the parent. The parent owns an **Approve / Request changes**
  gate: Approve advances in the same turn (or completes a direct invocation),
  while changes are collected and routed to the same producing child target for
  revision and another `READY` evaluation.

<!-- triples-agentic:end -->
