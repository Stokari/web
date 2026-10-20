#!/usr/bin/env bash
set -euo pipefail

# Conventional Commits regex
# Format: <type>(<optional-scope>): <description>
# Allowed types: feat, fix, chore, refactor, docs, style, test, perf, ci, build, revert
COMMIT_PATTERN='^(Merge .+|Revert ".+"|(fixup|squash)! .+|Initial commit|(feat|fix|chore|refactor|docs|style|test|perf|ci|build|revert)(\([a-zA-Z0-9_\-\./ ]+\))?!?: .+)'

msg_file="${1:-}"

if [[ -n "$msg_file" && -f "$msg_file" ]]; then
    commit_msg=$(grep -v '^[[:space:]]*#' "$msg_file" | sed '/^[[:space:]]*$/d' | head -n 1 || true)
elif [[ -n "${1:-}" ]]; then
    commit_msg="$1"
else
    commit_msg=$(grep -v '^[[:space:]]*#' | sed '/^[[:space:]]*$/d' | head -n 1 || true)
fi

if [[ -z "$commit_msg" ]]; then
    exit 0
fi

if [[ ! "$commit_msg" =~ $COMMIT_PATTERN ]]; then
    cat >&2 <<EOF

[ERROR] Invalid commit message format:
  "$commit_msg"

Commit messages must follow the Conventional Commits specification:
  <type>(<optional scope>): <description>

Common types:
  feat     - A new feature or functionality
  fix      - A bug fix
  chore    - Tooling, dependencies, or configuration changes
  refactor - Code restructuring without behavior changes
  docs     - Documentation updates
  style    - Code style / formatting (no logic change)
  test     - Adding or updating tests
  perf     - Performance improvements
  ci       - CI/CD workflow updates
  build    - Build system changes
  revert   - Reverting a previous commit

Examples:
  feat(auth): implement jwt token authentication
  fix(inventory): prevent negative stock calculation
  chore(deps): update dependencies
  docs: add API documentation guide

EOF
    exit 1
fi
