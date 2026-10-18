# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the packages follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-10-18

The stable release. The token names, component APIs and stylesheet entry point are now covered by SemVer: only a major release removes or renames them. [cesarfonseca.dev](https://cesarfonseca.dev) runs on this release.

### Added

- `SectionHeading` `size` prop (`lg` | `xl` | `2xl`) mapping the title to the display text styles.
- `StatCard` `size` prop (`md` | `lg`) for a larger, fluid value.
- `FeatureCard` `size` prop (`md` | `lg`) that steps titles up one display size from the `sm` breakpoint.
- Storybook introduction links to the GitHub repository, the npm packages and the production site.

### Fixed

- `styles.css` also scans `lib/` for class names, so the shared recipes (dialog and sheet scrims, menu rows, field controls) are generated in apps that install the package.

### Changed

- Generated component READMEs and the component index link to the published Storybook.
- Documentation describes the 1.x release policy.

## [0.1.0] - 2026-10-18

First published release of `@cesuain/tokens` and `@cesuain/ui`.

### Added

- **`@cesuain/tokens`**
  - 300 DTCG tokens: 184 primitive, 98 semantic, 18 component.
  - Dark (default) and light themes.
  - Generator with validation, alias resolution, cycle detection and 50 WCAG contrast checks.
  - Outputs: CSS variables, Tailwind v4 theme, TypeScript, flat and DTCG JSON, Figma variables payload, and Markdown reference and mapping.
- **`@cesuain/ui`**
  - 64 React components on Radix UI, Base UI, cmdk, Vaul, Sonner and react-day-picker, each with variants, unit tests, stories and a README.
  - A single `styles.css` entry that replaces `@import "tailwindcss"`.
- **`@cesuain/docs`**
  - Storybook 10 with Foundations pages rendered from token data.
  - Docs pages linked to Figma, and interaction and axe tests on every story.
- **Figma library** ([file](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb))
  - Cover, nine foundation boards, and variables and styles mirroring the tokens.
  - Native component sets for all 64 components plus the shared Menu Item.
- **Tooling**
  - `tokens:check`, `docs:generate` and `docs:check`.
  - Playwright smoke tests against the static Storybook.
  - GitHub Actions CI.

[Unreleased]: https://github.com/cesuain/cesuain-design-system/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/cesuain/cesuain-design-system/releases/tag/v1.0.0
[0.1.0]: https://github.com/cesuain/cesuain-design-system/commit/80f799c
