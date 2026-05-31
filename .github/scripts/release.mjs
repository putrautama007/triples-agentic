#!/usr/bin/env node
/**
 * Release script — runs inside the CI workflow on every push to main.
 *
 * 1. Reads commits since the last tag
 * 2. Determines semver bump type from conventional commit prefixes
 *    feat: → minor | fix/chore/… → patch | BREAKING CHANGE / !: → major
 * 3. Calculates the next version
 * 4. Prepends a new entry to CHANGELOG.md
 * 5. Updates package.json version field
 * 6. Writes .release-notes.md for the GitHub Release body
 * 7. Outputs `tag` and `skip` to GITHUB_OUTPUT
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, appendFileSync } from 'fs';

// ─── GitHub Actions output ────────────────────────────────────────────────────

function setOutput(key, value) {
  appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`);
}

// ─── Git helpers ──────────────────────────────────────────────────────────────

function git(cmd) {
  return execSync(`git ${cmd}`, { encoding: 'utf-8' }).trim();
}

// ─── Get latest tag ───────────────────────────────────────────────────────────

let latestTag;
try {
  latestTag = git('describe --tags --abbrev=0');
} catch {
  latestTag = 'v0.0.0';
}
console.log(`Latest tag: ${latestTag}`);

// ─── Get commits since last tag ───────────────────────────────────────────────

const range = latestTag === 'v0.0.0' ? 'HEAD' : `${latestTag}..HEAD`;
let rawLog = '';
try {
  rawLog = git(`log ${range} --pretty=format:"%H||%s||%b<END>"`);
} catch {
  rawLog = '';
}

const commits = rawLog
  .split('<END>')
  .map(s => s.trim())
  .filter(Boolean)
  .map(block => {
    const [hash = '', subject = '', ...bodyParts] = block.split('||');
    return {
      hash: hash.trim().slice(0, 7),
      subject: subject.trim(),
      body: bodyParts.join('').trim(),
    };
  });

if (commits.length === 0) {
  console.log('No commits since last tag — skipping release.');
  setOutput('skip', 'true');
  process.exit(0);
}

// ─── Determine bump type ──────────────────────────────────────────────────────

let bump = 'patch';
for (const { subject, body } of commits) {
  if (/BREAKING CHANGE/.test(body) || /^[a-z]+(\(.+\))?!:/.test(subject)) {
    bump = 'major';
    break;
  }
  if (/^feat(\(.+\))?:/.test(subject) && bump !== 'major') {
    bump = 'minor';
  }
}
console.log(`Bump type: ${bump}`);

// ─── Calculate next version ───────────────────────────────────────────────────

const [maj, min, pat] = latestTag.replace('v', '').split('.').map(Number);
let [major, minor, patch] = [maj, min, pat];
if (bump === 'major') { major += 1; minor = 0; patch = 0; }
else if (bump === 'minor') { minor += 1; patch = 0; }
else { patch += 1; }

const newTag = `v${major}.${minor}.${patch}`;
const newVersion = `${major}.${minor}.${patch}`;
console.log(`${latestTag} → ${newTag}`);

// ─── Categorise commits ───────────────────────────────────────────────────────

const isBreaking = c => /BREAKING CHANGE/.test(c.body) || /^[a-z]+(\(.+\))?!:/.test(c.subject);
const isFeat     = c => /^feat(\(.+\))?:/.test(c.subject);
const isFix      = c => /^fix(\(.+\))?:/.test(c.subject);
const isOther    = c => /^(refactor|perf|chore|docs|style|ci|build|test)(\(.+\))?:/.test(c.subject);

const breaking = commits.filter(isBreaking);
const added    = commits.filter(c => isFeat(c) && !isBreaking(c));
const fixed    = commits.filter(c => isFix(c)  && !isBreaking(c));
const changed  = commits.filter(c => isOther(c) && !isBreaking(c) && !isFeat(c) && !isFix(c));

function fmt(c) {
  const msg = c.subject.replace(/^[a-z]+(\(.+\))?!?:\s*/, '');
  return `- ${msg} (\`${c.hash}\`)`;
}

// ─── Build CHANGELOG entry ────────────────────────────────────────────────────

const date = new Date().toISOString().slice(0, 10);
const repoUrl = 'https://github.com/pauplayground007/triples-agentic';

const sections = [];
if (breaking.length) sections.push(`### Breaking Changes\n${breaking.map(fmt).join('\n')}`);
if (added.length)    sections.push(`### Added\n${added.map(fmt).join('\n')}`);
if (fixed.length)    sections.push(`### Fixed\n${fixed.map(fmt).join('\n')}`);
if (changed.length)  sections.push(`### Changed\n${changed.map(fmt).join('\n')}`);

const compareUrl = latestTag === 'v0.0.0'
  ? `${repoUrl}/releases/tag/${newTag}`
  : `${repoUrl}/compare/${latestTag}...${newTag}`;

const entry = [
  `## [${newVersion}] — ${date}`,
  '',
  sections.join('\n\n'),
  '',
  `[${newVersion}]: ${compareUrl}`,
  '',
].join('\n');

// ─── Prepend entry into CHANGELOG.md (after the --- divider) ─────────────────

const SEPARATOR = '---\n\n';
let changelog = readFileSync('CHANGELOG.md', 'utf-8');
const sepIdx = changelog.indexOf(SEPARATOR);

if (sepIdx === -1) {
  // No divider found — append at the end
  changelog = changelog.trimEnd() + '\n\n' + entry;
} else {
  const before = changelog.slice(0, sepIdx + SEPARATOR.length);
  const after  = changelog.slice(sepIdx + SEPARATOR.length);
  changelog = before + entry + '\n' + after;
}

writeFileSync('CHANGELOG.md', changelog);
console.log('CHANGELOG.md updated');

// ─── Update package.json version ─────────────────────────────────────────────

const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));
pkg.version = newVersion;
writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
console.log(`package.json version → ${newVersion}`);

// ─── Write release notes for GitHub Release body ─────────────────────────────

const releaseNotes = [
  `## What's Changed`,
  '',
  sections.join('\n\n'),
  '',
  `**Full Changelog**: ${compareUrl}`,
].join('\n');

writeFileSync('.release-notes.md', releaseNotes);

// ─── Outputs ──────────────────────────────────────────────────────────────────

setOutput('tag', newTag);
setOutput('skip', 'false');
console.log(`Release ${newTag} ready.`);
