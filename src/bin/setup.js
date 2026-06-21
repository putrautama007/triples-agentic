#!/usr/bin/env node
/**
 * TripleS Agentic — Skill Plugin Setup
 *
 * Installs all TripleS skill files (agents + knowledge skills)
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
const KNOWLEDGE_DIR = join(ROOT, 'skills');
const KNOWLEDGE_GROUPS = ['coding-principles', 'planning', 'design', 'web/frontend', 'web/backend', 'mobile/android', 'mobile/ios', 'mobile/flutter', 'quality'];
const HOME = homedir();
const HOOKS_DIR = join(ROOT, 'hooks');

// ─── Global install paths ─────────────────────────────────────────────────────

const GLOBAL_PATHS = {
  claude: join(HOME, '.claude', 'skills'),
  cursor: join(HOME, '.cursor', 'rules'),
  windsurf: join(HOME, '.codeium', 'windsurf', 'rules'),
  codex: join(HOME, '.codex'),
};

// ─── CLI args ─────────────────────────────────────────────────────────────────

const rawArgs = process.argv.slice(2);
let isGlobal = rawArgs.includes('--global');
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

const MANAGED_DOC_START = '<!-- triples-agentic:start -->';
const MANAGED_DOC_END = '<!-- triples-agentic:end -->';

function readInitDocTemplate(templateName) {
  const templatePath = join(KNOWLEDGE_DIR, 'planning', 'init-project', 'references', templateName);
  return readFileSync(templatePath, 'utf-8').trimEnd() + '\n';
}

function extractManagedBlock(content) {
  const start = content.indexOf(MANAGED_DOC_START);
  const end = content.indexOf(MANAGED_DOC_END);
  if (start === -1 || end === -1 || end < start) return null;
  return content.slice(start, end + MANAGED_DOC_END.length);
}

function installManagedProjectDoc(targetPath, templateName, { legacyMarker = '' } = {}) {
  const template = readInitDocTemplate(templateName);
  const managedBlock = extractManagedBlock(template);
  if (!managedBlock) throw new Error(`Managed markers missing in ${templateName}`);

  if (!existsSync(targetPath)) {
    writeFile(targetPath, template);
    return;
  }

  const existing = readFileSync(targetPath, 'utf-8');
  const existingBlock = extractManagedBlock(existing);
  if (existingBlock) {
    writeFile(targetPath, existing.replace(existingBlock, managedBlock).trimEnd() + '\n');
    return;
  }

  if (legacyMarker && existing.includes(legacyMarker)) {
    writeFile(targetPath, template);
    return;
  }

  console.log(`  ↷ skipped existing user-owned ${display(targetPath)}`);
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

function parseCommentList(content, key) {
  const raw = parseComment(content, key);
  if (!raw) return [];
  return raw.split(',').map(item => item.trim()).filter(Boolean);
}

function parseHeading(content) {
  const m = content.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : '';
}

function stripAgentMetadataComments(content) {
  return content.replace(/^<!-- .*? -->\r?\n/gm, '').trimStart();
}

function yamlEscape(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function shortHeading(heading, fallback) {
  if (!heading) return fallback;
  return heading.split('—')[0].trim();
}

// ─── Source collectors ────────────────────────────────────────────────────────

function allAgents() {
  return readdirSync(AGENTS_DIR)
    .filter(f => f.endsWith('.md') && f !== 'README.md')
    .map(f => {
      const name    = f.replace('.md', '');
      const content = readFileSync(join(AGENTS_DIR, f), 'utf-8');
      const slug = parseComment(content, 'triples-agent') || name;
      const persona = parseComment(content, 'persona') || 'software engineering agent';
      const heading = parseHeading(content);
      return {
        name,
        slug,
        content,
        persona,
        heading,
        displayName: shortHeading(heading, name),
        knowledgePaths: parseCommentList(content, 'knowledge'),
        templatePaths: parseCommentList(content, 'templates'),
        model: parseComment(content, 'model'),
        codexModel: parseComment(content, 'codex-model'),
      };
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
    readdirSync(groupDir, { withFileTypes: true })
      .filter(entry => entry.isDirectory() && existsSync(join(groupDir, entry.name, 'SKILL.md')))
      .map(entry => entry.name)
      .sort()
      .forEach(skillDirName => {
        const skillPath = join(groupDir, skillDirName, 'SKILL.md');
        const content = readFileSync(skillPath, 'utf-8');
        const { name: skillName, description } = parseFrontmatter(content);
        const referenceFile = `${skillName || skillDirName}.md`;
        const referencePath = join(groupDir, skillDirName, 'references', referenceFile);
        const referenceContent = existsSync(referencePath) ? readFileSync(referencePath, 'utf-8') : content;
        skills.push({
          name: skillDirName,
          group,                         // planning | web | mobile | quality
          content,
         referenceContent,
          skillName: skillName || skillDirName,
          description: description || `${group} knowledge skill`,
          slug: `${group.replace(/\//g, '-')}-${skillName || skillDirName}`,
          fileName: referenceFile,
          sourcePath: skillPath,
          referencePath,
        });
      });
  }
  return skills;
}

function knowledgeSkillContent(skill) {
  return skill.content;
}

function resolveKnowledgeSource(relPath) {
  const normalized = relPath.replace(/\.md$/, '');
  const skillPath = join(KNOWLEDGE_DIR, normalized, 'SKILL.md');
  const referencePath = join(KNOWLEDGE_DIR, normalized, 'references', `${normalized.split('/').pop()}.md`);
  if (existsSync(referencePath)) return referencePath;
  if (existsSync(skillPath)) return skillPath;
  return null;
}

// ─── Hook loaders ─────────────────────────────────────────────────────────────

function loadHookFiles() {
  if (!existsSync(HOOKS_DIR)) return [];
  return readdirSync(HOOKS_DIR)
    .filter(f => f.endsWith('.json'))
    .sort()
    .map(f => JSON.parse(readFileSync(join(HOOKS_DIR, f), 'utf-8')));
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

function createInstallerContext() {
  return {
    ROOT,
    HOME,
    AGENTS_DIR,
    KNOWLEDGE_DIR,
    KNOWLEDGE_GROUPS,
    GLOBAL_PATHS,
    projectDir,
    isGlobal,
    allAgents,
    allKnowledgeSkills,
    knowledgeSkillContent,
    loadHookFiles,
    loadCodexHooks,
    stripAgentMetadataComments,
    yamlEscape,
    tomlEscape,
    display,
    writeFile,
    installManagedProjectDoc,
  };
}

async function loadCodexInstaller() {
  return import('./setup/codex.js');
}

async function loadClaudeInstaller() {
  return import('./setup/claude.js');
}

// ─── Platform installers ──────────────────────────────────────────────────────

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

async function installClaude(base) {
  const { installClaude: runClaudeInstall } = await loadClaudeInstaller();
  runClaudeInstall(base, createInstallerContext());
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
  for (const { name, group, referenceContent, description } of allKnowledgeSkills()) {
    const body = stripFrontmatter(referenceContent);
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
  for (const { name, group, referenceContent } of allKnowledgeSkills()) {
    const body = stripFrontmatter(referenceContent);
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

async function installCodex(base) {
  const { installCodex: runCodexInstall } = await loadCodexInstaller();
  runCodexInstall(base, createInstallerContext());
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
    for (const { name, referenceContent } of allKnowledgeSkills().filter(s => s.group === group)) {
      const body = stripFrontmatter(referenceContent);
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

const ORCHESTRATOR_COMMAND = ['seoyeon', 'Engineering Manager — orchestrates all agents'];

// Specialist agents — installed as Claude Code subagents (model-pinned, Agent tool) for Claude;
// skill/rule files for other platforms. [name, description, model]
const AGENT_COMMANDS = [
  ['chaewon-init-setup', 'Project Setup — initialize and audit local install', 'sonnet'],
  ['jiwoo-prd',      'Senior PM — create & review PRD', 'opus'],
  ['hyerin-design',  'Senior UI/UX — create & review design spec', 'opus'],
  ['yooyeon-rfc',    'Staff Engineer — create & review RFC', 'opus'],
  ['nakyoung-tasks', 'TPM — task breakdown with estimates', 'opus'],
  ['yubin-frontend', 'Principal Frontend — implement web UI', 'sonnet'],
  ['kaede-backend',  'Principal Backend — implement APIs', 'sonnet'],
  ['yeonji-android', 'Senior Android — implement Kotlin features', 'sonnet'],
  ['sohyun-ios',     'Senior iOS — implement Swift features', 'sonnet'],
  ['kotone-flutter', 'Senior Flutter — cross-platform Dart', 'sonnet'],
  ['lynn-testcase',  'QA Lead — create & review test cases', 'opus'],
  ['shion-qa',       'Senior QA — execute tests & Go/No-Go', 'sonnet'],
  ['dahyun-checker', 'DevOps — run tests, types & lint checks', 'sonnet'],
];

const KNOWLEDGE_SUMMARY = {
  'coding-principles': ['dry', 'kiss', 'yagni', 'solid', 'slap', 'composition-over-inheritance',
                   'fail-fast', 'least-surprise', 'boy-scout-rule', 'tdd'],
  design:          ['ux-research', 'interaction-design', 'visual-design', 'design-system',
                   'design-handoff', 'cross-platform-design', 'mobile-design-system',
                   'content-design', 'design-system-audit', 'state-coverage'],
  planning:        ['orchestration', 'prd-writing', 'prd-quality-gates', 'product-principles',
                   'product-prioritization', 'rfc-writing', 'rfc-quality-gates',
                   'architecture-patterns', 'architecture-database', 'architecture-security',
                   'task-decomposition', 'task-readiness', 'estimation',
                   'decision-log-discipline', 'implementation-readiness', 'init-project'],
  'web/frontend':  ['frontend-components', 'frontend-state', 'frontend-performance',
                   'frontend-data-fetching', 'web-accessibility', 'web-performance', 'web-security',
                   ],
  'web/backend':   ['backend-structure', 'backend-security', 'backend-testing-strategy',
                   'api-design', 'api-security'],
  'mobile/android': ['android-architecture', 'android-platform', 'kotlin-core', 'kotlin-concurrency'],
  'mobile/ios':     ['ios-architecture', 'ios-platform', 'swift-core', 'swift-concurrency'],
  'mobile/flutter': ['flutter-architecture', 'flutter-platform', 'dart-core', 'dart-async'],
  quality:         ['testing-strategy', 'testing-types', 'test-case-writing', 'test-case-quality',
                   'qa-execution', 'qa-reporting', 'defect-triage', 'regression-selection'],
};

// ─── Update helpers ───────────────────────────────────────────────────────────

/**
 * Detect existing TripleS installations by checking sentinel files.
 * Returns an array of { platform, isGlobal } objects.
 */
