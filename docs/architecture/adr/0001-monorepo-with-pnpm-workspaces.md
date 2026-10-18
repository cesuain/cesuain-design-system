# ADR 0001: pnpm workspace with tokens, ui and docs packages

- **Status:** Accepted
- **Date:** 2026-10-18

## Context

The system has three audiences with different needs. Token consumers may not use React. Component consumers need tokens plus components. Maintainers need documentation and tests that never ship to consumers.

## Decision

Use one pnpm workspace with three packages:

- `packages/tokens` (`@cesuain/tokens`): token sources, the generator, and generated CSS, JS and JSON.
- `packages/ui` (`@cesuain/ui`): React components that depend on `@cesuain/tokens`.
- `apps/docs` (`@cesuain/docs`, private): Storybook, importing `@cesuain/ui` from source.

Repository-level scripts (`scripts/`) hold cross-package checks such as `docs:check`.

## Consequences

- Token changes and the components that use them land in one pull request and are tested together.
- Each package has its own `typecheck` and `test` scripts; root scripts fan out with `pnpm -r`.
- No `packages/tooling` package exists yet. Shared configuration lives at the root (ESLint, Prettier, `tsconfig.base.json`) until there is enough of it to justify a package.
