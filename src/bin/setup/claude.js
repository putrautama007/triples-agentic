import { readFileSync, existsSync, rmSync } from 'fs';
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
  const { GLOBAL_PATHS, isGlobal, projectDir, allAgents, allKnowledgeSkills, knowledgeSkillContent, stripAgentMetadataComments, writeFile, installManagedProjectDoc, display } = ctx;
  const dest = isGlobal && !base ? GLOBAL_PATHS.claude : join(base || projectDir, '.claude', 'skills');
  const agentsDest = join(dirname(dest), 'agents');
  console.log(`\nInstalling Claude Code skills → ${display(dest)}`);
  console.log(`Installing Claude Code subagents → ${display(agentsDest)}`);

  // SeoYeon stays a Skill — she is the slash-command entry point (/seoyeon, /seoyeon run).
  // Every other agent installs as a native Claude Code subagent (.claude/agents/{name}.md)
  // so it can be delegated to via the Agent tool with its own pinned model.
  for (const { name, content, persona, model, tools } of allAgents()) {
    const mdPath = join(dest, `${name}.md`);
    if (existsSync(mdPath)) {
      rmSync(mdPath, { force: true });
      console.log(`  ✎ removed stale file ${display(mdPath)}`);
    }

    if (name === 'seoyeon') {
      const skill = ['---', `name: ${name}`, `description: TripleS agent — ${name} (${persona})`, '---', '', content].join('\n');
      writeFile(join(dest, name, 'SKILL.md'), skill);
      continue;
    }

    // Remove a stale skill install from before this agent became a subagent.
    const staleSkillDir = join(dest, name);
    if (existsSync(staleSkillDir)) {
      rmSync(staleSkillDir, { recursive: true, force: true });
      console.log(`  ✎ removed stale skill ${display(staleSkillDir)}`);
    }

    const frontmatter = ['---', `name: ${name}`, `description: TripleS agent — ${name} (${persona})`];
    if (model) frontmatter.push(`model: ${model}`);
    if (tools) frontmatter.push(`tools: ${tools}`);
    frontmatter.push('---', '', stripAgentMetadataComments(content));
    writeFile(join(agentsDest, `${name}.md`), frontmatter.join('\n'));
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

  if (hasFile(GLOBAL_PATHS.claude, 'seoyeon', 'SKILL.md') || hasFile(GLOBAL_PATHS.claude, 'seoyeon.md'))
    found.push({ platform: 'claude', isGlobal: true });
  if (hasFile(projectDir, '.claude', 'skills', 'seoyeon', 'SKILL.md') || hasFile(projectDir, '.claude', 'skills', 'seoyeon.md'))
    found.push({ platform: 'claude', isGlobal: false });

  return found;
}