async function detectInstallations() {
  const found = [];

  const hasFile = (...parts) => existsSync(join(...parts));
  const hasMarker = (file) => {
    try { return readFileSync(file, 'utf-8').includes('TripleS Agent Orchestrator'); } catch { return false; }
  };

  // Claude
  const { detectClaudeInstallations } = await loadClaudeInstaller();
  found.push(...detectClaudeInstallations(createInstallerContext()));

  // Cursor
  if (hasFile(GLOBAL_PATHS.cursor, 'seoyeon.mdc'))
    found.push({ platform: 'cursor', isGlobal: true });
  if (hasFile(projectDir, '.cursor', 'rules', 'seoyeon.mdc'))
    found.push({ platform: 'cursor', isGlobal: false });

  // Copilot — project-only
  if (hasFile(projectDir, '.github', 'instructions', 'seoyeon.instructions.md'))
    found.push({ platform: 'copilot', isGlobal: false });

  // Codex
  const { detectCodexInstallations } = await loadCodexInstaller();
  found.push(...detectCodexInstallations(createInstallerContext()));

  // Windsurf
  const windsurfGlobal = join(GLOBAL_PATHS.windsurf, '.windsurfrules');
  if (hasFile(windsurfGlobal) && hasMarker(windsurfGlobal))
    found.push({ platform: 'windsurf', isGlobal: true });
  const windsurfProject = join(projectDir, '.windsurfrules');
  if (hasFile(windsurfProject) && hasMarker(windsurfProject))
    found.push({ platform: 'windsurf', isGlobal: false });

  return found;
}

