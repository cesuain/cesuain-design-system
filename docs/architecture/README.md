# Architecture

```text
packages/tokens/src/*.json  (DTCG source of truth)
        │  node scripts/tokens.ts build   — validate → resolve aliases → check contrast → render
        ├──► css/tokens.css          CSS custom properties, scoped per theme
        ├──► css/theme.css           Tailwind v4 @theme bridge (bg-card, rounded-card, text-heading-lg…)
        ├──► js/index.{js,d.ts}      typed token values for TypeScript
        ├──► json/*.json             flat + DTCG per theme, docs.json (docs + contrast results)
        ├──► json/figma-variables.json  input for the Figma library (one-way, see docs/figma)
        └──► docs/foundations/generated/*.md  token reference and Token ↔ CSS ↔ Tailwind ↔ Figma mapping
                     │
packages/ui ─────────┘  @import "@cesuain/tokens/tokens.css" + theme.css in styles.css
  src/components/<name>/  implementation · variants · tests · stories · README · index.ts
  src/lib/styles.ts       shared class recipes (field, floating surface, menu row, overlay)
  src/styles/             styles.css entry: Tailwind + tokens + variants + base + utilities
        │
apps/docs (Storybook) ──── renders foundations from docs.json and every component story
docs/figma/component-map.json ── links each component to its Figma node; drives READMEs and Storybook links
```

## Package boundaries

| Package           | Depends on                    | Published output                                                                 |
| ----------------- | ----------------------------- | -------------------------------------------------------------------------------- |
| `@cesuain/tokens` | nothing at runtime            | Committed generated files (`css/`, `js/`, `json/`); source JSON in `src/`.       |
| `@cesuain/ui`     | `@cesuain/tokens`, Radix etc. | `dist/` built by `scripts/build.ts`: ESM + `.d.ts` per module, `styles/` copied. |
| `@cesuain/docs`   | both (from source)            | Private Storybook app; `storybook-static/` on build.                             |

Generated files are committed so consumers and reviewers see exactly what changes. `pnpm tokens:check` fails CI when they drift from `src/`, and `pnpm docs:check` does the same for the component READMEs and index.

## Theming

Dark is the default. `:root`, `.dark` and `[data-theme="dark"]` get the dark values, and `.light` / `[data-theme="light"]` switch any subtree to light. Semantic colors keep shadcn/ui variable names (`--background`, `--card`, `--primary`), so components ported from shadcn/ui work unchanged. Every other token is namespaced `--cds-*`.

## Decision records

| ADR                                                      | Decision                                                        |
| -------------------------------------------------------- | --------------------------------------------------------------- |
| [0001](./adr/0001-monorepo-with-pnpm-workspaces.md)      | pnpm workspace with tokens, ui and docs packages                |
| [0002](./adr/0002-dtcg-tokens-and-custom-generator.md)   | DTCG token source with a small in-repo generator                |
| [0003](./adr/0003-tailwind-v4-and-shadcn-conventions.md) | Tailwind CSS v4 theme bridge and shadcn/ui conventions          |
| [0004](./adr/0004-dark-default-theming.md)               | Dark-first theming with `data-theme` scoping                    |
| [0005](./adr/0005-one-way-figma-sync.md)                 | Code is the source of truth; Figma is updated one way           |
| [0006](./adr/0006-testing-strategy.md)                   | Unit tests in jsdom, story tests in a real browser, axe in both |
