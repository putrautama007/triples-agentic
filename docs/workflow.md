# TripleS Agent Orchestration Workflow

## Agent Roster

| S# | Agent | Persona | Role | Claude invocation |
|----|-------|---------|------|---------------|
| S1 | **SeoYeon** | Engineering Manager | Main Orchestrator | `/seoyeon` (Skill) |
| S3 | **JiWoo** | Senior Product Manager | PRD Agent | `jiwoo-prd` (Agent tool) |
| S2 | **HyeRin** | Senior UI/UX Designer | UI/UX Design | `hyerin-design` (Agent tool) |
| S5 | **YooYeon** | Staff Engineer / Tech Lead | RFC Agent | `yooyeon-rfc` (Agent tool) |
| S7 | **NaKyoung** | Technical Program Manager | Task Breakdown | `nakyoung-tasks` (Agent tool) |
| S8 | **YuBin** | Principal Frontend Engineer | Frontend Web Dev | `yubin-frontend` (Agent tool) |
| S9 | **Kaede** | Principal Backend Engineer | Backend Dev | `kaede-backend` (Agent tool) |
| S12 | **YeonJi** | Senior Android Engineer | Android Native | `yeonji-android` (Agent tool) |
| S14 | **SoHyun** | Senior iOS Engineer | iOS Native | `sohyun-ios` (Agent tool) |
| S11 | **Kotone** | Senior Flutter Engineer | Flutter Dev | `kotone-flutter` (Agent tool) |
| S17 | **Lynn** | QA Lead / Test Lead | Test Case Agent | `lynn-testcase` (Agent tool) |
| S24 | **DaHyun** | Senior DevOps / CI Engineer | Code Quality Check | `dahyun-checker` (Agent tool) |
| S20 | **ShiOn** | Senior QA Automation Engineer | QA Execution | `shion-qa` (Agent tool) |

