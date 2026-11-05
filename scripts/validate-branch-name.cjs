#!/usr/bin/env node
const { execSync } = require("child_process");
const fs = require("fs");

const VALID_PATTERN =
  /^(main|dev)$|^((feature|feat|fix|bugfix|chore|refactor|docs|test|style|perf|ci|hotfix)\/[a-z0-9]+(-[a-z0-9]+)*)$/;

function validateBranch(branch) {
  if (!branch) {
    return true;
  }

  // Strip remote prefix if present (e.g., origin/feat/xyz -> feat/xyz)
  const cleanBranch = branch.replace(/^origin\//, "").trim();

  if (!VALID_PATTERN.test(cleanBranch)) {
    console.error(`
[ERROR] Invalid git branch name: '${cleanBranch}'

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
`);
    return false;
  }
  return true;
}

function readStdin() {
  // If not a TTY, read all available input synchronously from fd 0
  // Git pre-push closes stdin immediately after sending refs, so readFileSync(0) is fast & non-blocking during git push
  try {
    if (!process.stdin.isTTY) {
      return fs.readFileSync(0, "utf-8");
    }
  } catch {
    // Ignore error if stdin not readable
  }
  return "";
}

function main() {
  const isHookMode = process.argv.includes("--hook");
  const nonFlagArgs = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));

  // 1. If explicit branch argument passed (e.g. from CI or manual command line):
  if (nonFlagArgs.length >= 1) {
    const branchToValidate = nonFlagArgs[0];
    if (!validateBranch(branchToValidate)) {
      process.exit(1);
    }
    process.exit(0);
  }

  // 2. If in hook mode (invoked by git pre-push):
  if (isHookMode) {
    const stdinData = readStdin();
    if (stdinData && stdinData.trim()) {
      const lines = stdinData.split(/\r?\n/).filter(Boolean);
      let checkedAny = false;

      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts.length < 4) continue;
        const [localRef, localOid] = parts;

        // Ignore deleted branches
        if (/^0+$/.test(localOid) || localRef === "(delete)") {
          continue;
        }
        // Ignore tag pushes
        if (localRef.startsWith("refs/tags/")) {
          continue;
        }
        // Ignore detached HEAD pushes
        if (localRef === "(detached)") {
          continue;
        }

        const branch = localRef.replace(/^refs\/heads\//, "");
        checkedAny = true;
        if (!validateBranch(branch)) {
          process.exit(1);
        }
      }

      if (checkedAny) {
        process.exit(0);
      }
    }
  }

  // 3. Fallback / Default: Check currently checked-out branch
  try {
    const currentBranch = execSync("git symbolic-ref --quiet --short HEAD", {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "ignore"],
    }).trim();

    if (currentBranch && !validateBranch(currentBranch)) {
      process.exit(1);
    }
  } catch {
    // Detached head or git error
  }

  process.exit(0);
}

main();
