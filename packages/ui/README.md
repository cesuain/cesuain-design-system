# @cesuain/ui

Accessible React components for the [Cesuain Design System](https://github.com/cesuain/cesuain-design-system): 64 components built on shadcn/ui conventions, Radix UI and Tailwind CSS v4, styled only through [`@cesuain/tokens`](https://www.npmjs.com/package/@cesuain/tokens).

> 0.x: the API may still change between minor versions. See the [changelog](https://github.com/cesuain/cesuain-design-system/blob/main/CHANGELOG.md).

## Install

```sh
npm install @cesuain/ui
```

Peer dependencies: `react` and `react-dom` ^19, `tailwindcss` ^4.1 (with `@tailwindcss/vite` or `@tailwindcss/postcss`).

Replace your Tailwind import with the design-system stylesheet. It loads Tailwind, the tokens, both themes and the component classes:

```css
/* app.css */
@import "@cesuain/ui/styles.css"; /* instead of @import "tailwindcss" */
```

Load the fonts yourself (for example `@fontsource/anton`, `@fontsource/poppins` and `@fontsource/jetbrains-mono`); the stacks fall back to system fonts.

## Use

```tsx
import { Button } from "@cesuain/ui";
// or one component per entry point
import { Card, CardHeader, CardTitle } from "@cesuain/ui/card";

<Button variant="gradient">Get started</Button>;
```

Dark is the default theme. Set `data-theme="light"` (or the `light` class) on `<html>` or any element, or use `<ThemeToggle />`.

## Links

- [Documentation and component catalog](https://github.com/cesuain/cesuain-design-system#readme)
- [Figma library](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb)
- [Accessibility notes](https://github.com/cesuain/cesuain-design-system/blob/main/docs/accessibility/README.md)

## License

MIT
