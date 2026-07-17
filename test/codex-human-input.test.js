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

  test('installs the previously malformed planning agents with the relay contract', () => {
    for (const agent of ['jiwoo-prd', 'hyerin-design', 'yooyeon-rfc']) {
      const content = readFileSync(join(agentsDir, `${agent}.toml`), 'utf8');

      assert.match(content, /TRIPLES_USER_INPUT_REQUIRED/);
      assert.match(content, /TRIPLES_USER_INPUT_RESPONSE/);
      assert.match(content, /at most three questions/i);
      assert.match(content, /"recommended": false/);
      assert.match(content, /return `READY` to the parent/i);
    }
  });

  test('applies the relay contract to implementation and QA clarification paths', () => {
    for (const agent of ['yubin-frontend', 'kaede-backend', 'shion-qa']) {
      const content = readFileSync(join(agentsDir, `${agent}.toml`), 'utf8');

      assert.match(content, /TRIPLES_USER_INPUT_REQUIRED/);
      assert.match(content, /retry_current_task/);
      assert.match(content, /stop without continuing the stage/i);
    }
  });

  test('relays clarification through native prompting or plain-text fallback', () => {
    const skill = readFileSync(join(target, '.codex', 'skills', 'seoyeon', 'SKILL.md'), 'utf8');

    assert.match(skill, /Codex Parent Human-Input Relay/);
    assert.match(skill, /request_user_input/);
    assert.match(skill, /plain-text fallback/i);
    assert.match(skill, /one to three questions/i);
  });

  test('keeps approvals and partial answers blocked', () => {
    const skill = readFileSync(join(target, '.codex', 'skills', 'seoyeon', 'SKILL.md'), 'utf8');

    assert.match(skill, /creates an `approval` request/i);
    assert.match(skill, /partial(?:ly)? answered/i);
    assert.match(skill, /duplicate/i);
    assert.match(skill, /must never\s+advance the pipeline/i);
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
    assert.match(guidance, /request_user_input/);
    assert.match(guidance, /plain text/i);
    assert.match(guidance, /must not advance/i);
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
