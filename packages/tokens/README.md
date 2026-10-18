# @cesuain/tokens

Design tokens for the [Cesuain Design System](https://github.com/cesuain/cesuain-design-system): 300 tokens in the W3C DTCG format (primitive, semantic and component layers) with dark and light themes, plus generated CSS variables, a Tailwind CSS v4 theme, TypeScript values and JSON.

> Stable since 1.0.0: token names and semantics change only in a major release. See the [changelog](https://github.com/cesuain/cesuain-design-system/blob/main/CHANGELOG.md).

## Install

```sh
npm install @cesuain/tokens
```

If you use `@cesuain/ui`, it already depends on this package and imports it through `@cesuain/ui/styles.css`.

## Use

```css
@import "tailwindcss";
@import "@cesuain/tokens/tokens.css"; /* CSS variables; dark by default, data-theme="light" for light */
@import "@cesuain/tokens/theme.css"; /* Tailwind v4 @theme bridge: bg-card, rounded-card, text-heading-lg… */
```

```ts
import { tokens, vars } from "@cesuain/tokens";

tokens.dark.component.control.height.md; // resolved value for a theme
vars; // the matching CSS variable references
```

| Entry point  | Contents                                               |
| ------------ | ------------------------------------------------------ |
| `tokens.css` | CSS custom properties for both themes                  |
| `theme.css`  | Tailwind CSS v4 `@theme inline` mapping                |
| `.` (JS)     | Typed token values                                     |
| `json/*`     | Flat and DTCG JSON per theme, docs data, Figma payload |

DTCG sources are included in `src/`. Every token is listed in the [token reference](https://github.com/cesuain/cesuain-design-system/blob/main/docs/foundations/generated/tokens.md).

## License

MIT
