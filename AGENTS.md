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

- **Understand before changing:** Inspect relevant files, existing conventions, dependencies, and configuration before implementing. Prefer focused changes over unnecessary rewrites.
- **Keep it simple:** Follow SOLID, DRY, and YAGNI pragmatically. Prefer clear, cohesive modules, low coupling, composition, and explicit data flow. Avoid speculative abstractions, unnecessary dependencies, and overengineering.
- **Organize by feature:** Keep related components, hooks, types, business logic, and tests together. Put genuinely reusable code in shared modules. Introduce folders and abstractions when complexity justifies them, not by default.
- **Prevent God components/modules:** Each component or module should have a clear primary responsibility. Extract UI sections, custom hooks, domain logic, or data-access modules when doing so improves cohesion, readability, reuse, or testability. Avoid both giant components and excessive fragmentation.
- **Choose patterns deliberately:** Use composition, Strategy, Adapter, state machines, dependency inversion, or other patterns only when they solve a real problem. Prefer straightforward functions over unnecessary frameworks, inheritance, wrappers, and interfaces.
- **React:** Follow the Rules of Hooks and preserve immutability. Derive values instead of duplicating state; use effects only for synchronization with external systems. Avoid unnecessary memoization, prop drilling, and global state. Keep rendering, business rules, and infrastructure separate where appropriate.
- **TypeScript:** Preserve strict typing. Prefer precise types, narrowing, and runtime validation at trust boundaries. Avoid `any`, unsafe assertions, non-null assertions, and suppressed diagnostics unless justified.
- **Testing:** Colocate unit/component tests with their implementation (`*.test.ts` / `*.test.tsx`). Use `tests/` for cross-feature integration, end-to-end tests, and shared test infrastructure. Test observable behavior, edge cases, failures, and regressions—not implementation details.
- **Quality and security:** Preserve accessibility, handle loading/error/empty states, validate untrusted input, and never expose secrets. Follow existing styling and toolchain conventions.
- **Validate changes:** Run relevant tests, `vp check`, and `vp build` as appropriate. Inspect the final diff. Report actual results honestly; never claim checks passed without running them.

**Decision rule:** Choose the simplest maintainable design that meets the requirements. Do not introduce complexity merely to follow a principle, pattern, folder structure, or arbitrary size limit.
