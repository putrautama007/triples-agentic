import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const CODEX_AGENT_SKILL_METADATA = {
  seoyeon: {
    description: 'Coordinate the full TripleS delivery pipeline across PRD, RFC, task breakdown, development, test cases, and QA. Use when the user wants end-to-end orchestration, status, routing, or delivery summaries.',
    shortDescription: 'Orchestrate the full TripleS delivery flow',
    defaultPrompt: 'Use $seoyeon to orchestrate this feature from PRD through QA.',
  },
  'jiwoo-prd': {
    description: 'Create, review, and refine implementation-ready product requirements documents for TripleS workflows. Use when the user needs a PRD with explicit quality gates and product clarifications.',
    shortDescription: 'Create and review implementation-ready PRDs',
    defaultPrompt: 'Use $jiwoo-prd to draft or revise the PRD for this feature.',
  },
  'yooyeon-rfc': {
    description: 'Create, review, and refine implementation-ready technical RFCs that trace back to an approved PRD. Use when the user needs architecture decisions, API contracts, risks, or rollout plans documented.',
    shortDescription: 'Create and review implementation-ready RFCs',
    defaultPrompt: 'Use $yooyeon-rfc to turn this PRD into a technical RFC.',
  },
  'nakyoung-tasks': {
    description: 'Break approved PRDs and RFCs into estimated, dependency-aware engineering tasks. Use when the user needs a delivery plan, story points, task sequencing, or platform assignments.',
    shortDescription: 'Break work into ready-to-build tasks',
    defaultPrompt: 'Use $nakyoung-tasks to create the task breakdown for this project.',
  },
  'yubin-frontend': {
    description: 'Implement frontend web tasks from the approved TripleS task breakdown with strong accessibility, performance, and testing practices. Use when the user needs web UI implementation work.',
    shortDescription: 'Implement web frontend tasks from breakdown',
    defaultPrompt: 'Use $yubin-frontend to implement the assigned web frontend task.',
  },
  'kaede-backend': {
    description: 'Implement backend APIs, services, and data access layers from the approved TripleS task breakdown. Use when the user needs backend implementation with strong reliability, security, and testing practices.',
    shortDescription: 'Implement backend APIs and services',
    defaultPrompt: 'Use $kaede-backend to implement the assigned backend task.',
  },
  'yeonji-android': {
    description: 'Implement Android tasks in Kotlin and Jetpack Compose from the approved TripleS task breakdown. Use when the user needs Android-native feature work.',
    shortDescription: 'Implement Android features in Kotlin',
    defaultPrompt: 'Use $yeonji-android to implement the assigned Android task.',
  },
  'sohyun-ios': {
    description: 'Implement iOS tasks in Swift and SwiftUI from the approved TripleS task breakdown. Use when the user needs iOS-native feature work with Apple platform conventions.',
    shortDescription: 'Implement iOS features in SwiftUI',
    defaultPrompt: 'Use $sohyun-ios to implement the assigned iOS task.',
  },
  'kotone-flutter': {
    description: 'Implement Flutter tasks in Dart with Riverpod from the approved TripleS task breakdown. Use when the user needs cross-platform mobile feature work.',
    shortDescription: 'Implement Flutter features with Riverpod',
    defaultPrompt: 'Use $kotone-flutter to implement the assigned Flutter task.',
  },
  'lynn-testcase': {
    description: 'Create, review, and refine implementation-ready QA test suites from approved PRDs and RFCs. Use when the user needs structured test cases, coverage gaps, or automation candidates documented.',
    shortDescription: 'Create and review QA test suites',
    defaultPrompt: 'Use $lynn-testcase to create the test case suite for this project.',
  },
  'shion-qa': {
    description: 'Execute approved test suites, file defects, and produce a go/no-go QA recommendation. Use when the user needs test execution, bug reports, or release-readiness assessment.',
    shortDescription: 'Execute tests and issue go/no-go QA reports',
    defaultPrompt: 'Use $shion-qa to execute QA and produce a release recommendation.',
  },
};

function codexSkillMetadata(agent) {
  return CODEX_AGENT_SKILL_METADATA[agent.slug] || {
    description: `Use when the user wants help from the TripleS ${agent.displayName} workflow.`,
    shortDescription: `Use the ${agent.displayName} TripleS workflow`,
    defaultPrompt: `Use $${agent.slug} for this TripleS workflow.`,
  };
}

function codexSkillFileContent(agent, helpers) {
  const { stripAgentMetadataComments, yamlEscape } = helpers;
  const meta = codexSkillMetadata(agent);
  const references = [];

  if (agent.knowledgePaths.length) {
    references.push('- Bundled knowledge references live under `references/knowledge/`.');
  }

  if (agent.templatePaths.length) {
    references.push('- Bundled templates live under `references/templates/`.');
  }

  if (references.length) {
    references.push('- When the original TripleS instructions mention `knowledge/...` or `templates/...`, resolve them to those bundled copies inside this skill directory.');
  }

  const preface = references.length
    ? ['## Bundled References', '', ...references, ''].join('\n')
    : '';

  return [
    '---',
    `name: "${yamlEscape(agent.slug)}"`,
    `description: "${yamlEscape(meta.description)}"`,
    '---',
    '',
    `# ${agent.displayName}`,
    '',
    preface,
    stripAgentMetadataComments(agent.content),
    '',
  ].join('\n');
}