SeoYeon is the only slash command — the rest are subagents invoked via the Agent tool (Claude Code) or by name (Codex). See [README.md](../README.md#agent-roster) for the full per-platform breakdown.

---

## Full Orchestration Workflow

```mermaid
flowchart TD
    User([👤 User Input]) --> SeoYeon

    SeoYeon["🎯 SeoYeon\nEngineering Manager\n/seoyeon"]

    SeoYeon -->|"Delegate: Create PRD"| JiWoo

    subgraph PRD_LOOP["📋 PRD Phase — JiWoo (Senior PM)"]
        JiWoo["JiWoo\n(jiwoo-prd)"]
        JiWoo --> PRDCreate["1. Create PRD\n(from prd_template.md)"]
        PRDCreate --> PRDReview["2. Review PRD\n(quality checklist)"]
        PRDReview --> PRDEval{3. Evaluate:\nAll quality gates\npassed?}
        PRDEval -->|"❌ GAPS FOUND"| HumanPRD["🧑 Human Review\nJiWoo presents gap list\nUser adds missing context"]
        HumanPRD -->|"4. Update PRD"| PRDReview
    end

    PRDEval -->|"✅ READY"| HumanPRDGate["🧑 Human Approval\nApprove PRD?"]
    HumanPRDGate -->|"Approved"| HyeRin
    HumanPRDGate -->|"Approved (PRD-driven, parallel)"| TestPhase

    subgraph DESIGN_LOOP["🎨 Design Phase — HyeRin (Senior UI/UX Designer)"]
        HyeRin["HyeRin\n(hyerin-design)"]
        HyeRin --> DesignCreate["1. Create Design Spec\n(from design_spec_template.md)"]
        DesignCreate --> DesignReview["2. Review Design Spec\n(quality checklist)"]
        DesignReview --> DesignEval{3. Evaluate:\nAll UI/UX quality\ngates passed?}
        DesignEval -->|"❌ GAPS FOUND"| HumanDesign["🧑 Human Review\nHyeRin presents\ndesign gaps\nUser clarifies"]
        HumanDesign -->|"4. Update Design"| DesignReview
    end

    DesignEval -->|"✅ READY"| HumanDesignGate["🧑 Human Approval\nApprove Design?"]
    HumanDesignGate -->|"Approved"| YooYeon

    subgraph RFC_LOOP["⚙️ RFC Phase — YooYeon (Staff Engineer)"]
        YooYeon["YooYeon\n(yooyeon-rfc)"]
        YooYeon --> RFCCreate["1. Create RFC\n(from rfc_template.md)"]
        RFCCreate --> RFCReview["2. Review RFC\n(quality checklist)"]
        RFCReview --> RFCEval{3. Evaluate:\nAll quality gates\npassed?}
        RFCEval -->|"❌ GAPS FOUND"| HumanRFC["🧑 Human Review\nYooYeon presents\ntechnical gaps\nUser decides"]
        HumanRFC -->|"4. Update RFC"| RFCReview
    end

    RFCEval -->|"✅ READY"| HumanRFCGate["🧑 Human Approval\nApprove RFC?"]
    HumanRFCGate -->|"Approved"| NaKyoung

    subgraph TASK_LOOP["📊 Task Breakdown Phase — NaKyoung (TPM)"]
        NaKyoung["NaKyoung\n(nakyoung-tasks)"]
        NaKyoung --> TaskCreate["1. Create Tasks\n(story points + estimates)"]
        TaskCreate --> TaskReview["2. Review Tasks\n(readiness checklist)"]
        TaskReview --> TaskEval{3. Evaluate:\nAll tasks clear\n& estimable?}
        TaskEval -->|"❌ GAPS FOUND"| HumanTask["🧑 Human Review\nNaKyoung presents\nambiguous tasks\nUser clarifies"]
        HumanTask -->|"4. Update Tasks"| TaskReview
    end

    TaskEval -->|"✅ READY"| HumanTasksGate["🧑 Human Approval\nApprove Tasks?"]
    HumanTasksGate -->|"Approved"| DevPhase

    subgraph note ["📋 Design Spec → Developer Agents"]
        DesignNote["workspace/DESIGN_SPEC.md\nprovided to all developer agents\nas UI/UX source of truth"]
    end

    subgraph DevPhase["⚡ Development Phase — Parallel"]
        YuBin["🌐 YuBin\nPrincipal Frontend\n(yubin-frontend)\n\nReact/Vue/Angular\nTailwind, TypeScript"]
        Kaede["🖥️ Kaede\nPrincipal Backend\n(kaede-backend)\n\nNode/Python/Go\nPostgreSQL, REST"]
        YeonJi["🤖 YeonJi\nSenior Android\n(yeonji-android)\n\nKotlin + Jetpack Compose\nMaterial Design 3"]
        SoHyun["🍎 SoHyun\nSenior iOS\n(sohyun-ios)\n\nSwift + SwiftUI\nApple HIG"]
        Kotone["🦋 Kotone\nSenior Flutter\n(kotone-flutter)\n\nDart + Flutter\nAndroid + iOS + Web"]
    end

    subgraph TestPhase["📝 Test Case Phase — Lynn (QA Lead)"]
        Lynn["Lynn\n(lynn-testcase)"]
        Lynn --> TCCreate["1. Create Test Cases\n(from test_case_template.md)"]
        TCCreate --> TCReview["2. Review Test Cases\n(quality checklist)"]
        TCReview --> TCEval{3. Evaluate:\nAll PRD criteria\ncovered?}
        TCEval -->|"❌ GAPS FOUND"| HumanTC["🧑 Human Review\nLynn presents\nmissing scenarios\nUser adds context"]
        HumanTC -->|"4. Update Test Cases"| TCReview
    end

    TCEval -->|"✅ READY"| HumanTCGate["🧑 Human Approval\nApprove Test Cases?"]
    HumanTCGate -->|"Approved"| DaHyun
    YuBin --> DaHyun
    Kaede --> DaHyun
    YeonJi --> DaHyun
    SoHyun --> DaHyun
    Kotone --> DaHyun

    subgraph CHECK["🛠️ Code Quality Check — DaHyun (Senior DevOps / CI Engineer)"]
        DaHyun["DaHyun\n(dahyun-checker)"]
        DaHyun --> RunChecks["Run tests + types + lint\nper detected platform"]
        RunChecks --> CheckEval{All three\ncategories pass?}
        CheckEval -->|"❌ CHECK FAILED"| RouteFix["Route failures by platform\nto owning dev agent\n(loop ≤ 5)"]
        RouteFix -->|"Fix complete"| DaHyun
        CheckEval -->|"❌ Loop > 5"| HumanCheckEscalation["🧑 Human Escalation\nManual intervention required"]
    end

    CheckEval -->|"✅ CHECK PASSED"| ShiOn

    subgraph QA["🔍 QA Phase — ShiOn (Senior QA Automation)"]
        ShiOn["ShiOn\n(shion-qa)"]
        ShiOn --> Smoke["Smoke Tests\n(P0 only)"]
        Smoke --> SmokeGate{P0 pass?}
        SmokeGate -->|"❌ Fail"| BlockRelease["🛑 Block Release\nReport P0 failures\nto SeoYeon"]
        SmokeGate -->|"✅ Pass"| FullRun["Full Test Suite\nP1 → P2 → P3\n+ Exploratory"]
        FullRun --> GoNoGo{Go/No-Go\nAssessment}
        GoNoGo -->|"✅ GO"| Done
        GoNoGo -->|"❌ NO-GO"| BlockRelease2["🛑 No-Go Report\nOpen defects listed\nFix & re-test"]
    end

    Done(["✅ Delivery Complete\nQA_REPORT.md\nDELIVERY_SUMMARY.md"])
```

### Defect Rework Loop (post-QA convergence)

```mermaid
flowchart TD
    ShiOnResult{ShiOn\nGo/No-Go?}
    ShiOnResult -->|"✅ GO"| Delivery["✅ Delivery Complete"]
    ShiOnResult -->|"❌ NO-GO"| SeoYeonTriage["SeoYeon reads\nQA_REPORT.md + BUGS/"]

    SeoYeonTriage --> RouteDefects["Group defects\nby platform agent"]
    RouteDefects --> DevFix["Developer agents\nfix assigned defects"]
    DevFix --> ShiOnRetest["ShiOn retests\nfixed defects + regression"]
    ShiOnRetest --> ShiOnResult2{Re-test\nGo/No-Go?}
    ShiOnResult2 -->|"✅ GO"| Delivery
    ShiOnResult2 -->|"❌ NO-GO\n(same defect ×2)"| HumanEscalation["🧑 Human Escalation\nSeoYeon presents options"]
    ShiOnResult2 -->|"❌ NO-GO\n(new defects)"| SeoYeonTriage
    HumanEscalation -->|"Accept risk"| Delivery
    HumanEscalation -->|"Fix required"| DevFix
```

---

## Human-in-the-Loop Gates

Human review is required at five stages. Each gate follows the same pattern:

1. Agent **creates** artifact using its template
2. Agent **reviews** against its quality gate checklist
3. Agent **evaluates**: all gates pass → `READY`; any fail → `GAPS: [numbered list]`
4. Agent returns specific questions; on Codex this is a structured `TRIPLES_USER_INPUT_REQUIRED` payload
5. The interaction owner **presents** it to the human: the specialist on Claude Code, SeoYeon/the parent on Codex
6. Human **provides** clarifications
7. On Codex, the parent re-invokes the owning agent with `TRIPLES_USER_INPUT_RESPONSE`; Claude Code resumes its direct interaction flow
8. Agent **updates** artifact and loops back to step 2
9. Loop exits when `READY`; on Codex the parent owns the explicit approval request, while Claude Code preserves its direct human gate

| Gate | Agent | Artifact |
|------|-------|---------|
| PRD Review | JiWoo (Senior PM) | `workspace/prd/PRD-{slug}.md` |
| Design Review | HyeRin (Senior UI/UX Designer) | `workspace/DESIGN_SPEC.md` |
| RFC Review | YooYeon (Staff Engineer) | `workspace/rfc/RFC-{slug}.md` |
| Task Breakdown Review | NaKyoung (TPM) | `workspace/task-breakdown/TASKS-{slug}.md` |
| Test Case Review | Lynn (QA Lead) | `workspace/test-cases/TC-{slug}-*.md` |

---

## Workspace Artifacts

```
workspace/
├── RUN_STATE.md               ← SeoYeon (resumable run ledger, kept current at every stage transition)
├── prd/PRD-{slug}.md          ← JiWoo
├── DESIGN_SPEC.md             ← HyeRin
├── rfc/RFC-{slug}.md          ← YooYeon
├── task-breakdown/TASKS-{slug}.md ← NaKyoung
├── test-cases/TC-{slug}-*.md  ← Lynn
├── CHECK_REPORT.md            ← DaHyun (tests/types/lint, overwritten on recheck)
├── BUGS/
│   └── BUG-[ID].md           ← ShiOn (one per defect)
├── QA_REPORT.md               ← ShiOn
└── DELIVERY_SUMMARY.md        ← SeoYeon
```

---

## Cross-Platform Handoff Contract

TripleS can run in Claude Code or OpenAI Codex. SeoYeon should hand off work using both platform forms so a user can continue in either assistant:

```text
Next agent: JiWoo PRD
Claude: invoke the `jiwoo-prd` subagent (Agent tool)
Codex: ask Codex to spawn the `jiwoo-prd` agent
Input artifacts: workspace/prd/PRD-{slug}.md
Task: Review and revise until READY.
Open decisions: none
```

Use artifact paths as the source of truth. Do not rely on hidden conversation memory between tools.

### Codex human-input relay

Natural `$seoyeon <request>` is the default Codex entry for document work.
SeoYeon reads `workspace/RUN_STATE.md`, re-presents its oldest pending planning
item, resumes its in-progress document owner, or infers PRD, Design, RFC, Task
Breakdown, or Test Cases from the request. Explicit `run` and `resume` commands
remain compatibility aliases.

The five document subagents inherit the parent task's tool surface and do not own
the user conversation. When JiWoo, HyeRin, YooYeon, NaKyoung, or Lynn needs
clarification or escalation, the agent returns at most three questions between
`TRIPLES_USER_INPUT_REQUIRED` and `TRIPLES_END_USER_INPUT_REQUIRED`, then stops.
SeoYeon or the invoking parent:

1. Reads the ledger, then requires Codex Plan mode before a document mutation,
   document delegation, or direct call to one of those five agents. If
   `request_user_input` is unavailable, it preserves state and asks the user to
   select Plan mode and resend the same natural `$seoyeon` request.
2. Validates that each question has two or three mutually exclusive options and
   exactly one recommendation. The UI's built-in free-form choice handles custom
   answers.
3. Gives the same child one corrective retry for a malformed payload. A second
   malformed response is recorded as `protocol_error` and remains blocked.
4. Records the valid request ID, owner, stage, artifact paths, status, resume
   action, and validation-attempt count in `workspace/RUN_STATE.md`.
5. Uses `request_user_input` without a timeout or automatic resolution. If the
   tool fails after persistence, it retains the pending request and requires the
   natural request to be resent in Plan mode instead of asking in chat.
6. Refuses to advance on missing, partial, duplicate, unrelated, or malformed
   answers.
7. Re-invokes the owner with the correlated response after all answers exist.

The parent creates approval requests after `READY` with exactly **Approve** and
**Request changes**. A specialist never approves its own artifact or advances
the next stage. Setup, implementation, checker, and QA specialists keep their
standard Codex relay and do not require the document Plan-mode preflight.

---

## Convergence Rules

- Planning stages loop through **Create → Review → Evaluate → Human Review → Revise** until `READY`.
- A run can start mid-pipeline with `/seoyeon run --from design|rfc|tasks|dev` when the upstream artifacts already exist (pre-placed in `workspace/` or attached in the prompt); skipped stages are seeded `[x] — provided` and **all downstream human-approval gates still fire**.
- If a stage agent finds upstream context unclear, it raises numbered open questions for the human instead of guessing; an answer that invalidates an upstream document routes back to that document's owning agent for revision (and re-approval).
- Development starts only after PRD, Design, RFC, and Task Breakdown are approved.
- Each task carries a Parallel Group (wave); developer agents build same-wave, independent tasks concurrently and dependency-chain tasks in wave order.
- Test cases are a PRD-driven parallel track: Lynn starts at PRD approval and runs alongside Design → RFC → Tasks → Development; the RFC adds technical-risk edge cases via an enrichment pass once approved. The Test Cases gate is required before QA, not after Tasks.
- DaHyun's Code Quality Check runs once all developer agents finish and test cases are approved; `CHECK FAILED` routes back to the owning developer agent and re-runs, escalating to human after 5 loops.
- QA `NO-GO` routes defects back to owning developer agents, then returns to ShiOn for re-test.
- Human escalation happens after the same planning gate fails 3 times or the same QA defect survives 2 fix attempts.
- Approved artifact changes that affect scope, architecture, design behavior, or release risk require human sign-off.

---

## Quick Start

### Full pipeline — Claude Code
```
/seoyeon run                  → Full pipeline from PRD
/seoyeon run --from rfc        → Start at RFC (attach/place PRD + Design first)
/seoyeon run --from dev        → Start at Development (attach/place Tasks + Design first)
/seoyeon status               → Check current run state
/seoyeon resume               → Continue after a token-limit reset or closed session
```
SeoYeon walks you through the entire workflow, delegating to each agent in sequence. The run ledger at `workspace/RUN_STATE.md` makes long runs resumable. `--from <stage>` accepts `design|rfc|tasks|dev`; downstream human-approval gates are unchanged.

### Full pipeline — OpenAI Codex
```text
Use $seoyeon to orchestrate this feature from PRD through QA with human review gates and a QA rework loop.
```

### Individual agents (Claude Code Agent tool)
SeoYeon delegates to these automatically during `/seoyeon run`, or invoke one directly:
```
jiwoo-prd          [opus]    Start or resume PRD creation
hyerin-design      [opus]    Start or resume UI/UX design spec
yooyeon-rfc        [opus]    Start or resume RFC from PRD
nakyoung-tasks     [opus]    Start or resume task breakdown
yubin-frontend     [sonnet]  Implement frontend web tasks
kaede-backend      [sonnet]  Implement backend tasks
yeonji-android     [sonnet]  Implement Android tasks
sohyun-ios         [sonnet]  Implement iOS tasks
kotone-flutter     [sonnet]  Implement Flutter tasks
lynn-testcase      [opus]    Start or resume test case creation
dahyun-checker     [sonnet]  Run tests, type checks, and lint; report failures by platform
shion-qa           [sonnet]  Execute QA against test cases + dev output
chaewon-init-setup [sonnet]  Explain or audit the local TripleS setup
```
