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
const planningAgents = [
  'hyerin-design',
  'jiwoo-prd',
  'lynn-testcase',
  'nakyoung-tasks',
  'yooyeon-rfc',
];

function install(platform, target) {
  const result = spawnSync(process.execPath, [setupScript, platform, '--target', target], {
    cwd: projectRoot,
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
}

function readAgent(agentsDir, slug) {
  return readFileSync(join(agentsDir, `${slug}.toml`), 'utf8');
}

function assertParentRelay(content, source) {
  assert.match(content, /five\s+planning specialists|five planning specialists/i, `${source}: planning-only scope`);
  assert.match(content, /accept(?:s| both)?\s+(?:request )?v1 and v2|accept both request versions/i, `${source}: v1/v2 migration`);
  assert.match(content, /artifact_paths/, `${source}: v1 artifact recognition`);
  assert.match(content, /question(?:s\[\])?\.?(?:\[\])?id|questions\[\]\.id/, `${source}: v1 question recognition`);
  assert.match(content, /TRIPLES_USER_INPUT_RESPONSE/, `${source}: response sentinel`);
  assert.match(content, /"version":2/, `${source}: v2 response`);
  assert.match(content, /request_id/, `${source}: request correlation`);
  assert.match(content, /question_id/, `${source}: question correlation`);
  assert.match(content, /FIFO/, `${source}: FIFO queue`);
  assert.match(content, /pending and resolved|pending.*resolved/is, `${source}: persisted lifecycle`);
  assert.match(content, /request_user_input/, `${source}: native prompt`);
  assert.match(content, /without (?:a )?timeout|without timeout/i, `${source}: no native timeout`);
  assert.match(content, /plain[- ]text/i, `${source}: text fallback`);
  assert.match(content, /same idle child target|same producing child target/i, `${source}: same child continuation`);
  assert.match(content, /Respawn only\s+(?:when|if)/i, `${source}: bounded respawn`);
  assert.match(content, /first malformed|first.*malformed/is, `${source}: corrective retry`);
  assert.match(content, /second malformed|malformed again/i, `${source}: terminal malformed policy`);
  assert.match(content, /protocol_error/, `${source}: recorded protocol error`);
  assert.match(content, /Approve.*Request changes/is, `${source}: parent approval choices`);
  assert.match(content, /same turn/i, `${source}: immediate continuation`);
  assert.match(content, /Developer,\s*checker, setup, (?:or )?QA|developer,\s*checker, setup, and QA/i, `${source}: unchanged non-planning blockers`);
}

describe('Codex custom-agent installation', () => {
  let target;
  let agentsDir;
  let agentFiles;

  before(() => {
    target = mkdtempSync(join(tmpdir(), 'triples-codex-test-'));
    install('codex', target);
    agentsDir = join(target, '.codex', 'agents');
    agentFiles = readdirSync(agentsDir).filter(file => file.endsWith('.toml')).sort();
  });

  after(() => rmSync(target, { recursive: true, force: true }));

  test('generates all 13 specialist TOML files without unsupported tool arrays', () => {
    assert.equal(agentFiles.length, 13);
    for (const file of agentFiles) {
      const content = readFileSync(join(agentsDir, file), 'utf8');
      assert.doesNotMatch(content, /^tools\s*=\s*\[/m, `${file} contains an unsupported tools array`);
    }
  });

  test('injects the child contract into exactly the five human-in-loop planning agents', () => {
    const contracted = agentFiles
      .filter(file => /Codex Planning-Gate Child Contract/.test(readFileSync(join(agentsDir, file), 'utf8')))
      .map(file => file.replace(/\.toml$/, ''));

    assert.deepEqual(contracted, planningAgents);
  });

  test('emits a v2-only child contract with stable IDs and typed questions', () => {
    for (const agent of planningAgents) {
      const content = readAgent(agentsDir, agent);

      assert.match(content, /TRIPLES_USER_INPUT_REQUIRED/);
      assert.match(content, /TRIPLES_USER_INPUT_RESPONSE/);
      assert.match(content, /"version": 2/);
      assert.doesNotMatch(content, /"version": 1/);
      assert.match(content, /stable `request_id`|stable \`request_id\`/i);
      assert.match(content, /"owner":/);
      assert.match(content, /"stage":/);
      assert.match(content, /"artifacts":/);
      assert.match(content, /one to three questions/i);
      assert.match(content, /"question_id":/);
      assert.match(content, /"type": "choice"/);
      assert.match(content, /two or three mutually exclusive options/i);
      assert.match(content, /exactly one option with .*recommended.*true/i);
      assert.match(content, /free_text.*only when meaningful choices cannot be supplied/i);
      assert.match(content, /return `READY` to the parent/i);
    }
  });

  test('does not inject planning relay behavior into dev, checker, QA, or setup agents', () => {
    for (const file of agentFiles.filter(file => !planningAgents.includes(file.replace(/\.toml$/, '')))) {
      const content = readFileSync(join(agentsDir, file), 'utf8');

      assert.doesNotMatch(content, /Codex Planning-Gate Child Contract/);
      assert.doesNotMatch(content, /TRIPLES_USER_INPUT_REQUIRED/);
      assert.doesNotMatch(content, /TRIPLES_USER_INPUT_RESPONSE/);
    }
  });

  test('installs the full parent relay in SeoYeon', () => {
    const skill = readFileSync(join(target, '.codex', 'skills', 'seoyeon', 'SKILL.md'), 'utf8');
    assertParentRelay(skill, 'SeoYeon');
    assert.match(skill, /followup_task/);
    assert.match(skill, /exact child `target`/i);
  });

  test('installs the parent relay for direct planning-specialist invocation', () => {
    const guidance = readFileSync(join(target, 'AGENTS.md'), 'utf8');
    assertParentRelay(guidance, 'AGENTS.md');
    assert.match(guidance, /orchestrated and direct invocation/i);
  });
});

describe('Claude compatibility', () => {
  let target;

  before(() => {
    target = mkdtempSync(join(tmpdir(), 'triples-claude-test-'));
    install('claude', target);
  });

  after(() => rmSync(target, { recursive: true, force: true }));

  test('preserves AskUserQuestion for all five planning subagents', () => {
    for (const agent of planningAgents) {
      const content = readFileSync(join(target, '.claude', 'agents', `${agent}.md`), 'utf8');
      assert.match(content, /^tools: .*AskUserQuestion/m, `${agent} lost AskUserQuestion`);
      assert.doesNotMatch(content, /Codex Planning-Gate Child Contract/);
    }
  });
});
