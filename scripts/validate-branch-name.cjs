#!/usr/bin/env node
const { execSync } = require("child_process");

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
  if (process.stdin.isTTY) {
    return Promise.resolve("");
  }

  return new Promise((resolve) => {
    let buffer = "";
    let timer = null;

    const cleanup = () => {
      if (timer) clearTimeout(timer);
      process.stdin.removeListener("data", onData);
      process.stdin.removeListener("end", onEnd);
      process.stdin.removeListener("error", onError);
      process.stdin.pause();
    };

    const onData = (chunk) => {
      buffer += chunk;
    };

    const onEnd = () => {
      cleanup();
      resolve(buffer);
    };

    const onError = () => {
      cleanup();
      resolve(buffer);
    };

    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", onData);
    process.stdin.on("end", onEnd);
    process.stdin.on("error", onError);
    process.stdin.resume();

    // If no EOF or data arrives within 200ms, resolve what we have (or empty)
    timer = setTimeout(() => {
      cleanup();
      resolve(buffer);
    }, 200);
  });
}

async function main() {
  const isHookMode = process.argv.includes("--hook");

  // 1. If in hook mode (invoked by git pre-push):
  // NOTE: Git passes <remote_name> and <remote_url> as $1, $2. These are NOT branch names!
  // The branches being pushed are sent on stdin, or we inspect the checked-out branch.
  if (isHookMode) {
    const stdinData = await readStdin();
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

    // If stdin had no branches or was empty, check currently checked-out branch:
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

  // 2. If NOT in hook mode, check explicit branch argument (e.g. from CI or manual execution):
  const nonFlagArgs = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
  if (nonFlagArgs.length >= 1) {
    const branchToValidate = nonFlagArgs[0];
    if (!validateBranch(branchToValidate)) {
      process.exit(1);
    }
    process.exit(0);
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

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