async function runUpdate() {
  const installations = await detectInstallations();

  if (installations.length === 0) {
    console.log('\n⚠  No existing TripleS Agentic installations detected.\n');
    console.log('Run the installer to get started:');
    console.log('  npx triples-agentic\n');
    return;
  }

  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║  TripleS Agentic — Update                        ║');
  console.log('║  Software Engineering Agent Orchestrator         ║');
  console.log('╚══════════════════════════════════════════════════╝\n');
  console.log('Detected installations:\n');
  for (const { platform, isGlobal: g } of installations) {
    console.log(`  • ${PLATFORM_LABELS[platform]} (${g ? 'global' : 'project'})`);
  }
  console.log('');

  const savedIsGlobal = isGlobal;
  for (const { platform, isGlobal: g } of installations) {
    isGlobal = g;
    await INSTALLERS[platform](g ? null : projectDir);
  }
  isGlobal = savedIsGlobal;

  const totalKnowledge = Object.values(KNOWLEDGE_SUMMARY).reduce((n, g) => n + g.length, 0);
  console.log(`\n✅  Updated ${installations.length} installation(s) — ${AGENT_COMMANDS.length + 1} agents, ${totalKnowledge} knowledge references\n`);
}

// ─── Success banner ───────────────────────────────────────────────────────────

