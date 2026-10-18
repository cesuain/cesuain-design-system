# ADR 0006: Unit tests in jsdom, story tests in a real browser, axe in both

- **Status:** Accepted
- **Date:** 2026-10-18

## Context

Component behaviour (props, keyboard, focus, forms) needs fast feedback. Rendering, layout-dependent behaviour and color contrast need a real browser. Every story should be a test so documentation cannot rot.

## Decision

- **Unit tests:** Vitest with Testing Library in jsdom, one `<name>.test.tsx` per component. Queries go by role and name. Most files also assert `expectNoA11yViolations()` (axe-core without the layout-dependent `color-contrast` rule).
- **Story tests:** `@storybook/addon-vitest` runs every story in Chromium through Vitest's Playwright provider. Stories render, `play` functions exercise interactions, and the a11y addon runs axe with `test: "error"`, so violations fail the run.
- **Token tests:** Vitest over the generator: aliases, cycles, naming, formats and contrast.
- **Repository checks:** `tokens:check` (generated files current), `docs:check` (docs match code), the TypeScript build, and `tests/` Playwright smoke tests against the static Storybook.

## Consequences

- A regression in a documented example fails CI even if no unit test covers it.
- Browser tests need Playwright's Chromium installed (`pnpm exec playwright install chromium`), which CI does explicitly.
- Visual regression screenshots are not part of the suite yet (see the roadmap in the README).
