import assert from 'node:assert/strict';
import { after, before, describe, test } from 'node:test';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const testDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = dirname(testDir);
const setupScript = join(projectRoot, 'src', 'bin', 'setup.js');
const documentAgents = [
  'jiwoo-prd',
  'hyerin-design',
  'yooyeon-rfc',
  'nakyoung-tasks',
  'lynn-testcase',
];
const standardAgents = [
  'chaewon-init-setup',
  'yubin-frontend',
  'kaede-backend',
  'yeonji-android',
  'sohyun-ios',
  'kotone-flutter',
  'dahyun-checker',
  'shion-qa',
];

function install(platform, target) {
  const result = spawnSync(process.execPath, [setupScript, platform, '--target', target], {
    cwd: projectRoot,
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
}

describe('Codex custom-agent installation', () => {
  let target;
  let agentsDir;

  before(() => {
    target = mkdtempSync(join(tmpdir(), 'triples-codex-test-'));
    install('codex', target);
    agentsDir = join(target, '.codex', 'agents');
  });

  after(() => rmSync(target, { recursive: true, force: true }));

  test('generates all 13 specialist agents without unsupported tool arrays', () => {
    const files = readdirSync(agentsDir).filter(file => file.endsWith('.toml')).sort();

    assert.equal(files.length, 13);
    for (const file of files) {
      const content = readFileSync(join(agentsDir, file), 'utf8');
      assert.doesNotMatch(content, /^tools\s*=\s*\[/m, `${file} contains an unsupported tools array`);
    }
  });

  test('requires Plan mode for exactly the five document specialists', () => {
    for (const agent of documentAgents) {
      const content = readFileSync(join(agentsDir, `${agent}.toml`), 'utf8');

      assert.match(content, /^description = ".*Requires Codex Plan mode:/m);
      assert.match(content, /request_user_input.*callable in Codex Plan mode/i);
    }

    for (const agent of standardAgents) {
      const content = readFileSync(join(agentsDir, `${agent}.toml`), 'utf8');

      assert.doesNotMatch(content, /^description = ".*Requires Codex Plan mode:/m);
      assert.doesNotMatch(content, /may be invoked only.*Codex Plan mode/i);
    }
  });

  test('uses commandless explicit SeoYeon invocation metadata', () => {
    const skill = readFileSync(join(target, '.codex', 'skills', 'seoyeon', 'SKILL.md'), 'utf8');
    const ui = readFileSync(
      join(target, '.codex', 'skills', 'seoyeon', 'agents', 'openai.yaml'),
      'utf8',
    );

    assert.match(skill, /description: ".*Requires Codex Plan mode:/m);
    assert.match(skill, /Automatic Document Drafting \(Default\)/);
    assert.match(skill, /Codex Plan Mode Preflight \(Mandatory\)/);
    assert.match(skill, /do not create or update\s+`workspace\/RUN_STATE\.md`/i);
    assert.match(
      skill,
      /Select Codex Plan mode and resend the same `\$seoyeon` request.*automatically start or resume/is,
    );
    assert.match(ui, /default_prompt: ".*natural document request.*automatically start or resume/m);
    assert.match(ui, /allow_implicit_invocation: false/);
    assert.doesNotMatch(ui, /seoyeon (?:run|resume)/i);
    assert.doesNotMatch(skill, /then retry or run `\$seoyeon resume`/i);
  });

  test('installs all document agents with the strict interactive relay', () => {
    for (const agent of documentAgents) {
      const content = readFileSync(join(agentsDir, `${agent}.toml`), 'utf8');

      assert.match(content, /TRIPLES_USER_INPUT_REQUIRED/);
      assert.match(content, /TRIPLES_USER_INPUT_RESPONSE/);
      assert.match(content, /"version": 1/);
      assert.match(content, /\{"version":1,"request_id"/);
      assert.match(content, /at most three questions/i);
      assert.match(content, /"recommended": false/);
      assert.match(content, /Every question must contain two or three/i);
      assert.match(content, /never omit `options`/i);
      assert.match(content, /return `READY` to the parent/i);
    }
  });

  test('keeps the standard relay for non-document specialists', () => {
    for (const agent of standardAgents) {
      const content = readFileSync(join(agentsDir, `${agent}.toml`), 'utf8');

      assert.match(content, /TRIPLES_USER_INPUT_REQUIRED/);
      assert.match(content, /retry_current_task/);
      assert.match(content, /Omit `options` for genuinely free-form questions/i);
      assert.doesNotMatch(content, /request_user_input.*without a timeout or automatic resolution/i);
      assert.match(content, /stop without continuing the stage/i);
    }
  });

  test('relays every human decision through native interactive prompting', () => {
    const skill = readFileSync(join(target, '.codex', 'skills', 'seoyeon', 'SKILL.md'), 'utf8');

    assert.match(skill, /Codex Parent Human-Input Relay/);
    assert.match(skill, /request_user_input/);
    assert.match(skill, /without a timeout or\s+automatic resolution/i);
    assert.match(skill, /built-in free-form choice/i);
    assert.match(skill, /one to three questions/i);
    assert.doesNotMatch(skill, /plain-text fallback|ask the same questions in plain text/i);
  });

  test('routes natural document requests and resumes from the ledger', () => {
    const skill = readFileSync(join(target, '.codex', 'skills', 'seoyeon', 'SKILL.md'), 'utf8');

    assert.match(skill, /Read `workspace\/RUN_STATE\.md` before choosing a route/i);
    assert.match(skill, /pending planning decision or approval.*oldest pending item/is);
    assert.match(skill, /active document run.*resume the in-progress document owner/is);
    assert.match(skill, /different feature.*do not overwrite `workspace\/RUN_STATE\.md`/is);
    assert.match(skill, /Continue active run \(Recommended\)/);
    assert.match(skill, /Use separate workspace/);
    assert.match(skill, /New feature or PRD.*`jiwoo-prd`/);
    assert.match(skill, /Design or UX specification.*`hyerin-design`/);
    assert.match(skill, /RFC, architecture, or technical design.*`yooyeon-rfc`/);
    assert.match(skill, /Task breakdown, delivery plan, or estimates.*`nakyoung-tasks`/);
    assert.match(skill, /Test cases, QA scenarios, or test plan.*`lynn-testcase`/);
    assert.match(skill, /Start at earliest missing stage \(Recommended\)/);
    assert.match(skill, /Provide required artifacts/);
    assert.match(skill, /natural "continue" resumes the active run/i);
  });

  test('corrects malformed payloads once and blocks repeated protocol failures', () => {
    const skill = readFileSync(join(target, '.codex', 'skills', 'seoyeon', 'SKILL.md'), 'utf8');

    assert.match(skill, /first malformed payload.*one corrective follow-up/is);
    assert.match(skill, /next payload is also\s+malformed.*protocol_error/is);
    assert.match(skill, /keep the gate blocked/i);
  });

  test('keeps approvals and partial answers blocked', () => {
    const skill = readFileSync(join(target, '.codex', 'skills', 'seoyeon', 'SKILL.md'), 'utf8');

    assert.match(skill, /creates an `approval` request/i);
    assert.match(skill, /partial(?:ly)? answered/i);
    assert.match(skill, /duplicate/i);
    assert.match(skill, /must never\s+advance\s+the pipeline/i);
    assert.match(skill, /tool becomes unavailable or fails.*keep that request pending/is);
  });

  test('resumes after context loss by re-invoking the owning specialist', () => {
    const skill = readFileSync(join(target, '.codex', 'skills', 'seoyeon', 'SKILL.md'), 'utf8');

    assert.match(skill, /re-invoke the owning specialist/i);
    assert.match(skill, /context loss/i);
    assert.match(skill, /TRIPLES_USER_INPUT_RESPONSE/);
  });

  test('installs parent-relay guidance for direct specialist invocation', () => {
    const guidance = readFileSync(join(target, 'AGENTS.md'), 'utf8');

    assert.match(guidance, /TRIPLES_USER_INPUT_REQUIRED/);
    assert.match(guidance, /natural `\$seoyeon` request for document work/i);
    assert.match(guidance, /automatically starts or resumes/i);
    assert.match(guidance, /Codex Plan mode is mandatory.*JiWoo.*HyeRin.*YooYeon.*NaKyoung.*Lynn/i);
    assert.match(guidance, /Setup, implementation, checker, and QA specialists do not require/i);
    assert.match(guidance, /request_user_input/);
    assert.match(guidance, /do not mutate or spawn/i);
    assert.match(guidance, /resend the same `\$seoyeon` request/i);
    assert.match(guidance, /record `protocol_error` and keep the workflow blocked/i);
    assert.match(guidance, /exactly \*\*Approve\*\* and \*\*Request changes\*\*/i);
    assert.doesNotMatch(guidance, /ask the same questions in plain text/i);
  });
});

describe('Claude compatibility', () => {
  let target;

  before(() => {
    target = mkdtempSync(join(tmpdir(), 'triples-claude-test-'));
    install('claude', target);
  });

  after(() => rmSync(target, { recursive: true, force: true }));

  test('preserves the AskUserQuestion tool allowlist', () => {
    const jiwoo = readFileSync(join(target, '.claude', 'agents', 'jiwoo-prd.md'), 'utf8');

    assert.match(jiwoo, /^tools: .*AskUserQuestion/m);
  });
});
