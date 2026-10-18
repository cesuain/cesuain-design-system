# ADR 0003: Tailwind CSS v4 theme bridge and shadcn/ui conventions

- **Status:** Accepted
- **Date:** 2026-10-18

## Context

The source website uses Tailwind CSS. shadcn/ui gives accessible, owned component code on Radix primitives, with a large ecosystem of compatible components.

## Decision

- Components follow shadcn/ui conventions:
  - source lives in the repository;
  - `cva` variants;
  - `data-slot` attributes;
  - `cn()` for class merging;
  - semantic color names (`--background`, `--card`, `--primary`, `--muted-foreground`).
- The token generator emits `theme.css`, a Tailwind v4 `@theme inline` block that maps tokens to utilities: `bg-card`, `text-heading-lg`, `rounded-card`, `shadow-elevation-lg`.
- `@cesuain/ui/styles.css` is the single stylesheet entry. Consumers import it **instead of** `@import "tailwindcss"`. It loads Tailwind, the tokens, the theme bridge, shadcn state variants, base styles and utilities, and `@source`s the component files so their classes are generated.
- Shared recipes (`lib/styles.ts`) keep repeated anatomy identical, such as text fields, floating surfaces and menu rows.

## Consequences

- A component pulled from the shadcn/ui registry needs only token-name adjustments to fit.
- Upgrading shadcn/ui components is a manual diff, not a CLI overwrite. See CONTRIBUTING.
- Consumers must use Tailwind v4 (`tailwindcss` is a peer dependency, `^4.1.0`).
