#!/usr/bin/env node
/**
 * TripleS Agentic — Skill Plugin Setup
 *
 * Installs all TripleS skill files (11 agents + 40 knowledge skills)
 * into your coding assistant's config directory.
 *
 * Usage:
 *   npx triples-agentic                         → interactive wizard
 *   npx triples-agentic claude                  → Claude Code, project-level
 *   npx triples-agentic claude --global         → Claude Code, global (~/.claude/skills/)
 *   npx triples-agentic cursor --global         → Cursor, global (~/.cursor/rules/)
 *   npx triples-agentic all                     → all platforms, project-level
 *   npx triples-agentic claude --target <dir>   → install into a specific project directory
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');
const AGENTS_DIR = join(ROOT, 'agents');
const KNOWLEDGE_DIR = join(ROOT, 'knowledge');
const KNOWLEDGE_GROUPS = ['planning', 'web', 'mobile/android', 'mobile/ios', 'mobile/flutter', 'quality'];
const HOME = homedir();
const HOOKS_DIR = join(ROOT, 'hooks');

// ─── Global install paths ─────────────────────────────────────────────────────

const GLOBAL_PATHS = {
  claude: join(HOME, '.claude', 'skills'),
  cursor: join(HOME, '.cursor', 'rules'),
  windsurf: join(HOME, '.codeium', 'windsurf', 'rules'),
};

// ─── CLI args ─────────────────────────────────────────────────────────────────

const rawArgs = process.argv.slice(2);
const isGlobal = rawArgs.includes('--global');
const args = rawArgs.filter(a => a !== '--global');

const platformArg = args[0];
let projectDir = process.cwd();

const targetIdx = args.indexOf('--target');
if (targetIdx !== -1 && args[targetIdx + 1]) {
  projectDir = args[targetIdx + 1];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function display(p) {
  return p.startsWith(HOME) ? p.replace(HOME, '~') : p;
}

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, content) {
  ensureDir(dirname(filePath));
  writeFileSync(filePath, content, 'utf-8');
  console.log(`  ✓ ${display(filePath)}`);
}

/** Parse name/description from YAML frontmatter block (--- ... ---) */
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]+?)\r?\n---/);
  if (!match) return { name: '', description: '' };
  const fm = match[1];
  const name        = (fm.match(/^name:\s*(.+)$/m)        || [])[1]?.trim() ?? '';
  const description = (fm.match(/^description:\s*(.+)$/m) || [])[1]?.trim() ?? '';
  return { name, description };
}

/** Strip existing frontmatter block so we can re-wrap for a platform */
function stripFrontmatter(content) {
  return content.replace(/^---\r?\n[\s\S]+?\r?\n---\r?\n?/, '').trimStart();
}

/** Parse <!-- key: value --> HTML comment from agent files */
function parseComment(content, key) {
  const m = content.match(new RegExp(`<!-- ${key}: (.+?) -->`));
  return m ? m[1].trim() : '';
}

// ─── Source collectors ────────────────────────────────────────────────────────

