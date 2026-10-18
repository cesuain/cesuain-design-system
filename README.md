# Cesuain Design System

**A production-ready foundation for product interfaces.** I designed and built the Cesuain Design System — design tokens, accessible React components, Storybook documentation and a matching Figma library — and it powers the interface of my personal website, [cesarfonseca.dev](https://cesarfonseca.dev).

|           |                                                                                                                                                                    |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Version   | **1.0.0** (stable)                                                                                                                                                 |
| Packages  | [`@cesuain/tokens`](https://www.npmjs.com/package/@cesuain/tokens) · [`@cesuain/ui`](https://www.npmjs.com/package/@cesuain/ui) · `@cesuain/docs` (Storybook site) |
| Storybook | [storybook.cesarfonseca.dev](https://storybook.cesarfonseca.dev)                                                                                                   |
| Figma     | [Cesuain Design System](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb)                                                                                       |
| Source    | [github.com/cesuain/cesuain-design-system](https://github.com/cesuain/cesuain-design-system)                                                                       |
| In use    | [cesarfonseca.dev](https://cesarfonseca.dev) consumes `@cesuain/ui` for its buttons, badges, forms, section layout, cards, theme toggle and command palette        |
| Quality   | 300 tokens, 64 components, 50/50 contrast checks passing, unit + story + browser tests in CI                                                                       |

## Contents

1. [Project overview](#1-project-overview)
2. [Design philosophy](#2-design-philosophy)
3. [Visual identity](#3-visual-identity)
4. [Technology stack](#4-technology-stack)
5. [Architecture](#5-architecture)
6. [Installation](#6-installation)
7. [Local development](#7-local-development)
8. [Component usage](#8-component-usage)
9. [Token architecture](#9-token-architecture)
10. [JSON token generation](#10-json-token-generation)
11. [Theme configuration](#11-theme-configuration)
12. [Storybook](#12-storybook)
13. [Figma](#13-figma)
14. [Foundations](#14-foundations)
15. [Component catalog](#15-component-catalog)
16. [Accessibility](#16-accessibility)
17. [Testing](#17-testing)
18. [Contributing](#18-contributing)
19. [Releases and versioning](#19-releases-and-versioning)
20. [Requirements and scope](#20-requirements-and-scope)

## 1. Project overview

The Cesuain Design System is a complete, versioned system for building React interfaces with one consistent visual language:

- **`@cesuain/tokens`**: DTCG design tokens and a generator. It produces CSS variables, a Tailwind CSS v4 theme, TypeScript, JSON, a Figma variables payload and Markdown reference docs, and enforces WCAG contrast in both themes.
- **`@cesuain/ui`**: 64 accessible React components (shadcn/ui conventions on Radix UI and friends), styled only through tokens.
- **`@cesuain/docs`**: Storybook with foundations rendered from token data and a Docs page for every component, each linked to its Figma component set.
- **Figma library**: variables and styles that mirror the tokens, foundation boards, and a native component set for every component.

Every component is styled only through tokens, so a change to a token updates code, Storybook and Figma together. The system runs in production on [cesarfonseca.dev](https://cesarfonseca.dev), which imports `@cesuain/ui` and its stylesheet instead of keeping its own UI primitives.

## 2. Design philosophy

- **Tokens first.** Every color, size, radius, shadow, duration and type style is a named token. Code, Figma and docs are generated from the same source.
- **Accessible by default.** Proven primitives (Radix UI, Base UI, cmdk, Vaul), visible focus, reduced-motion support and build-time contrast checks.
- **Composable, not configurable.** Small parts you compose (`Card`, `CardHeader`, `CardTitle`…), with `cva` variants only for decisions that recur.
- **Quiet, then bold.** Dark layered surfaces and soft borders carry the interface. The blue → cyan → violet gradient and condensed display type are reserved for emphasis.

## 3. Visual identity

| Element    | Definition                                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Canvas     | Near-black `#050505` (dark, default) / `#fafafa` (light); cards `#0b0b0d` / `#ffffff`                                          |
| Brand      | Sky `#38bdf8` in dark, deepened to `#0369a1` in light for contrast                                                             |
| Gradient   | `#3b82f6` → `#22d3ee` → `#a855f7` (`gradient.start/middle/end`) for highlights, the gradient button, badges and borders        |
| Typography | **Anton** uppercase display, **Poppins** for interface and body text, **JetBrains Mono** for eyebrows and code                 |
| Shape      | Pill-shaped controls (`radius.control` = full); 24px cards (`radius.card`); layered `surface` gradients with hairline borders  |
| Motion     | `easing.standard` = `cubic-bezier(0.16, 1, 0.3, 1)`; durations `fast` → `slower`; all motion respects `prefers-reduced-motion` |

## 4. Technology stack

| Area     | Choice                                                                                                                                             |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Language | TypeScript 6.0 (strict), ESM                                                                                                                       |
| UI       | React 19.3; shadcn/ui conventions; Radix UI 1.8 (`radix-ui`), Base UI 1.9, cmdk, Vaul, Sonner, react-day-picker 10, TanStack Table 9; Lucide icons |
| Styling  | Tailwind CSS 4.3 with a generated `@theme` bridge; `class-variance-authority`, `tailwind-merge`; `tw-animate-css`                                  |
| Tokens   | W3C DTCG format; in-repo generator (no runtime dependencies)                                                                                       |
| Docs     | Storybook 10.6 (React + Vite 8), addons: docs, a11y, themes, vitest                                                                                |
| Tests    | Vitest 5 + Testing Library (jsdom), axe-core, Storybook story tests in Chromium, Playwright 1.64                                                   |
| Quality  | ESLint 10 (typescript-eslint, react-hooks, storybook), Prettier 3 with the Tailwind plugin                                                         |
| Tooling  | pnpm 10 workspaces, Node.js ≥ 22.18 (runs the TypeScript scripts directly), GitHub Actions                                                         |

## 5. Architecture

```text
cesuain-design-system/
├── packages/
│   ├── tokens/          @cesuain/tokens: src/ (DTCG JSON) → scripts/ (generator) → css/, js/, json/
│   └── ui/              @cesuain/ui: src/components/<name>/, src/lib/, src/styles/, scripts/build.ts
├── apps/docs/           @cesuain/docs: Storybook config, Introduction and Foundations pages
├── docs/                architecture (ADRs), accessibility, contribution, figma, foundations, component index
├── scripts/             docs:generate and docs:check
├── tests/               Playwright smoke tests against the static Storybook
└── .github/workflows/   CI
```

Each component directory holds `<name>.tsx`, optional `<name>.variants.ts`, `<name>.test.tsx`, `<name>.stories.tsx`, a generated `README.md` and `index.ts`. Data flow, package boundaries and decisions are in [docs/architecture](docs/architecture/README.md).

## 6. Installation

Both packages are published to npm. `@cesuain/ui` depends on `@cesuain/tokens`, so one install brings both:

```sh
pnpm add @cesuain/ui
```

Peer dependencies: `react` and `react-dom` ^19, `tailwindcss` ^4.1 (with `@tailwindcss/vite` or `@tailwindcss/postcss`).

Then replace your Tailwind import with the design-system stylesheet:

```css
/* app/globals.css */
@import "@cesuain/ui/styles.css"; /* instead of @import "tailwindcss" */
```

Load the three font families (for example with `@fontsource/anton`, `@fontsource/poppins` and `@fontsource/jetbrains-mono`, as the Storybook does). The font stacks fall back to system fonts.

## 7. Local development

```sh
corepack enable            # uses the pinned pnpm 10.15.0
pnpm install
pnpm exec playwright install chromium
pnpm storybook             # http://localhost:6006
```

| Command                | What it does                                                                              |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| `pnpm storybook`       | Storybook dev server (alias: `pnpm dev`)                                                  |
| `pnpm test`            | Unit tests: `@cesuain/tokens` and `@cesuain/ui` (Vitest)                                  |
| `pnpm test:stories`    | Every story in Chromium: render, `play` interactions, axe                                 |
| `pnpm test:e2e`        | Playwright smoke tests against `apps/docs/storybook-static` (run `storybook:build` first) |
| `pnpm lint` / `format` | ESLint / Prettier (`lint:fix`, `format:check`)                                            |
| `pnpm typecheck`       | `tsc --noEmit` in every package                                                           |
| `pnpm build`           | Tokens, then `@cesuain/ui` into `packages/ui/dist`                                        |
| `pnpm storybook:build` | Static Storybook in `apps/docs/storybook-static`                                          |
| `pnpm docs:generate`   | Regenerates component READMEs and `docs/component-index.md`                               |
| `pnpm docs:check`      | Fails if docs, barrel exports, Figma map or READMEs drift from the code                   |
| `pnpm run ci`          | Everything CI runs, in order                                                              |

## 8. Component usage

```tsx
import { Button, Card, CardDescription, CardHeader, CardTitle } from "@cesuain/ui";

export function Example() {
  return (
    <Card variant="surface">
      <CardHeader>
        <CardTitle>Design tokens</CardTitle>
        <CardDescription>One source for code and Figma.</CardDescription>
      </CardHeader>
      <Button variant="gradient">Get started</Button>
    </Card>
  );
}
```

- Per-component entry points are available too: `import { Button } from "@cesuain/ui/button"`.
- Overlays with tooltips expect one `<TooltipProvider>` near the root. Toasts need one `<Toaster />`; trigger them with `toast()`.
- Every component's props and examples are on its Storybook Docs page; its README links the Figma set and lists the tokens it uses.

## 9. Token architecture

| Layer     | Count | Example                                                                   | Used by                  |
| --------- | ----- | ------------------------------------------------------------------------- | ------------------------ |
| Primitive | 184   | `color.sky.400`, `spacing.4`, `radius.3xl`                                | Semantic tokens only     |
| Semantic  | 98    | `color.brand.default`, `radius.card`, `text.heading.lg`, `space.stack.md` | Components, products     |
| Component | 18    | `component.control.height.md`, `component.overlay.width-sm`               | Shared component anatomy |

- **Themes** override semantic colors only (`src/themes/dark`, `src/themes/light`); all other tokens are shared.
- **Names** derive from the token path:
  - CSS: semantic colors keep shadcn/ui names (`--card`, `--muted-foreground`); everything else is `--cds-<path>`;
  - Tailwind: `bg-card`, `rounded-card`, `text-heading-lg`, `shadow-elevation-lg`;
  - Figma: `color/card/default`.
- The full mapping is generated in [docs/foundations/generated/mapping.md](docs/foundations/generated/mapping.md); every token is described in [tokens.md](docs/foundations/generated/tokens.md).

## 10. JSON token generation

```sh
pnpm tokens:validate            # validate sources, resolve aliases, check contrast; writes nothing
pnpm tokens:build               # validate, then write every output
pnpm tokens:export:json         # only json/
pnpm tokens:export:css          # only css/
pnpm tokens:export:typescript   # only js/
pnpm tokens:check               # fail if committed outputs differ from what the sources produce
```

Outputs in `packages/tokens`:

- `css/tokens.css`: variables per theme;
- `css/theme.css`: Tailwind `@theme inline` bridge;
- `js/index.{js,d.ts}`: typed values;
- `json/tokens.{dark,light}.json`: flat;
- `json/tokens.{dark,light}.dtcg.json`: resolved DTCG;
- `json/docs.json`: tokens and contrast results for the docs;
- `json/figma-variables.json`: collections, variables, text and effect styles.

Invalid types, unresolved or circular aliases, theme mismatches and contrast failures stop the build with every issue listed at once.

## 11. Theme configuration

Dark is the default; light is opt-in on any element:

```html
<html data-theme="light">
  <!-- or class="light"; nest data-theme="dark" to switch a region back -->
</html>
```

```tsx
import { ThemeToggle, setDocumentTheme, useDocumentTheme } from "@cesuain/ui";

<ThemeToggle />; // flips data-theme on <html>; labelled "Switch to light theme" / "Switch to dark theme"
```

- Use `dark:` and `light:` Tailwind variants for the rare theme-specific style. Components need none because colors come from variables.
- To adjust a theme, override semantic variables (`--brand`, `--card`…) in a scope, or change `packages/tokens/src/themes/*` and rebuild. The contrast checks then guard the result.

## 12. Storybook

```sh
pnpm storybook         # dev server on http://localhost:6006
pnpm storybook:build   # static site in apps/docs/storybook-static
```

The published Storybook is at **[storybook.cesarfonseca.dev](https://storybook.cesarfonseca.dev)** and is rebuilt from `main`.

- **Introduction**: principles, packages, getting started, production usage and links to GitHub and the Figma library.
- **Foundations**: Colors, Contrast, Typography, Spacing, Radius, Shadows, Layout, Motion, Iconography, Themes and a searchable token reference. All are rendered from `@cesuain/tokens` data.
- **Components** and **Patterns**: a Docs page per component, with a link to its Figma component set, props table and stories for variants, sizes and states.
- Use the toolbar's theme switcher to see both themes. The Accessibility panel shows axe results for the current story.

CI also uploads `storybook-static` as a build artifact for every run.

## 13. Figma

**[Cesuain Design System in Figma](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb)**

The file has three pages: a cover, foundations and tokens, and components. It contains:

- **Variables:** Primitives, Theme (dark), Theme (Light) and Semantic collections, all with CSS code syntax;
- **Styles:** 18 text styles and 11 effect styles;
- **Boards:** nine foundation boards and eight component boards;
- **Component sets:** one per component, with variants that mirror the React props.

Code is the source of truth, and Figma is updated **one way**. Nothing synchronizes automatically. [docs/figma](docs/figma/README.md) explains the sync process, conventions and the Starter-plan constraints. Every component's Figma node is recorded in [docs/figma/component-map.json](docs/figma/component-map.json).

## 14. Foundations

| Foundation  | Storybook                                                                                                     | Figma                                                                                   | Reference                                                      |
| ----------- | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Colors      | [Foundations/Colors](https://storybook.cesarfonseca.dev/?path=/story/foundations-colors--palette)             | [Colors](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=6-2)               | [tokens.md](docs/foundations/generated/tokens.md)              |
| Contrast    | [Foundations/Colors › Contrast](https://storybook.cesarfonseca.dev/?path=/story/foundations-colors--contrast) | [Themes & Contrast](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=12-364) | `packages/tokens/src/meta/contrast.json`                       |
| Typography  | [Foundations/Typography](https://storybook.cesarfonseca.dev/?path=/story/foundations-typography--type-scale)  | [Typography](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=9-2)           | [tokens.md](docs/foundations/generated/tokens.md)              |
| Spacing     | [Foundations/Spacing](https://storybook.cesarfonseca.dev/?path=/story/foundations-spacing--scale)             | [Spacing](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=10-2)             | [tokens.md](docs/foundations/generated/tokens.md)              |
| Radius      | [Foundations/Radius](https://storybook.cesarfonseca.dev/?path=/story/foundations-radius--radius)              | [Radius](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=10-266)            | [tokens.md](docs/foundations/generated/tokens.md)              |
| Shadows     | [Foundations/Shadows](https://storybook.cesarfonseca.dev/?path=/story/foundations-shadows--shadows)           | [Shadows](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=10-339)           | [tokens.md](docs/foundations/generated/tokens.md)              |
| Layout      | [Foundations/Layout](https://storybook.cesarfonseca.dev/?path=/story/foundations-layout--layout)              | [Layout](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=12-2)              | [tokens.md](docs/foundations/generated/tokens.md)              |
| Motion      | [Foundations/Motion](https://storybook.cesarfonseca.dev/?path=/story/foundations-motion--tokens)              | [Motion](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=12-160)            | [tokens.md](docs/foundations/generated/tokens.md)              |
| Iconography | [Foundations/Iconography](https://storybook.cesarfonseca.dev/?path=/story/foundations-iconography--icons)     | [Iconography](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=12-226)       | [Lucide](https://lucide.dev)                                   |
| Themes      | [Foundations/Themes](https://storybook.cesarfonseca.dev/?path=/story/foundations-themes--comparison)          | [Themes & Contrast](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=12-364) | [ADR 0004](docs/architecture/adr/0004-dark-default-theming.md) |
| All tokens  | [Foundations/Tokens](https://storybook.cesarfonseca.dev/?path=/story/foundations-tokens--reference)           | Variables panel                                                                         | [mapping.md](docs/foundations/generated/mapping.md)            |

## 15. Component catalog

64 components. Each name links to its README (Storybook path, Figma link, tokens, accessibility notes). The full **Component → Source · Storybook · Tests · Tokens · Figma** index is in [docs/component-index.md](docs/component-index.md).

| Category     | Components                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Figma board                                                                        |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Actions      | [Button](packages/ui/src/components/button/README.md), [Button Group](packages/ui/src/components/button-group/README.md), [Icon Button](packages/ui/src/components/icon-button/README.md), [Toggle](packages/ui/src/components/toggle/README.md), [Toggle Group](packages/ui/src/components/toggle-group/README.md)                                                                                                                                                                                                                                                                                                                                                                                                    | [Actions](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=14-2)        |
| Forms        | [Checkbox](packages/ui/src/components/checkbox/README.md), [Combobox](packages/ui/src/components/combobox/README.md), [Date Picker](packages/ui/src/components/date-picker/README.md), [Field](packages/ui/src/components/field/README.md), [Input](packages/ui/src/components/input/README.md), [Input Group](packages/ui/src/components/input-group/README.md), [Label](packages/ui/src/components/label/README.md), [Radio Group](packages/ui/src/components/radio-group/README.md), [Select](packages/ui/src/components/select/README.md), [Slider](packages/ui/src/components/slider/README.md), [Switch](packages/ui/src/components/switch/README.md), [Textarea](packages/ui/src/components/textarea/README.md) | [Forms](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=15-179)        |
| Navigation   | [Breadcrumb](packages/ui/src/components/breadcrumb/README.md), [Link](packages/ui/src/components/link/README.md), [Menubar](packages/ui/src/components/menubar/README.md), [Navigation Menu](packages/ui/src/components/navigation-menu/README.md), [Pagination](packages/ui/src/components/pagination/README.md), [Segmented Control](packages/ui/src/components/segmented-control/README.md), [Sidebar](packages/ui/src/components/sidebar/README.md), [Tabs](packages/ui/src/components/tabs/README.md)                                                                                                                                                                                                             | [Navigation](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=18-292)   |
| Feedback     | [Alert](packages/ui/src/components/alert/README.md), [Alert Dialog](packages/ui/src/components/alert-dialog/README.md), [Empty State](packages/ui/src/components/empty-state/README.md), [Progress](packages/ui/src/components/progress/README.md), [Skeleton](packages/ui/src/components/skeleton/README.md), [Spinner](packages/ui/src/components/spinner/README.md), [Toast](packages/ui/src/components/toaster/README.md)                                                                                                                                                                                                                                                                                          | [Feedback](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=20-367)     |
| Overlays     | [Context Menu](packages/ui/src/components/context-menu/README.md), [Dialog](packages/ui/src/components/dialog/README.md), [Drawer](packages/ui/src/components/drawer/README.md), [Dropdown Menu](packages/ui/src/components/dropdown-menu/README.md), [Hover Card](packages/ui/src/components/hover-card/README.md), [Popover](packages/ui/src/components/popover/README.md), [Sheet](packages/ui/src/components/sheet/README.md), [Tooltip](packages/ui/src/components/tooltip/README.md)                                                                                                                                                                                                                             | [Overlays](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=23-412)     |
| Data Display | [Accordion](packages/ui/src/components/accordion/README.md), [Avatar](packages/ui/src/components/avatar/README.md), [Badge](packages/ui/src/components/badge/README.md), [Calendar](packages/ui/src/components/calendar/README.md), [Card](packages/ui/src/components/card/README.md), [Collapsible](packages/ui/src/components/collapsible/README.md), [Command](packages/ui/src/components/command/README.md), [Data Table](packages/ui/src/components/data-table/README.md), [Kbd](packages/ui/src/components/kbd/README.md), [Scroll Area](packages/ui/src/components/scroll-area/README.md), [Separator](packages/ui/src/components/separator/README.md), [Table](packages/ui/src/components/table/README.md)     | [Data Display](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=24-507) |
| Layout       | [Container](packages/ui/src/components/container/README.md), [Content Wrapper](packages/ui/src/components/content-wrapper/README.md), [Grid](packages/ui/src/components/grid/README.md), [Page Header](packages/ui/src/components/page-header/README.md), [Section](packages/ui/src/components/section/README.md), [Stack](packages/ui/src/components/stack/README.md), [Surface](packages/ui/src/components/surface/README.md)                                                                                                                                                                                                                                                                                        | [Layout](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=26-581)       |
| Patterns     | [Feature Card](packages/ui/src/components/feature-card/README.md), [Section Heading](packages/ui/src/components/section-heading/README.md), [Stat Card](packages/ui/src/components/stat-card/README.md), [Theme Toggle](packages/ui/src/components/theme-toggle/README.md), [Timeline](packages/ui/src/components/timeline/README.md)                                                                                                                                                                                                                                                                                                                                                                                  | [Patterns](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=27-593)     |

## 16. Accessibility

- **Target:** WCAG 2.2 AA.
- **Automated checks:**
  - contrast for every declared token pair in both themes (`tokens:check`);
  - axe-core in 51 component unit-test files;
  - axe on every story in a real browser (`test:stories`, where violations fail);
  - keyboard and focus tests.
- **Built in:**
  - required accessible names for icon-only controls;
  - `:focus-visible` rings;
  - underlined links in text;
  - live regions for alerts and toasts;
  - reduced-motion support;
  - 38px+ hit areas for small controls.
- **Manual review scope:** screen reader output, forced-colors mode and zoom/reflow are outside the automated suite. Review them in the product that ships the components before claiming WCAG conformance.

Details and the contributor checklist: [docs/accessibility](docs/accessibility/README.md).

## 17. Testing

| Suite           | Command                                | Scope                                                                                                      |
| --------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Token generator | `pnpm test`                            | 20 tests: validation, aliases and cycles, theme parity, naming, deterministic output, contrast             |
| Components      | `pnpm test`                            | 64 test files: rendering, variants, interactions, keyboard, forms, disabled/loading/error states, axe      |
| Stories         | `pnpm test:stories`                    | Every story (75 files) rendered in Chromium, with `play` interactions and axe                              |
| Browser smoke   | `pnpm test:e2e`                        | Static Storybook: docs coverage for every component, Figma links, theme switching, dialog focus management |
| Consistency     | `pnpm tokens:check`, `pnpm docs:check` | Generated tokens and docs are current; barrel, component files and Figma map are complete                  |

CI ([.github/workflows/ci.yml](.github/workflows/ci.yml)) runs all of these, plus format, lint, type check, the package build and the Storybook build, on every push to `main` and every pull request.

## 18. Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup and rules, and [docs/contribution](docs/contribution/README.md) for how to change tokens, add a component, upgrade from shadcn/ui and update Figma.

## 19. Releases and versioning

- `@cesuain/tokens` and `@cesuain/ui` follow [SemVer](https://semver.org) and are released together with one version.
- **1.0.0 is the stable API.** Patch releases fix bugs; minor releases add components, variants or tokens; only a major release removes or renames exports, props or tokens.
- Changes are recorded in [CHANGELOG.md](CHANGELOG.md) ([Keep a Changelog](https://keepachangelog.com)).
- A release bumps the package versions and the Figma cover, passes `pnpm run ci`, is tagged `vX.Y.Z` and is published to npm.

## 20. Requirements and scope

- **Tailwind CSS v4.** The styles ship as a Tailwind v4 stylesheet (`@cesuain/ui/styles.css`), which replaces `@import "tailwindcss"` in the consuming app.
- **Fonts are loaded by the app.** Load Anton, Poppins and JetBrains Mono (for example with `next/font` or `@fontsource/*`); the stacks fall back to system fonts.
- **Figma follows code.** Code is the source of truth and Figma is updated one way, through the Figma MCP server. The Starter plan shapes the file, as described in [docs/figma](docs/figma/README.md#plan-constraints):
  - 3 pages;
  - one mode per collection, so Light is a separate collection;
  - motion tokens are documented on the Motion board rather than as Figma variables;
  - component descriptions link Figma to code in place of Code Connect.
- **Testing scope.** Rendering is covered by unit, story and browser smoke tests rather than pixel comparisons.

## License

[MIT](LICENSE)
