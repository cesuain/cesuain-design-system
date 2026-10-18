# Contributing

Thanks for helping improve the Cesuain Design System. This page covers setup and the rules every change follows. Step-by-step workflows (tokens, components, Figma, releases) are in [docs/contribution](./docs/contribution/README.md).

## Setup

Requirements: Node.js 22.18 or later (see `.nvmrc`) and pnpm 10 (`corepack enable` picks the pinned version).

```sh
pnpm install
pnpm exec playwright install chromium   # browser for story and smoke tests
pnpm storybook                          # http://localhost:6006
```

## Before you open a pull request

Run the same checks as CI:

```sh
pnpm run ci
```

It runs:

- format check and lint;
- `tokens:check`, which validates tokens, checks contrast and verifies the generated files are current;
- type check and unit tests;
- package build and `docs:check`;
- Storybook build, then story tests (interactions and axe) and Playwright smoke tests.

## Rules

- **Tokens first.** Components use semantic tokens through Tailwind utilities (`bg-card`, `rounded-control`, `text-label-md`) or `--cds-*` variables, never raw colors, sizes or durations. If a value is missing, add a token.
- **Accessibility is part of done.** Every interactive component needs a keyboard test, accessible names, visible focus (`focus-ring` or the field recipe), reduced-motion support and new contrast pairs in `contrast.json`. See [docs/accessibility](./docs/accessibility/README.md).
- **Generated files are committed and never edited by hand.** That covers token outputs, `docs/foundations/generated/`, component READMEs and `docs/component-index.md`. Run `pnpm tokens:build` and `pnpm docs:generate` instead.
- **Figma links are real.** Only use node IDs and URLs returned by the Figma API, and record them in `docs/figma/component-map.json`.
- **Small, reviewable changes.** One component or concern per pull request. Update `CHANGELOG.md` under _Unreleased_.
- **Code style** is enforced by Prettier (with the Tailwind class sorter) and ESLint. Use conventional, imperative commit subjects (`feat(ui): add Rating component`).

## Reporting issues

Include the component, theme, browser and assistive technology (if any), with steps to reproduce. A Storybook story link or a minimal reproduction helps most.
