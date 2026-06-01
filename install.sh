#!/usr/bin/env bash
# TripleS Agentic — Installer
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/pauplayground007/triples-agentic/main/install.sh | bash
#   curl -fsSL https://raw.githubusercontent.com/pauplayground007/triples-agentic/main/install.sh | bash -s -- claude
#   curl -fsSL https://raw.githubusercontent.com/pauplayground007/triples-agentic/main/install.sh | bash -s -- claude --global
#   curl -fsSL https://raw.githubusercontent.com/pauplayground007/triples-agentic/main/install.sh | bash -s -- all

set -euo pipefail

# ── Terminal colours (disabled if no TTY or TERM is dumb) ────────────────────
if [ -t 1 ] && [ "${TERM:-}" != "dumb" ]; then
  RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
  CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'
else
  RED=''; GREEN=''; YELLOW=''; CYAN=''; BOLD=''; NC=''
fi

MIN_NODE=18

# ── Helpers ──────────────────────────────────────────────────────────────────
err()     { printf "${RED}✖ %s${NC}\n" "$*" >&2; exit 1; }
warn()    { printf "${YELLOW}⚠ %s${NC}\n" "$*"; }
info()    { printf "${CYAN}→${NC} %s\n" "$*"; }
success() { printf "${GREEN}✔${NC} %s\n" "$*"; }

# ── Banner ────────────────────────────────────────────────────────────────────
banner() {
  printf "\n${BOLD}╔══════════════════════════════════════════════════╗${NC}\n"
  printf "${BOLD}║  TripleS Agentic — Install                       ║${NC}\n"
  printf "${BOLD}║  Software Engineering Agent Orchestrator         ║${NC}\n"
  printf "${BOLD}╚══════════════════════════════════════════════════╝${NC}\n\n"
}

# ── Prerequisite checks ───────────────────────────────────────────────────────
check_node() {
  if ! command -v node &>/dev/null; then
    err "Node.js is required but not installed.

  Install it from : https://nodejs.org
  macOS (Homebrew): brew install node
  Linux (nvm)     : curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash"
  fi

  local major
  major=$(node -e "process.stdout.write(String(process.versions.node.split('.')[0]))")
  if [ "$major" -lt "$MIN_NODE" ]; then
    err "Node.js v${MIN_NODE}+ required (found v${major}).
  Update from: https://nodejs.org"
  fi

  success "Node.js $(node --version)"
}

check_npx() {
  if ! command -v npx &>/dev/null; then
    err "npx not found. Update npm:  npm install -g npm@latest"
  fi
  success "npx $(npx --version)"
}

check_platform() {
  case "$(uname -s)" in
    Darwin|Linux) ;;
    MINGW*|MSYS*|CYGWIN*)
      warn "Windows detected — running via Git Bash / MSYS2."
      warn "For full support use WSL2 or run:  npx triples-agentic"
      ;;
    *)
      warn "Unknown platform — proceeding anyway."
      ;;
  esac
}

# ── Main ──────────────────────────────────────────────────────────────────────
main() {
  banner
  check_platform
  check_node
  check_npx

  printf "\n"
  info "Launching triples-agentic setup…"
  printf "\n"

  # Forward every argument straight to the npm package:
  #   (no args)          → interactive wizard
  #   claude             → Claude Code, project-level
  #   claude --global    → Claude Code, global
  #   cursor --global    → Cursor AI, global
  #   all                → all platforms, project-level
  npx --yes triples-agentic@latest "$@"
}

main "$@"