function printSuccessBanner() {
  const totalKnowledge = Object.values(KNOWLEDGE_SUMMARY).reduce((n, g) => n + g.length, 0);
  const knowledgeGroups = Object.keys(KNOWLEDGE_SUMMARY).length;
  console.log('\n✅  TripleS Agentic installed successfully!\n');

  console.log('── Orchestrator (slash command) ───────────────────────────────');
  console.log(`  /${ORCHESTRATOR_COMMAND[0].padEnd(17)} ${ORCHESTRATOR_COMMAND[1]}`);

  console.log('\n── Specialist Agents (model-pinned subagents on Claude Code) ──');
  for (const [cmd, desc, model] of AGENT_COMMANDS) {
    console.log(`  ${cmd.padEnd(18)} [${model.padEnd(6)}] ${desc}`);
  }

  console.log(`\n── Knowledge Library (${totalKnowledge} bundled references across ${knowledgeGroups} groups) ───────`);
  for (const [group, skills] of Object.entries(KNOWLEDGE_SUMMARY)) {
    const label = group.includes('/') ? group : group; // full path for sub-groups
    console.log(`  ${label.padEnd(16)} ${skills.map(s => `/${s}`).join('  ')}`);
  }

  console.log('\nUse `/seoyeon` in Claude Code, or `/skills` / `$seoyeon` in Codex.');
  console.log('To update later run: npx triples-agentic update\n');
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
      await INSTALLERS[p](useGlobal && GLOBAL_PATHS[p] ? null : projectDir);
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

  if (platformArg === 'update') {
    await runUpdate();
    return;
  }

  if (platformArg === 'all') {
    for (const installer of Object.values(INSTALLERS)) {
      await installer(isGlobal ? null : projectDir);
    }
    printSuccessBanner();
    return;
  }

  if (!INSTALLERS[platformArg]) {
    console.error(`\n❌ Unknown platform: ${platformArg}`);
    console.error('Supported: claude | cursor | copilot | codex | windsurf | all | update\n');
    process.exit(1);
  }

  await INSTALLERS[platformArg](isGlobal ? null : projectDir);
  printSuccessBanner();
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
