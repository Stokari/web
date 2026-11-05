#!/usr/bin/env node
const fs = require("fs");

// Conventional Commits regex
// Format: <type>(<optional-scope>): <description>
// Allowed types: feat, fix, chore, refactor, docs, style, test, perf, ci, build, revert
const COMMIT_PATTERN =
  /^(Merge .+|Revert ".+"|(fixup|squash)! .+|Initial commit|(feat|fix|chore|refactor|docs|style|test|perf|ci|build|revert)(\([a-zA-Z0-9_\-./ ]+\))?!?: .+)/;

const arg = process.argv[2];
let commitMsg = "";

if (arg && fs.existsSync(arg)) {
  const content = fs.readFileSync(arg, "utf-8");
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      commitMsg = trimmed;
      break;
    }
  }
} else if (arg) {
  commitMsg = arg.trim();
} else {
  try {
    const input = fs.readFileSync(0, "utf-8");
    const lines = input.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        commitMsg = trimmed;
        break;
      }
    }
  } catch {
    commitMsg = "";
  }
}

if (!commitMsg) {
  process.exit(0);
}

if (!COMMIT_PATTERN.test(commitMsg)) {
  console.error(`
[ERROR] Invalid commit message format:
  "${commitMsg}"

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
`);
  process.exit(1);
}
