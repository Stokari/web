# Stokari Web

Modern, high-performance web frontend for the **Stokari** inventory management system. Built with **React 19**, **TypeScript**, and **Vite+** (`vp`) with native React Compiler support.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Available Scripts & Commands](#available-scripts--commands)
- [Git & Contribution Workflow](#git--contribution-workflow)
  - [Branch Strategy](#branch-strategy)
  - [Branch Naming Conventions](#branch-naming-conventions)
  - [Commit Message Conventions](#commit-message-conventions)
  - [Step-by-Step Workflow (Pull, Develop, Push, PR)](#step-by-step-workflow-pull-develop-push-pr)
- [Code Quality & Testing](#code-quality--testing)
  - [Linting and Formatting](#linting-and-formatting)
  - [Running Tests](#running-tests)
  - [Pre-commit Hooks](#pre-commit-hooks)
- [CI/CD Pipeline](#cicd-pipeline)
- [Project Structure](#project-structure)

---

## Tech Stack

| Technology          | Purpose                                                                     |
| :------------------ | :-------------------------------------------------------------------------- |
| **React 19**        | Modern UI library with concurrent features and React Compiler               |
| **TypeScript**      | Strict type safety across the entire application                            |
| **Vite+ (`vp`)**    | Unified toolchain for development, bundler (Rolldown/Vite), and task runner |
| **Vitest & RTL**    | Fast unit and component testing with `@testing-library/react`               |
| **Oxlint & ESLint** | Blazing-fast static analysis, React rules, and code quality checks          |
| **pnpm**            | Fast, disk-space-efficient package manager                                  |

---

## Prerequisites

Before setting up the project, make sure you have the following installed on your machine:

1. **Node.js**: `v24+` recommended (see `.node-version`)
   - You can check your version with `node -v`
   - Use `nvm` or `fnm` to switch versions: `nvm use` or `fnm use`
2. **pnpm**: `v12+`
   ```bash
   corepack enable
   corepack prepare pnpm@latest --activate
   # Or install via npm:
   npm install -g pnpm
   ```
3. **Vite+ CLI (`vp`)** (Recommended):
   ```bash
   npm install -g vite-plus
   ```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone git@github.com:Stokari/web.git
cd web
```

### 2. Install Dependencies

Using Vite+ (recommended) or pnpm:

```bash
vp install
# or
pnpm install
```

### 3. Start the Development Server

```bash
vp dev
# or
pnpm run dev
```

The application will start with Hot Module Replacement (HMR) enabled:

- **Local URL**: `http://localhost:5173/`

---

## Available Scripts & Commands

This project uses **Vite+** (`vp`) as the primary toolchain. You can run commands directly using `vp <command>` or via standard `pnpm run <script>`.

| Command              | Alternative                | Description                                       |
| :------------------- | :------------------------- | :------------------------------------------------ |
| `vp dev`             | `pnpm run dev`             | Starts the local development server with HMR      |
| `vp build`           | `pnpm run build`           | Type-checks (`tsc -b`) and builds for production  |
| `vp preview`         | `pnpm run preview`         | Locally previews the production build in `./dist` |
| `vp check`           | `pnpm exec vp check`       | Runs formatters, linters, and type checkers       |
| `vp check --fix`     | `pnpm exec vp check --fix` | Automatically fixes lint and formatting issues    |
| `vp test`            | `pnpm exec vitest`         | Runs the Vitest test suite                        |
| `vp test --coverage` | -                          | Runs tests and generates code coverage report     |
| `vp lint .`          | `pnpm run lint`            | Runs the Oxlint / ESLint linter                   |
| `pnpm exec eslint .` | -                          | Runs ESLint and React Compiler checks             |

---

## Git & Contribution Workflow

To keep our codebase clean, stable, and easy to collaborate on, please adhere to our branching, commit, and pull-request workflow.

### Branch Strategy

- **`main`**: Production branch. Code here is tested, stable, and deployment-ready. **Direct pushes are forbidden.**
- **`dev`**: Active integration branch. All feature branches, bugfixes, and chores are branched from and merged back into `dev`.
- **Feature/Fix branches**: Temporary branches created for isolated work, merged via Pull Requests.

```
       main (Production)
        ▲
        │ (Release PR)
       dev (Development integration)
      ▲   ▲
     /     \
feature/  fix/
```

### Branch Naming Conventions

Branches should follow the pattern: `<type>/<short-description-in-kebab-case>`

| Prefix                | When to use                                     | Example                                                  |
| :-------------------- | :---------------------------------------------- | :------------------------------------------------------- |
| `feature/` or `feat/` | New functionality or user-facing feature        | `feature/inventory-filters`, `feat/auth-login`           |
| `fix/` or `bugfix/`   | Bug fixes and patches                           | `fix/sidebar-collapse-bug`, `fix/login-input-validation` |
| `chore/`              | Tooling, dependencies, or configuration changes | `chore/update-vite-config`, `chore/bump-deps`            |
| `refactor/`           | Code refactoring without changing behavior      | `refactor/use-inventory-hook`, `refactor/state-cleanup`  |
| `docs/`               | Documentation updates                           | `docs/update-readme`, `docs/api-guide`                   |
| `test/`               | Adding or updating tests                        | `test/add-table-unit-tests`                              |

> [!TIP]
> Keep branch names short, descriptive, lowercase, and hyphen-separated (e.g., `feature/user-profile-modal`).

### Commit Message Conventions

We follow the **Conventional Commits** specification:

```
<type>(<optional scope>): <description>

[optional body]

[optional footer(s)]
```

**Common types:**

- `feat`: A new feature (e.g., `feat(auth): add remember-me checkbox`)
- `fix`: A bug fix (e.g., `fix(table): prevent infinite re-render on sort`)
- `chore`: Maintenance tasks (e.g., `chore: update dependencies`)
- `refactor`: Code restructuring without bug fixes or new features
- `docs`: Documentation changes only
- `style`: Changes that do not affect the meaning of the code (formatting, white-space)
- `test`: Adding or correcting tests

---

### Step-by-Step Workflow (Pull, Develop, Push, PR)

#### Step 1: Sync with the latest `dev` branch

Always start by pulling the latest changes from `dev`:

```bash
# Switch to dev branch
git checkout dev

# Pull the latest changes from remote
git pull origin dev
```

#### Step 2: Create a new branch

Create your working branch from the updated `dev` branch:

```bash
git checkout -b feature/your-feature-name
```

#### Step 3: Develop & test your changes

Make your edits in `src/`. Start the dev server and test your work:

```bash
vp dev
```

Before committing, run tests and formatting checks:

```bash
# Run tests
vp test

# Check linting and formatting
vp check
```

#### Step 4: Stage and commit your changes

Review your modified files and write clear commit messages:

```bash
# Check modified files
git status

# Inspect changes
git diff

# Stage specific files (or all changes)
git add src/components/YourComponent.tsx

# Commit using conventional format
git commit -m "feat(inventory): add search input component"
```

#### Step 5: Keep your branch up to date with `dev`

Before pushing, re-sync with `origin/dev` to prevent merge conflicts:

```bash
# Fetch latest remote changes
git fetch origin

# Rebase your branch onto the latest dev
git rebase origin/dev
```

_(If there are merge conflicts, resolve them, run `git add <resolved-files>`, and continue with `git rebase --continue`.)_

#### Step 6: Push your branch to GitHub

Push your local branch to the remote repository:

```bash
git push -u origin feature/your-feature-name
```

If you rebased after a previous push to the same branch:

```bash
git push --force-with-lease origin feature/your-feature-name
```

#### Step 7: Open a Pull Request (PR)

1. Navigate to [Stokari/web on GitHub](https://github.com/Stokari/web).
2. Click **Compare & pull request**.
3. **Important**: Set the **base branch** to `dev` (not `main`).
4. Provide a clear title and description explaining:
   - What changes were made
   - Why they were made
   - Any manual testing performed or screenshots (for UI changes)
5. Wait for automated CI checks to pass and request reviews from team members.

---

## Code Quality & Testing

### Linting and Formatting

This project uses Vite+'s integrated Oxlint/Oxfmt alongside ESLint:

- **Run all checks (lint + format + types):**
  ```bash
  vp check
  ```
- **Auto-fix code style & formatting:**
  ```bash
  vp check --fix
  ```
- **ESLint & React Compiler validation:**
  ```bash
  pnpm exec eslint .
  ```

### Running Tests

Tests are powered by **Vitest** and **React Testing Library** with a JSDOM environment:

- **Run all tests once:**
  ```bash
  vp test
  ```
- **Run tests in watch mode during development:**
  ```bash
  vp test --watch
  ```
- **Generate coverage report:**
  ```bash
  vp test --coverage
  ```

### Pre-commit Hooks

Vite+ is configured in `vite.config.ts` to automatically format and check staged files on commit:

```ts
staged: {
  "*": "vp check --fix",
}
```

This ensures unformatted or broken code does not get committed accidentally.

---

## CI/CD Pipeline

Every push and Pull Request triggers the GitHub Actions workflow (`.github/workflows/ci.yml`), which executes:

1. **`vp check`**: Type checks, code quality, and formatting.
2. **`pnpm exec eslint .`**: ESLint rules and React Compiler validations.
3. **`vp test`**: Vitest unit/component test suite.
4. **`pnpm run build`**: Production build check (`tsc -b && vp build`).

> [!NOTE]
> All CI checks must pass before a Pull Request can be merged into `dev` or `main`.

---

## Project Structure

```text
web/
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions continuous integration workflow
├── public/                 # Static public assets
├── src/
│   ├── assets/             # Images, SVGs, and styling assets
│   ├── App.css             # Component-level styles
│   ├── App.test.tsx        # Component test suite
│   ├── App.tsx             # Root application component
│   ├── index.css           # Global stylesheet and CSS variables
│   └── main.tsx            # Application entrypoint
├── .node-version           # Recommended Node.js version (v24)
├── AGENTS.md               # Tooling and engineering guidelines for AI & contributors
├── eslint.config.js        # ESLint configuration (React hooks, React Compiler)
├── index.html              # HTML shell
├── package.json            # Project dependencies and npm scripts
├── pnpm-lock.yaml          # Pnpm lockfile
├── tsconfig.json           # Root TypeScript configuration
├── tsconfig.app.json       # App-specific TypeScript configuration
├── tsconfig.node.json      # Node-specific TypeScript configuration
└── vite.config.ts          # Vite+, Vitest, Rolldown, and Oxlint configuration
```

---

## License

This project is licensed under the terms of the repository's [LICENSE](LICENSE) file.