function codexSkillUiYaml(agent, helpers) {
  const { yamlEscape } = helpers;
  const meta = codexSkillMetadata(agent);
  return [
    'interface:',
    `  display_name: "${yamlEscape(agent.displayName)}"`,
    `  short_description: "${yamlEscape(meta.shortDescription)}"`,
    `  default_prompt: "${yamlEscape(meta.defaultPrompt)}"`,
    '',
    'policy:',
    '  allow_implicit_invocation: true',
    '',
  ].join('\n');
}

function writeCodexSkillBundle(skillsRoot, agent, ctx) {
  const { ROOT, KNOWLEDGE_DIR, writeFile } = ctx;
  const skillDir = join(skillsRoot, agent.slug);
  writeFile(join(skillDir, 'SKILL.md'), codexSkillFileContent(agent, ctx));
  writeFile(join(skillDir, 'agents', 'openai.yaml'), codexSkillUiYaml(agent, ctx));

  for (const relPath of agent.knowledgePaths) {
    const sourcePath = join(KNOWLEDGE_DIR, relPath);
    if (existsSync(sourcePath)) {
      writeFile(join(skillDir, 'references', 'knowledge', relPath), readFileSync(sourcePath, 'utf-8'));
    }
  }

  for (const relPath of agent.templatePaths) {
    const sourcePath = join(ROOT, 'templates', relPath);
    if (existsSync(sourcePath)) {
      writeFile(join(skillDir, 'references', 'templates', relPath), readFileSync(sourcePath, 'utf-8'));
    }
  }
}

function maybeRewriteLegacyCodexAgentsDoc(targetPath, skillsRoot, ctx) {
  const { display, writeFile } = ctx;
  if (!existsSync(targetPath)) return;

  let existing = '';
  try { existing = readFileSync(targetPath, 'utf-8'); } catch { return; }
  if (!existing.includes('TripleS Agent Orchestrator')) return;

  const compatDoc = [
    '# TripleS Agentic for Codex',
    '',
    'TripleS workflows are installed as Codex skills, not as a generated agent catalog in this file.',
    '',
    `- Skills root: \`${display(skillsRoot)}\``,
    '- In Codex, use `/skills` to browse them or mention a skill directly such as `$seoyeon` or `$jiwoo-prd`.',
    '- The actual workflow instructions now live in each skill bundle under `SKILL.md`.',
    '',
  ].join('\n');

  writeFile(targetPath, compatDoc);
}

function installCodexSettings(base, ctx) {
  const { GLOBAL_PATHS, isGlobal, projectDir, loadCodexHooks, tomlEscape, writeFile } = ctx;
  const hookEntries = loadCodexHooks().filter(entry => entry.event === 'PreToolUse');
  if (hookEntries.length === 0) return;

  const configPath = isGlobal && !base
    ? join(GLOBAL_PATHS.codex, 'config.toml')
    : join(base || projectDir, '.codex', 'config.toml');
  let existing = existsSync(configPath) ? readFileSync(configPath, 'utf-8') : '';

  existing = existing.replace(/\n?# triples-agentic hooks[\s\S]*?# end triples-agentic hooks\n?/g, '');

  let block = '\n# triples-agentic hooks\n';
  for (const entry of hookEntries) {
    block += '\n[[hooks.PreToolUse]]\n';
    if (entry.matcher) block += `matcher = "${tomlEscape(entry.matcher)}"\n`;
    for (const hook of (entry.hooks || [])) {
      block += '\n[[hooks.PreToolUse.hooks]]\n';
      block += 'type = "command"\n';
      block += `command = "${tomlEscape(hook.command)}"\n`;
      if (hook.statusMessage) block += `statusMessage = "${tomlEscape(hook.statusMessage)}"\n`;
    }
  }
  block += '\n# end triples-agentic hooks\n';

  writeFile(configPath, existing.trimEnd() + block);
}

export function installCodex(base, ctx) {
  const { GLOBAL_PATHS, isGlobal, projectDir, allAgents, display } = ctx;
  const codexRoot = isGlobal && !base
    ? GLOBAL_PATHS.codex
    : join(base || projectDir, '.codex');
  const skillsRoot = join(codexRoot, 'skills');
  console.log(`\nInstalling OpenAI Codex skills → ${display(skillsRoot)}`);

  for (const agent of allAgents()) {
    writeCodexSkillBundle(skillsRoot, agent, ctx);
  }

  const legacyAgentsPath = isGlobal && !base
    ? join(GLOBAL_PATHS.codex, 'AGENTS.md')
    : join(base || projectDir, 'AGENTS.md');
  maybeRewriteLegacyCodexAgentsDoc(legacyAgentsPath, skillsRoot, ctx);
  installCodexSettings(base, ctx);
}

export function detectCodexInstallations(ctx) {
  const { GLOBAL_PATHS, projectDir } = ctx;
  const hasMarker = (file) => {
    try { return readFileSync(file, 'utf-8').includes('TripleS Agent Orchestrator'); } catch { return false; }
  };

  const found = [];
  const codexGlobal = join(GLOBAL_PATHS.codex, 'AGENTS.md');
  const codexGlobalSkills = join(GLOBAL_PATHS.codex, 'skills', 'seoyeon', 'SKILL.md');
  if (existsSync(codexGlobalSkills) || (existsSync(codexGlobal) && hasMarker(codexGlobal))) {
    found.push({ platform: 'codex', isGlobal: true });
  }

  const codexProject = join(projectDir, 'AGENTS.md');
  const codexProjectSkills = join(projectDir, '.codex', 'skills', 'seoyeon', 'SKILL.md');
  if (existsSync(codexProjectSkills) || (existsSync(codexProject) && hasMarker(codexProject))) {
    found.push({ platform: 'codex', isGlobal: false });
  }

  return found;
}
