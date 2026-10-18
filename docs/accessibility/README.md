# Accessibility

**Target:** WCAG 2.2 level AA for every component and documentation page.

The checks below are automated and run in CI. Automated tools catch a meaningful share of issues, not all of them. Passing them is **not** a claim of full WCAG conformance. See [What is not verified](#what-is-not-verified).

## How it is built in

| Concern                 | Approach                                                                                                                                                                                                                                                                                  |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Semantics and keyboard  | Interactive components are built on Radix UI, Base UI (Combobox), cmdk (Command), Vaul (Drawer) and react-day-picker (Calendar). They implement the WAI-ARIA Authoring Practices patterns: roles, states, roving focus, typeahead, focus trapping and focus return.                       |
| Accessible names        | Icon-only controls require a name in the type system. `IconButton` requires `label`, which becomes `aria-label`; `Spinner` defaults to “Loading”.                                                                                                                                         |
| Focus visibility        | `focus-ring` utility: a `var(--cds-focus-width)` outline in `--ring` with an offset, on `:focus-visible` only. Text fields add a 20% ring halo. The ring color is contrast-checked (≥ 3:1) in both themes.                                                                                |
| Color contrast          | Every foreground/background pair a component uses is declared in `packages/tokens/src/meta/contrast.json` and measured by `pnpm tokens:check` in both themes: 4.5:1 for text, 3:1 for large text, icons and focus indicators. The build fails below the minimum. 50 pairs currently pass. |
| Color is not the signal | Links inside text are always underlined (WCAG 1.4.1). Invalid fields use `aria-invalid` plus a `FieldError` message (`role="alert"`), not color alone.                                                                                                                                    |
| Live regions            | `Alert` announces `destructive`/`warning` assertively (`role="alert"`) and others politely (`role="status"`). Toasts use Sonner's polite live region. `Skeleton` is hidden; containers announce loading.                                                                                  |
| Motion                  | `prefers-reduced-motion: reduce` collapses animations and transitions globally (`packages/ui/src/styles/base.css`). Looping effects (progress, pulse) use `motion-safe:`/`motion-reduce:` variants.                                                                                       |
| Target size             | Controls use the control height tokens (36/44/52px). Small visual targets keep a larger hit area: the 18px checkbox has a 38px pointer target, above the 24px minimum of WCAG 2.5.8.                                                                                                      |
| Themes                  | Both themes are first-class; every contrast pair is checked in each.                                                                                                                                                                                                                      |

## Automated checks

| Check                         | Where                                                                  | What fails the build                                                                                                                                                         |
| ----------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Token contrast                | `pnpm tokens:check`                                                    | Any declared pair below its minimum, in either theme.                                                                                                                        |
| axe in unit tests             | `pnpm test` (51 of 64 component test files)                            | Any axe-core violation in jsdom. `color-contrast` (no layout in jsdom) and `region` (components render outside landmarks) are disabled there; contrast is covered by tokens. |
| axe on every story            | `pnpm test:stories` (Storybook + Vitest, real Chromium)                | Any violation from axe-core's default rule set, including color contrast with real rendering.                                                                                |
| Keyboard and role-based tests | Unit tests (18 files drive the keyboard) and 32 story `play` functions | Broken focus order, keyboard interaction or accessible names in the tested flows.                                                                                            |

Rule exceptions are scoped and commented at the point of use. There is currently one: `aria-hidden-focus` is disabled for the Navigation Menu stories only, because Radix renders a focus-proxy span that immediately forwards focus.

## What is not verified

- **Manual review scope.** The automated suite does not cover screen reader output (VoiceOver, NVDA, JAWS), Windows High Contrast / forced-colors mode, or 200%/400% zoom and reflow. Review these in the product that ships the components before claiming conformance.
- Keyboard behaviour is tested for the flows covered by the tests above, not exhaustively for every component and option.
- Content-level criteria (alt text, headings, link text, form instructions) depend on how products use the components.

## Checklist for contributors

- Use semantic elements first (`button`, `a`, `nav`, `table`); reach for ARIA only to fill gaps.
- Give every control an accessible name; prefer a visible `Label`/`FieldLabel`.
- Use `focus-ring` (or the field recipe) for focus; never remove an outline without a replacement.
- Add a contrast pair to `contrast.json` for every new foreground/background combination.
- Add an `expectNoA11yViolations()` assertion and a keyboard test for interactive behaviour.
- Respect reduced motion for any new animation.
