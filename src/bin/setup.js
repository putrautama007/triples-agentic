#!/usr/bin/env node
/**
 * TripleS Agentic — Skill Plugin Setup
 *
 * Installs 11 TripleS agent skill files into your coding assistant's config directory.
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
const HOME = homedir();

// ─── Global install paths (platform → user home config dir) ──────────────────

const GLOBAL_PATHS = {
  claude: join(HOME, '.claude', 'skills'),
  cursor: join(HOME, '.cursor', 'rules'),
  windsurf: join(HOME, '.codeium', 'windsurf', 'rules'),
};

// ─── Parse CLI args ───────────────────────────────────────────────────────────

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

function parseComment(content, key) {
  const m = content.match(new RegExp(`<!-- ${key}: (.+?) -->`));
  return m ? m[1].trim() : '';
}

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

function allAgents() {
  return readdirSync(AGENTS_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''))
    .sort();
}

function readAgent(name) {
  return readFileSync(join(AGENTS_DIR, `${name}.md`), 'utf-8');
}

function agentMeta(content) {
  return {
    name: parseComment(content, 'triples-agent'),
    persona: parseComment(content, 'persona') || 'software engineering agent',
  };
}

// ─── Platform installers ──────────────────────────────────────────────────────

function installClaude(base) {
  const dest = isGlobal && !base ? GLOBAL_PATHS.claude : join(base || projectDir, '.claude', 'skills');
  console.log(`\nInstalling Claude Code skills → ${display(dest)}`);
  for (const name of allAgents()) {
    const content = readAgent(name);
    const { persona } = agentMeta(content);
    const skill = [
      '---',
      `name: ${name}`,
      `description: TripleS — ${name} (${persona})`,
      '---',
      '',
      content,
    ].join('\n');
    writeFile(join(dest, `${name}.md`), skill);
  }
}

function installCursor(base) {
  const dest = isGlobal && !base ? GLOBAL_PATHS.cursor : join(base || projectDir, '.cursor', 'rules');
  console.log(`\nInstalling Cursor rules → ${display(dest)}`);
  for (const name of allAgents()) {
    const content = readAgent(name);
    const { persona } = agentMeta(content);
    const rule = [
      '---',
      `description: TripleS ${name} — ${persona}`,
      'alwaysApply: false',
      '---',
      '',
      content,
    ].join('\n');
    writeFile(join(dest, `${name}.mdc`), rule);
  }
}

function installCopilot(base) {
  // Copilot instructions are always project-level
  const dest = join(base || projectDir, '.github', 'instructions');
  console.log(`\nInstalling Copilot instructions → ${display(dest)}`);
  for (const name of allAgents()) {
    const content = readAgent(name);
    const instruction = ['---', 'applyTo: "**"', '---', '', content].join('\n');
    writeFile(join(dest, `${name}.instructions.md`), instruction);
  }
}

function installCodex(base) {
  // Codex uses a single AGENTS.md at the project root
  const dest = join(base || projectDir, 'AGENTS.md');
  console.log(`\nInstalling OpenAI Codex → ${display(dest)}`);
  const sections = ['# TripleS Agent Orchestrator\n\n'];
  for (const name of allAgents()) {
    sections.push(`---\n\n${readAgent(name)}\n\n`);
  }
  writeFileSync(dest, sections.join(''), 'utf-8');
  console.log(`  ✓ ${display(dest)}`);
}

function installWindsurf(base) {
  const dest = isGlobal && !base
    ? join(GLOBAL_PATHS.windsurf, '.windsurfrules')
    : join(base || projectDir, '.windsurfrules');
  console.log(`\nInstalling Windsurf rules → ${display(dest)}`);
  const sections = ['# TripleS Agent Orchestrator — Windsurf Rules\n\n'];
  for (const name of allAgents()) {
    sections.push(`## ${name}\n\n${readAgent(name)}\n\n`);
  }
  const dir = dirname(dest);
  if (dir !== '.') ensureDir(dir);
  writeFileSync(dest, sections.join(''), 'utf-8');
  console.log(`  ✓ ${display(dest)}`);
}

const INSTALLERS = {
  claude: installClaude,
  cursor: installCursor,
  copilot: installCopilot,
  codex: installCodex,
  windsurf: installWindsurf,
};

const PLATFORM_LABELS = {
  claude: 'Claude Code',
  cursor: 'Cursor AI',
  copilot: 'GitHub Copilot',
  codex: 'OpenAI Codex',
  windsurf: 'Windsurf',
};

const SLASH_COMMANDS = [
  ['seoyeon', 'Engineering Manager — orchestrates all agents'],
  ['jiwoo-prd', 'Senior PM — create & review PRD'],
  ['yooyeon-rfc', 'Staff Engineer — create & review RFC'],
  ['nakyoung-tasks', 'TPM — task breakdown with estimates'],
  ['yubin-frontend', 'Principal Frontend — implement web UI'],
  ['kaede-backend', 'Principal Backend — implement APIs'],
  ['yeonji-android', 'Senior Android — implement Kotlin features'],
  ['sohyun-ios', 'Senior iOS — implement Swift features'],
  ['kotone-flutter', 'Senior Flutter — cross-platform Dart'],
  ['lynn-testcase', 'QA Lead — create & review test cases'],
  ['shion-qa', 'Senior QA — execute tests & Go/No-Go'],
];

function printSuccessBanner(platforms) {
  console.log('\n✅  TripleS agents installed successfully!\n');
  console.log('Invoke agents using slash commands:\n');
  for (const [cmd, desc] of SLASH_COMMANDS) {
    console.log(`  /${cmd.padEnd(18)} ${desc}`);
  }
  console.log('\nFull workflow: start with /seoyeon to orchestrate the pipeline.\n');
}

// ─── Interactive wizard ───────────────────────────────────────────────────────

function ask(rl, question) {
  return new Promise(resolve => rl.question(question, answer => resolve(answer.trim())));
}

async function runWizard() {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║  TripleS Agentic — Skill Plugin Setup            ║');
  console.log('║  Software Engineering Agent Orchestrator         ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  const rl = createInterface({ input: process.stdin, output: process.stdout });

  try {
    // Step 1 — Platform selection
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
      rl.close();
      process.exit(1);
    }

    // Step 2 — Scope selection (only for platforms that support global)
    const supportsGlobal = selectedPlatforms.some(p => GLOBAL_PATHS[p]);
    let useGlobal = false;

    if (supportsGlobal) {
      const hasGlobalOnly = selectedPlatforms.every(p => !GLOBAL_PATHS[p] === false);
      const globalPlatforms = selectedPlatforms.filter(p => GLOBAL_PATHS[p]);
      const sampleGlobal = GLOBAL_PATHS[globalPlatforms[0]];

      console.log('\nInstall scope?\n');
      console.log(`  1. Global — applies to all your projects`);
      console.log(`     (${globalPlatforms.map(p => `${PLATFORM_LABELS[p]}: ${display(GLOBAL_PATHS[p])}`).join(', ')})`);
      console.log(`  2. Project — current directory only`);
      console.log(`     (${display(projectDir)})`);

      const scopeInput = await ask(rl, '\nEnter number [1-2]: ');
      useGlobal = scopeInput === '1';
    }

    rl.close();

    // Install
    console.log('');
    for (const p of selectedPlatforms) {
      if (useGlobal && GLOBAL_PATHS[p]) {
        INSTALLERS[p](null); // null = use global path
      } else {
        INSTALLERS[p](projectDir);
      }
    }

    printSuccessBanner(selectedPlatforms);
  } catch (err) {
    rl.close();
    console.error('\n❌ Setup failed:', err.message);
    process.exit(1);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!platformArg || platformArg === 'setup') {
    // Interactive wizard
    await runWizard();
    return;
  }

  // Non-interactive direct install
  if (platformArg === 'all') {
    for (const installer of Object.values(INSTALLERS)) {
      installer(isGlobal ? null : projectDir);
    }
    printSuccessBanner(Object.keys(INSTALLERS));
    return;
  }

  if (!INSTALLERS[platformArg]) {
    console.error(`\n❌ Unknown platform: ${platformArg}`);
    console.error('Supported: claude | cursor | copilot | codex | windsurf | all\n');
    process.exit(1);
  }

  INSTALLERS[platformArg](isGlobal ? null : projectDir);
  printSuccessBanner([platformArg]);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
