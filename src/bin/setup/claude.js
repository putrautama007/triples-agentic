import { readFileSync, existsSync, rmSync, statSync } from 'fs';
import { join, dirname } from 'path';

// ─── Hook loaders ─────────────────────────────────────────────────────────────

/** Returns Claude Code PreToolUse hook entries from src/hooks/*.json platforms.claude */
function loadClaudeHooks(loadHookFiles) {
  return loadHookFiles()
    .filter(h => h.platforms?.claude)
    .map(h => h.platforms.claude);
}

// ─── Settings ─────────────────────────────────────────────────────────────────

/** Write (or merge) PreToolUse hooks from platforms.claude into .claude/settings.json */
function installClaudeSettings(claudeDir, ctx) {
  const { writeFile } = ctx;
  const hookEntries = loadClaudeHooks(ctx.loadHookFiles);
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

// ─── Installer ────────────────────────────────────────────────────────────────

export function installClaude(base, ctx) {
  const { GLOBAL_PATHS, isGlobal, projectDir, allAgents, allKnowledgeSkills, knowledgeSkillContent, writeFile, installManagedProjectDoc, display } = ctx;
  const dest = isGlobal && !base ? GLOBAL_PATHS.claude : join(base || projectDir, '.claude', 'skills');
  console.log(`\nInstalling Claude Code skills → ${display(dest)}`);

  // Cleanup: remove stale agent-name directories from previous installs
  // Agents are files (${name}.md); if a directory with the same base name exists, remove it
  for (const { name } of allAgents()) {
    const dirPath = join(dest, name);
    if (existsSync(dirPath) && statSync(dirPath).isDirectory()) {
      rmSync(dirPath, { recursive: true, force: true });
      console.log(`  ✎ removed stale directory ${display(dirPath)}`);
    }
  }

  // Agents
  for (const { name, content, persona } of allAgents()) {
    const skill = ['---', `name: ${name}`, `description: TripleS agent — ${name} (${persona})`, '---', '', content].join('\n');
    writeFile(join(dest, `${name}.md`), skill);
  }

  // Knowledge skills — best-practice skill bundles with lean SKILL.md + one-level references
  for (const skill of allKnowledgeSkills()) {
    writeFile(join(dest, skill.slug, 'SKILL.md'), knowledgeSkillContent(skill));
    writeFile(join(dest, skill.slug, 'references', skill.fileName), skill.referenceContent);
  }

  // Settings — dangerous command hook (enforced at harness level)
  installClaudeSettings(dirname(dest), ctx);

  // Project guidance — create/update only managed TripleS block, preserve user-owned files
  if (!isGlobal || base) {
    installManagedProjectDoc(join(base || projectDir, 'CLAUDE.md'), 'claude-template.md');
  }
}

// ─── Detection ────────────────────────────────────────────────────────────────

export function detectClaudeInstallations(ctx) {
  const { GLOBAL_PATHS, projectDir } = ctx;
  const hasFile = (...parts) => existsSync(join(...parts));
  const found = [];

  if (hasFile(GLOBAL_PATHS.claude, 'seoyeon.md'))
    found.push({ platform: 'claude', isGlobal: true });
  if (hasFile(projectDir, '.claude', 'skills', 'seoyeon.md'))
    found.push({ platform: 'claude', isGlobal: false });

  return found;
}