function allAgents() {
  return readdirSync(AGENTS_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const name    = f.replace('.md', '');
      const content = readFileSync(join(AGENTS_DIR, f), 'utf-8');
      const persona = parseComment(content, 'persona') || 'software engineering agent';
      return { name, content, persona };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Returns all knowledge skill files from every group subdirectory.
 * Each entry: { name, group, content, skillName, description }
 * where skillName/description come from the file's YAML frontmatter.
 */
function allKnowledgeSkills() {
  const skills = [];
  for (const group of KNOWLEDGE_GROUPS) {
    const groupDir = join(KNOWLEDGE_DIR, group);
    if (!existsSync(groupDir)) continue;
    readdirSync(groupDir)
      .filter(f => f.endsWith('.md'))
      .sort()
      .forEach(f => {
        const content = readFileSync(join(groupDir, f), 'utf-8');
        const { name: skillName, description } = parseFrontmatter(content);
        skills.push({
          name: f.replace('.md', ''),   // filename slug (e.g. prd-writing)
          group,                         // planning | web | mobile | quality
          content,
          skillName: skillName || f.replace('.md', ''),
          description: description || `${group} knowledge skill`,
        });
      });
  }
  return skills;
}

// ─── Hook loaders ─────────────────────────────────────────────────────────────

function loadHookFiles() {
  if (!existsSync(HOOKS_DIR)) return [];
  return readdirSync(HOOKS_DIR)
    .filter(f => f.endsWith('.json'))
    .sort()
    .map(f => JSON.parse(readFileSync(join(HOOKS_DIR, f), 'utf-8')));
}

/** Returns Claude Code PreToolUse hook entries from src/hooks/*.json platforms.claude */
function loadClaudeHooks() {
  return loadHookFiles()
    .filter(h => h.platforms?.claude)
    .map(h => h.platforms.claude);
}

/** Returns Codex PreToolUse hook entries from src/hooks/*.json platforms.codex */
function loadCodexHooks() {
  return loadHookFiles()
    .filter(h => h.platforms?.codex)
    .map(h => h.platforms.codex);
}

/** Returns Windsurf hook entries from src/hooks/*.json platforms.windsurf, grouped by event */
function loadWindsurfHooks() {
  const byEvent = {};
  for (const h of loadHookFiles()) {
    const ws = h.platforms?.windsurf;
    if (!ws?.event) continue;
    const { event, ...cfg } = ws;
    byEvent[event] = byEvent[event] || [];
    byEvent[event].push(cfg);
  }
  return byEvent;
}

/**
 * Returns the stripped body of all src/hooks/*.md files joined together.
 * Used as plain text safety rules for platforms without a hook execution model.
 */
function loadSafetyRulesBody() {
  if (!existsSync(HOOKS_DIR)) return '';
  return readdirSync(HOOKS_DIR)
    .filter(f => f.endsWith('.md'))
    .sort()
    .map(f => stripFrontmatter(readFileSync(join(HOOKS_DIR, f), 'utf-8')))
    .join('\n\n')
    .trim();
}

/** Escape a string for use inside a TOML double-quoted basic string. */
function tomlEscape(str) {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

// ─── Platform installers ──────────────────────────────────────────────────────

/** Write (or merge) PreToolUse hooks from platforms.claude into .claude/settings.json */
function installClaudeSettings(claudeDir) {
  const hookEntries = loadClaudeHooks();
  if (hookEntries.length === 0) return;

  const settingsPath = join(claudeDir, 'settings.json');
  let settings = {};
  if (existsSync(settingsPath)) {
    try { settings = JSON.parse(readFileSync(settingsPath, 'utf-8')); } catch {}
  }
  settings.hooks = settings.hooks || {};

  const events = [...new Set(hookEntries.map(e => e.event).filter(Boolean))];
  for (const event of events) {
    const incoming = hookEntries.filter(e => e.event === event);
    const existing = settings.hooks[event] || [];
    const matchers = new Set(incoming.map(e => e.matcher));
    settings.hooks[event] = [
      ...existing.filter(e => !matchers.has(e.matcher) || !e.hooks?.some(h => h.statusMessage === 'Checking for dangerous commands...')),
      ...incoming.map(({ event: _e, ...entry }) => entry),
    ];
  }

  writeFile(settingsPath, JSON.stringify(settings, null, 2));
}

/** Write (or append) PreToolUse hooks from platforms.codex into .codex/config.toml */
function installCodexSettings(base) {
  const hookEntries = loadCodexHooks().filter(e => e.event === 'PreToolUse');
  if (hookEntries.length === 0) return;

  const configPath = join(base || projectDir, '.codex', 'config.toml');
  let existing = existsSync(configPath) ? readFileSync(configPath, 'utf-8') : '';

  // Remove previous triples-agentic block (idempotent reinstall)
  existing = existing.replace(/\n?# triples-agentic hooks[\s\S]*?# end triples-agentic hooks\n?/g, '');

  let block = '\n# triples-agentic hooks\n';
  for (const entry of hookEntries) {
    block += `\n[[hooks.PreToolUse]]\n`;
    if (entry.matcher) block += `matcher = "${tomlEscape(entry.matcher)}"\n`;
    for (const hook of (entry.hooks || [])) {
      block += `\n[[hooks.PreToolUse.hooks]]\n`;
      block += `type = "command"\n`;
      block += `command = "${tomlEscape(hook.command)}"\n`;
      if (hook.statusMessage) block += `statusMessage = "${tomlEscape(hook.statusMessage)}"\n`;
    }
  }
  block += '\n# end triples-agentic hooks\n';

  writeFile(configPath, existing.trimEnd() + block);
}

/** Write (or merge) Windsurf hooks from platforms.windsurf into .windsurf/hooks.json */
function installWindsurfSettings(base) {
  const byEvent = loadWindsurfHooks();
  if (Object.keys(byEvent).length === 0) return;

  const hooksPath = join(base || projectDir, '.windsurf', 'hooks.json');
  let config = { hooks: {} };
  if (existsSync(hooksPath)) {
    try { config = JSON.parse(readFileSync(hooksPath, 'utf-8')); } catch {}
  }
  config.hooks = config.hooks || {};

  for (const [event, incoming] of Object.entries(byEvent)) {
    const existing = (config.hooks[event] || []).filter(
      e => e.command !== incoming[0]?.command  // remove previous triples-agentic entry
    );
    config.hooks[event] = [...existing, ...incoming];
  }

  writeFile(hooksPath, JSON.stringify(config, null, 2));
}

function installClaude(base) {
  const dest = isGlobal && !base ? GLOBAL_PATHS.claude : join(base || projectDir, '.claude', 'skills');
  console.log(`\nInstalling Claude Code skills → ${display(dest)}`);

  // Agents
  for (const { name, content, persona } of allAgents()) {
    const skill = ['---', `name: ${name}`, `description: TripleS agent — ${name} (${persona})`, '---', '', content].join('\n');
    writeFile(join(dest, `${name}.md`), skill);
  }

  // Knowledge skills — already have correct frontmatter, install as-is
  for (const { name, group, content } of allKnowledgeSkills()) {
    writeFile(join(dest, 'knowledge', group, `${name}.md`), content);
  }

  // Settings — dangerous command hook (enforced at harness level)
  installClaudeSettings(dirname(dest));
}

function installCursor(base) {
  const dest = isGlobal && !base ? GLOBAL_PATHS.cursor : join(base || projectDir, '.cursor', 'rules');
  console.log(`\nInstalling Cursor rules → ${display(dest)}`);

  // Agents
  for (const { name, content, persona } of allAgents()) {
    const rule = ['---', `description: TripleS agent — ${name} (${persona})`, 'alwaysApply: false', '---', '', content].join('\n');
    writeFile(join(dest, `${name}.mdc`), rule);
  }

  // Knowledge skills
  for (const { name, group, content, description } of allKnowledgeSkills()) {
    const body = stripFrontmatter(content);
    const rule = ['---', `description: ${description}`, 'alwaysApply: false', '---', '', body].join('\n');
    writeFile(join(dest, 'knowledge', group, `${name}.mdc`), rule);
  }

  // Safety guardrails — always-applied rule (text-level enforcement)
  const safetyBody = loadSafetyRulesBody();
  if (safetyBody) {
    const safetyRule = ['---', 'description: TripleS safety guardrails — never run dangerous commands without explicit user confirmation', 'alwaysApply: true', '---', '', safetyBody].join('\n');
    writeFile(join(dest, 'triples-safety.mdc'), safetyRule);
  }
}

function installCopilot(base) {
  const dest = join(base || projectDir, '.github', 'instructions');
  console.log(`\nInstalling Copilot instructions → ${display(dest)}`);

  // Agents
  for (const { name, content } of allAgents()) {
    const instruction = ['---', 'applyTo: "**"', '---', '', content].join('\n');
    writeFile(join(dest, `${name}.instructions.md`), instruction);
  }

  // Knowledge skills
  for (const { name, group, content } of allKnowledgeSkills()) {
    const body = stripFrontmatter(content);
    const instruction = ['---', 'applyTo: "**"', '---', '', body].join('\n');
    writeFile(join(dest, 'knowledge', group, `${name}.instructions.md`), instruction);
  }

  // Safety guardrails — always-applied instruction (text-level enforcement)
  const safetyBody = loadSafetyRulesBody();
  if (safetyBody) {
    const safetyInstruction = ['---', 'applyTo: "**"', '---', '', safetyBody].join('\n');
    writeFile(join(dest, 'triples-safety.instructions.md'), safetyInstruction);
  }
}

function installCodex(base) {
  const dest = join(base || projectDir, 'AGENTS.md');
  console.log(`\nInstalling OpenAI Codex → ${display(dest)}`);

  const safetyBody = loadSafetyRulesBody();
  const lines = ['# TripleS Agent Orchestrator\n\n', ...(safetyBody ? [safetyBody + '\n\n'] : []), '## Agents\n\n'];
  for (const { name, content } of allAgents()) {
    lines.push(`---\n\n${content}\n\n`);
  }

  lines.push('## Knowledge Skills\n\n');
  for (const group of KNOWLEDGE_GROUPS) {
    lines.push(`### ${group.charAt(0).toUpperCase() + group.slice(1)}\n\n`);
    for (const { name, content } of allKnowledgeSkills().filter(s => s.group === group)) {
      const body = stripFrontmatter(content);
      lines.push(`#### ${name}\n\n${body}\n\n`);
    }
  }

  writeFileSync(dest, lines.join(''), 'utf-8');
  console.log(`  ✓ ${display(dest)}`);

  // Hooks — enforced at harness level via .codex/config.toml
  installCodexSettings(base);
}

function installWindsurf(base) {
  const dest = isGlobal && !base
    ? join(GLOBAL_PATHS.windsurf, '.windsurfrules')
    : join(base || projectDir, '.windsurfrules');
  console.log(`\nInstalling Windsurf rules → ${display(dest)}`);

  const safetyBody = loadSafetyRulesBody();
  const lines = ['# TripleS Agent Orchestrator — Windsurf Rules\n\n', ...(safetyBody ? [safetyBody + '\n\n'] : []), '## Agents\n\n'];
  for (const { name, content } of allAgents()) {
    lines.push(`### ${name}\n\n${content}\n\n`);
  }

  lines.push('## Knowledge Skills\n\n');
  for (const group of KNOWLEDGE_GROUPS) {
    lines.push(`### ${group.charAt(0).toUpperCase() + group.slice(1)}\n\n`);
    for (const { name, content } of allKnowledgeSkills().filter(s => s.group === group)) {
      const body = stripFrontmatter(content);
      lines.push(`#### ${name}\n\n${body}\n\n`);
    }
  }

  const dir = dirname(dest);
  if (dir !== '.') ensureDir(dir);
  writeFileSync(dest, lines.join(''), 'utf-8');
  console.log(`  ✓ ${display(dest)}`);

  // Hooks — enforced at harness level via .windsurf/hooks.json
  installWindsurfSettings(base);
}

const INSTALLERS = {
  claude: installClaude,
  cursor: installCursor,
  copilot: installCopilot,
  codex: installCodex,
  windsurf: installWindsurf,
};

const PLATFORM_LABELS = {
  claude: 'Claude Code', cursor: 'Cursor AI', copilot: 'GitHub Copilot',
  codex: 'OpenAI Codex', windsurf: 'Windsurf',
};

// ─── Success banner ───────────────────────────────────────────────────────────

const AGENT_COMMANDS = [
  ['seoyeon',        'Engineering Manager — orchestrates all agents'],
  ['jiwoo-prd',      'Senior PM — create & review PRD'],
  ['yooyeon-rfc',    'Staff Engineer — create & review RFC'],
  ['nakyoung-tasks', 'TPM — task breakdown with estimates'],
  ['yubin-frontend', 'Principal Frontend — implement web UI'],
  ['kaede-backend',  'Principal Backend — implement APIs'],
  ['yeonji-android', 'Senior Android — implement Kotlin features'],
  ['sohyun-ios',     'Senior iOS — implement Swift features'],
  ['kotone-flutter', 'Senior Flutter — cross-platform Dart'],
  ['lynn-testcase',  'QA Lead — create & review test cases'],
  ['shion-qa',       'Senior QA — execute tests & Go/No-Go'],
];

const KNOWLEDGE_SUMMARY = {
  planning:        ['orchestration', 'prd-writing', 'prd-quality-gates', 'product-principles',
                   'product-prioritization', 'rfc-writing', 'rfc-quality-gates',
                   'architecture-patterns', 'architecture-database', 'architecture-security',
                   'task-decomposition', 'task-readiness', 'estimation'],
  web:             ['frontend-components', 'frontend-state', 'frontend-performance',
                   'web-accessibility', 'web-performance', 'web-security',
                   'backend-structure', 'backend-security', 'api-design', 'api-security'],
  'mobile/android': ['android-architecture', 'android-platform', 'kotlin-core', 'kotlin-concurrency'],
  'mobile/ios':     ['ios-architecture', 'ios-platform', 'swift-core', 'swift-concurrency'],
  'mobile/flutter': ['flutter-architecture', 'flutter-platform', 'dart-core', 'dart-async'],
  quality:         ['testing-strategy', 'testing-types', 'test-case-writing', 'test-case-quality',
                   'qa-execution', 'qa-reporting'],
};

function printSuccessBanner() {
  const totalKnowledge = Object.values(KNOWLEDGE_SUMMARY).reduce((n, g) => n + g.length, 0);
  console.log('\n✅  TripleS Agentic installed successfully!\n');

  console.log('── Agents (invoke as slash commands) ──────────────────────────');
  for (const [cmd, desc] of AGENT_COMMANDS) {
    console.log(`  /${cmd.padEnd(18)} ${desc}`);
  }

  console.log(`\n── Knowledge Skills (${totalKnowledge} skills across 4 groups) ──────────────────`);
  for (const [group, skills] of Object.entries(KNOWLEDGE_SUMMARY)) {
    const label = group.includes('/') ? group : group; // full path for sub-groups
    console.log(`  ${label.padEnd(16)} ${skills.map(s => `/${s}`).join('  ')}`);
  }

  console.log('\nStart the full pipeline with /seoyeon\n');
}

// ─── Interactive wizard ───────────────────────────────────────────────────────

function ask(rl, question) {
  return new Promise(resolve => rl.question(question, a => resolve(a.trim())));
}

async function runWizard() {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║  TripleS Agentic — Skill Plugin Setup            ║');
  console.log('║  Software Engineering Agent Orchestrator         ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  const rl = createInterface({ input: process.stdin, output: process.stdout });

  try {
    console.log('Which coding assistant are you installing for?\n');
    console.log('  1. Claude Code');
    console.log('  2. Cursor AI');
    console.log('  3. GitHub Copilot');
    console.log('  4. OpenAI Codex');
    console.log('  5. Windsurf');
    console.log('  6. All of the above');

    const platformInput = await ask(rl, '\nEnter number [1-6]: ');
    const platformChoices = {
      '1': ['claude'], '2': ['cursor'], '3': ['copilot'],
      '4': ['codex'],  '5': ['windsurf'], '6': Object.keys(INSTALLERS),
    };
    const selectedPlatforms = platformChoices[platformInput];

    if (!selectedPlatforms) {
      console.error('\n❌ Invalid selection. Run again and enter a number from 1–6.');
      rl.close(); process.exit(1);
    }

    const supportsGlobal = selectedPlatforms.some(p => GLOBAL_PATHS[p]);
    let useGlobal = false;

    if (supportsGlobal) {
      const globalPlatforms = selectedPlatforms.filter(p => GLOBAL_PATHS[p]);
      console.log('\nInstall scope?\n');
      console.log('  1. Global — applies to all your projects');
      console.log(`     (${globalPlatforms.map(p => `${PLATFORM_LABELS[p]}: ${display(GLOBAL_PATHS[p])}`).join(', ')})`);
      console.log('  2. Project — current directory only');
      console.log(`     (${display(projectDir)})`);

      const scopeInput = await ask(rl, '\nEnter number [1-2]: ');
      useGlobal = scopeInput === '1';
    }

    rl.close();

    console.log('');
    for (const p of selectedPlatforms) {
      INSTALLERS[p](useGlobal && GLOBAL_PATHS[p] ? null : projectDir);
    }

    printSuccessBanner();
  } catch (err) {
    rl.close();
    console.error('\n❌ Setup failed:', err.message);
    process.exit(1);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!platformArg || platformArg === 'setup') {
    await runWizard();
    return;
  }

  if (platformArg === 'all') {
    for (const installer of Object.values(INSTALLERS)) {
      installer(isGlobal ? null : projectDir);
    }
    printSuccessBanner();
    return;
  }

  if (!INSTALLERS[platformArg]) {
    console.error(`\n❌ Unknown platform: ${platformArg}`);
    console.error('Supported: claude | cursor | copilot | codex | windsurf | all\n');
    process.exit(1);
  }

  INSTALLERS[platformArg](isGlobal ? null : projectDir);
  printSuccessBanner();
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
