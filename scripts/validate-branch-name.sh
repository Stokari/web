#!/usr/bin/env bash
set -euo pipefail

# Branch naming regex:
# Allows 'main' and 'dev' as exceptions.
# Otherwise requires: <type>/<short-description-in-kebab-case>
# Allowed types: feat, feature, fix, bugfix, chore, refactor, docs, test, style, perf, ci, hotfix
VALID_PATTERN='^(main|dev)$|^((feature|feat|fix|bugfix|chore|refactor|docs|test|style|perf|ci|hotfix)/[a-z0-9]+(-[a-z0-9]+)*)$'

validate_branch() {
    local branch="$1"

    # Allow empty branch name (e.g., detached HEAD in certain CI contexts)
    if [[ -z "$branch" ]]; then
        return 0
    fi

    # Strip remote prefix if present (e.g., origin/feat/xyz -> feat/xyz)
    branch="${branch#origin/}"

    if [[ ! "$branch" =~ $VALID_PATTERN ]]; then
        cat >&2 <<EOF

[ERROR] Invalid git branch name: '$branch'

Branch names must adhere to the project conventions (exceptions: 'main' and 'dev'):
  <type>/<short-description-in-kebab-case>

Allowed types:
  feat, feature  - New functionality or features
  fix, bugfix    - Bug fixes and patches
  chore          - Tooling, dependencies, or configuration changes
  refactor       - Code refactoring without changing behavior
  docs           - Documentation updates
  test           - Adding or updating tests
  style          - Code formatting / styling changes
  perf           - Performance improvements
  ci             - CI/CD workflow changes
  hotfix         - Urgent production patches

Examples:
  feat/user-auth
  feature/inventory-filters
  fix/sidebar-collapse-bug
  chore/update-dependencies
  docs/api-guide

Please rename your branch using:
  git branch -m <valid-branch-name>

EOF
        return 1
    fi
}

# 1. If an explicit branch argument is passed (e.g. from CI or manual execution):
if [[ $# -ge 1 ]]; then
    validate_branch "$1"
    exit 0
fi

# 2. If stdin is available (Git pre-push hook passes: <local_ref> <local_oid> <remote_ref> <remote_oid>):
has_stdin=false
if [ ! -t 0 ]; then
    while read -r local_ref local_oid remote_ref remote_oid; do
        has_stdin=true
        # Ignore deleted branches
        if [[ "$local_oid" =~ ^0+$ ]] || [[ "$local_ref" == "(delete)" ]]; then
            continue
        fi
        # Ignore tag pushes
        if [[ "$local_ref" == refs/tags/* ]]; then
            continue
        fi
        # Ignore detached HEAD pushes
        if [[ "$local_ref" == "(detached)" ]]; then
            continue
        fi

        branch="${local_ref#refs/heads/}"
        validate_branch "$branch"
    done
fi

# 3. If no stdin was provided, check the currently checked-out branch
if [ "$has_stdin" = false ]; then
    current_branch="$(git symbolic-ref --quiet --short HEAD 2>/dev/null || true)"
    if [[ -n "$current_branch" ]]; then
        validate_branch "$current_branch"
    fi
fi
