# ADR 0004: Dark-first theming with `data-theme` scoping

- **Status:** Accepted
- **Date:** 2026-10-18

## Context

The visual language is dark-first. Products also need a light theme, sometimes for one region of a page (a light card inside dark docs, for example).

## Decision

- Theme values are emitted as CSS variables under `:root, .dark, [data-theme="dark"]` (dark, the default) and `.light, [data-theme="light"]` (light). Any element can switch its subtree.
- The `dark:` variant applies unless an ancestor opts into light, and `light:` is available for the reverse (`styles/variants.css`).
- `ThemeToggle` and `useDocumentTheme`/`setDocumentTheme` manage `data-theme` on `<html>`.
- Every contrast pair is validated in both themes at build time.

## Consequences

- Components never branch on the theme in JavaScript; colors come from variables.
- Light values sometimes use deeper hues to meet contrast. For example, `brand` is `#38bdf8` in dark and `#0369a1` in light.
