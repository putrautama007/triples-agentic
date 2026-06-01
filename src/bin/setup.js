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

// ─── Platform installers ──────────────────────────────────────────────────────

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
}

function installCodex(base) {
  const dest = join(base || projectDir, 'AGENTS.md');
  console.log(`\nInstalling OpenAI Codex → ${display(dest)}`);

  const lines = ['# TripleS Agent Orchestrator\n\n', '## Agents\n\n'];
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
}

function installWindsurf(base) {
  const dest = isGlobal && !base
    ? join(GLOBAL_PATHS.windsurf, '.windsurfrules')
    : join(base || projectDir, '.windsurfrules');
  console.log(`\nInstalling Windsurf rules → ${display(dest)}`);

  const lines = ['# TripleS Agent Orchestrator — Windsurf Rules\n\n', '## Agents\n\n'];
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
