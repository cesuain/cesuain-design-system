# ADR 0002: DTCG token source with a small in-repo generator

- **Status:** Accepted
- **Date:** 2026-10-18

## Context

Tokens must produce CSS variables, a Tailwind v4 theme, TypeScript values, JSON for tooling, a Figma variables payload and documentation, all from one source. Contrast must be enforced in both themes, and generated files must be checkable in CI.

## Decision

- Author tokens in the W3C Design Tokens Community Group (DTCG) format (`$value`, `$type`, `$description`, `{alias}` references) under `packages/tokens/src`. The layers are `primitives/`, `semantic/`, `components/` and `themes/{dark,light}`, plus `meta/contrast.json`.
- Generate every output with a dependency-free TypeScript generator (`packages/tokens/scripts`), run directly by Node's type stripping:
  - `parse` reads the sources;
  - `resolve` validates types, resolves aliases, detects cycles and measures contrast;
  - `formats/*` render CSS, Tailwind theme, JS, JSON, Figma and Markdown.
- `build` writes only after every output renders, so a failing run never leaves partial files. `check` compares the would-be output with the committed files, and reports missing, outdated or stale files.

## Consequences

- The generator is small and fully under test (`packages/tokens/test`). Naming rules live in one module (`scripts/lib/naming.ts`).
- Adding an output format means adding a renderer, not configuring a third-party pipeline.
- The trade-off is maintaining the generator ourselves instead of using Style Dictionary or a similar tool. That would be worth revisiting if more platforms (iOS, Android) are needed.
