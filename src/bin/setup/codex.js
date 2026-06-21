import { readFileSync, existsSync, readdirSync, rmSync } from 'fs';
import { join } from 'path';

const CODEX_AGENT_SKILL_METADATA = {
  seoyeon: {
    description: 'Coordinate the full TripleS delivery pipeline across PRD, design, RFC, task breakdown, development, test cases, and QA — with convergence loops and defect rework until human-approved delivery. Use when the user wants end-to-end orchestration, status, routing, cross-platform handoff, or delivery summaries.',
    shortDescription: 'Orchestrate PRD→QA with convergence loops',
    defaultPrompt: 'Use $seoyeon to orchestrate this feature from PRD through QA with human review gates and a QA rework loop.',
  },
  'chaewon-init-setup': {
    description: 'Explain, audit, and initialize local TripleS project setup for Claude, Codex, and other coding agents. Use when the user needs setup guidance, installed file explanations, root doc guidance, or update/reinstall help.',
    shortDescription: 'Initialize and audit local TripleS setup',
    defaultPrompt: 'Use $chaewon-init-setup to explain or audit the local TripleS project setup.',
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
    description: 'Implement Flutter tasks in Dart with Clean Architecture, flutter_bloc, freezed, go_router, Dio, isar_community, get_it/injectable, fpdart, Firebase Crashlytics, build_runner, and mockito from the approved TripleS task breakdown. Use when the user needs cross-platform mobile feature work.',
    shortDescription: 'Implement Clean Architecture Flutter features',
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
  const { KNOWLEDGE_DIR, writeFile } = ctx;
  const skillDir = join(skillsRoot, agent.slug);
  writeFile(join(skillDir, 'SKILL.md'), codexSkillFileContent(agent, ctx));
  writeFile(join(skillDir, 'agents', 'openai.yaml'), codexSkillUiYaml(agent, ctx));

  for (const relPath of agent.knowledgePaths) {
    const normalized = relPath.replace(/\.md$/, '');
    const refDir = join(KNOWLEDGE_DIR, normalized, 'references');
    const skillName = normalized.split('/').pop();
    const refFile = join(refDir, `${skillName}.md`);
    const sourcePath = existsSync(refFile) ? refFile : join(KNOWLEDGE_DIR, relPath);
    if (existsSync(sourcePath)) {
      writeFile(join(skillDir, 'references', 'knowledge', relPath), readFileSync(sourcePath, 'utf-8'));
    }
  }

  for (const relPath of agent.templatePaths) {
    const sourcePath = resolveBundledTemplatePath(KNOWLEDGE_DIR, relPath);
    if (existsSync(sourcePath)) {
      writeFile(join(skillDir, 'references', 'templates', relPath), readFileSync(sourcePath, 'utf-8'));
    }
  }
}

/** TOML literal multi-line string (no escaping); falls back to an escaped basic string if content contains the closing ''' sequence. */
function tomlMultilineLiteral(str) {
  if (str.includes("'''")) {
    const escaped = str.replace(/\\/g, '\\\\').replace(/"""/g, '\\"\\"\\"');
    return `"""\n${escaped}\n"""`;
  }
  return `'''\n${str}\n'''`;
}

/** Builds a Codex custom subagent TOML file — https://developers.openai.com/codex/subagents */
function codexAgentTomlContent(agent, helpers) {
  const { tomlEscape, stripAgentMetadataComments } = helpers;
  const meta = codexSkillMetadata(agent);
  const lines = [
    `name = "${tomlEscape(agent.slug)}"`,
    `description = "${tomlEscape(meta.description)}"`,
  ];
  if (agent.codexModel) lines.push(`model = "${tomlEscape(agent.codexModel)}"`);
  if (agent.codexTools && agent.codexTools.length) {
    const arr = agent.codexTools.map(t => `"${tomlEscape(t)}"`).join(', ');
    lines.push(`tools = [${arr}]`);
  }
  lines.push(`developer_instructions = ${tomlMultilineLiteral(stripAgentMetadataComments(agent.content))}`);
  return lines.join('\n') + '\n';
}

function resolveBundledTemplatePath(skillsRoot, relPath) {
  const templateSources = {
    'prd.md': join(skillsRoot, 'planning', 'prd-writing', 'references', 'prd-template.md'),
    'rfc.md': join(skillsRoot, 'planning', 'rfc-writing', 'references', 'rfc-template.md'),
    'task-breakdown.md': join(skillsRoot, 'planning', 'task-decomposition', 'references', 'task-breakdown-template.md'),
    'test-case.md': join(skillsRoot, 'quality', 'test-case-writing', 'references', 'test-case-template.md'),
    'design-spec.md': join(skillsRoot, 'design', 'design-system', 'references', 'design-spec-template.md'),
  };
  return templateSources[relPath] || '';
}

function parseKnowledgeFrontmatter(content, fallbackName) {
  const match = content.match(/^---\r?\n([\s\S]+?)\r?\n---/);
  const fm = match ? match[1] : '';
  return {
    name: (fm.match(/^name:\s*(.+)$/m) || [])[1]?.trim() || fallbackName,
    description: (fm.match(/^description:\s*(.+)$/m) || [])[1]?.trim() || 'TripleS knowledge reference',
  };
}

function titleFromSlug(slug) {
  return slug.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function codexKnowledgeSkillFileContent({ slug, title, description, group, fileName }, helpers) {
  const { yamlEscape } = helpers;
  return [
    '---',
    `name: "${yamlEscape(slug)}"`,
    `description: "${yamlEscape(`${description} Use when the user asks for TripleS ${group} guidance, review criteria, checklists, or domain conventions. Do not use as an implementation agent.`)}"`,
    '---',
    '',
    `# ${title}`,
    '',
    '## Purpose',
    `Use this skill as just-in-time reference material for TripleS ${group} work.`,
    '',
    '## Procedure',
    `1. Read \`references/${fileName}\` only when this domain guidance is needed.`,
    '2. Apply the checklist, conventions, anti-patterns, and scoring rules from that reference.',
    '3. Do not treat this knowledge skill as an implementation agent; route behavior through the owning TripleS agent when workflow execution is needed.',
    '',
    '## Reference',
    `- \`references/${fileName}\``,
    '',
  ].join('\n');
}

function writeCodexKnowledgeSkillBundles(skillsRoot, ctx) {
  const { KNOWLEDGE_DIR, KNOWLEDGE_GROUPS, writeFile } = ctx;
  for (const group of KNOWLEDGE_GROUPS) {
    const groupDir = join(KNOWLEDGE_DIR, group);
    if (!existsSync(groupDir)) continue;
    for (const skillDirName of readdirSync(groupDir, { withFileTypes: true })
      .filter(d => d.isDirectory() && existsSync(join(groupDir, d.name, 'SKILL.md')))
      .map(d => d.name)
      .sort()) {
      const skillMdPath = join(groupDir, skillDirName, 'SKILL.md');
      const skillContent = readFileSync(skillMdPath, 'utf-8');
      const metadata = parseKnowledgeFrontmatter(skillContent, skillDirName);
      const slug = `${group.replace(/\//g, '-')}-${metadata.name}`;
      const refName = `${metadata.name || skillDirName}.md`;
      const refPath = join(groupDir, skillDirName, 'references', refName);
      const referenceContent = existsSync(refPath) ? readFileSync(refPath, 'utf-8') : skillContent;
      const skillDir = join(skillsRoot, slug);
      writeFile(join(skillDir, 'SKILL.md'), codexKnowledgeSkillFileContent({
        slug,
        title: titleFromSlug(metadata.name),
        description: metadata.description,
        group,
        fileName: refName,
      }, ctx));
      writeFile(join(skillDir, 'references', refName), referenceContent);
    }
  }
}

function installCodexAgentsDoc(targetPath, ctx) {
  ctx.installManagedProjectDoc(targetPath, 'agents-template.md', {
    legacyMarker: 'TripleS Agent Orchestrator',
  });
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
  const { GLOBAL_PATHS, isGlobal, projectDir, allAgents, display, writeFile } = ctx;
  const codexRoot = isGlobal && !base
    ? GLOBAL_PATHS.codex
    : join(base || projectDir, '.codex');
  const skillsRoot = join(codexRoot, 'skills');
  const agentsRoot = join(codexRoot, 'agents');
  console.log(`\nInstalling OpenAI Codex skills → ${display(skillsRoot)}`);
  console.log(`Installing OpenAI Codex subagents → ${display(agentsRoot)}`);

  // SeoYeon stays a Skill — she is the $seoyeon orchestrator entry point.
  // Every other agent installs as a native Codex subagent (.codex/agents/{slug}.toml)
  // so it can be spawned explicitly with its own pinned model.
  for (const agent of allAgents()) {
    if (agent.slug === 'seoyeon') {
      writeCodexSkillBundle(skillsRoot, agent, ctx);
      continue;
    }

    // Remove a stale skill install from before this agent became a subagent.
    const staleSkillDir = join(skillsRoot, agent.slug);
    if (existsSync(staleSkillDir)) {
      rmSync(staleSkillDir, { recursive: true, force: true });
      console.log(`  ✎ removed stale skill ${display(staleSkillDir)}`);
    }

    writeFile(join(agentsRoot, `${agent.slug}.toml`), codexAgentTomlContent(agent, ctx));
  }

  writeCodexKnowledgeSkillBundles(skillsRoot, ctx);

  if (!isGlobal || base) {
    installCodexAgentsDoc(join(base || projectDir, 'AGENTS.md'), ctx);
  }
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
