<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

# Engineering Standards

## Precedence Rule

When a general engineering skill, repository rule, domain skill, and existing code conflict:

1. **Explicit SRS/Domain requirements and approved architecture decisions govern.**
2. If an instruction conflicts with technical correctness, data integrity, or security, the agent must **stop and explain the conflict** rather than silently choosing whichever instruction was read last.
3. Durable IndexedDB persistence and canonical sync contracts take precedence over temporary UI assumptions.

## Core Guidelines

- **Understand before changing:** Inspect relevant files, existing conventions, dependencies, and configuration before implementing. Prefer focused changes over unnecessary rewrites.
- **Keep it simple:** Follow SOLID, DRY, and YAGNI pragmatically. Prefer clear, cohesive modules, low coupling, composition, and explicit data flow. Avoid speculative abstractions, unnecessary dependencies, and overengineering.
- **Organize by feature:** Keep related components, hooks, types, business logic, and tests together. Put genuinely reusable code in shared modules.
- **State ownership:** Partition state according to source of truth: Server State, Persistent Offline Data (IndexedDB), URL Search Params, and Local UI State.
- **React & TypeScript:** Follow the Rules of Hooks and preserve immutability. Strict typing with boundary validation for untrusted data. Never use `any` or loose `@ts-ignore` suppressions.
- **Testing:** Colocate unit/component tests with their implementation (`*.test.ts` / `*.test.tsx`). Test observable behavior and failure edge cases.
- **Validate changes:** Run `vp test`, `vp check`, and `vp build` before finalizing changes. Report actual results honestly.

## Custom Domain Skills

- Consult [.agents/skills/react-typescript-application-engineering/SKILL.md](.agents/skills/react-typescript-application-engineering/SKILL.md) for React 19 architecture, TanStack Query, schema boundary validation, and context-sensitive UI states.
- Consult [.agents/skills/stokari-offline-sync/SKILL.md](.agents/skills/stokari-offline-sync/SKILL.md) for Dexie/IndexedDB local storage, atomic outbox queue, client operation IDs, canonical sync contracts, and owner review status handling.
