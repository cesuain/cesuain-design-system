import type { RawToken } from "./types.ts";

/** Prefix for every generated custom property except shadcn-compatible semantic colors. */
export const PREFIX = "cds";

/** True for theme-aware semantic colors, which keep shadcn/ui's variable names. */
export function isSemanticColor(token: Pick<RawToken, "layer" | "path" | "type">): boolean {
  return token.layer === "semantic" && token.type === "color" && token.path[0] === "color";
}

/**
 * Token path → CSS custom property.
 *
 * - Semantic colors drop the `color` root and a trailing `default`, so
 *   `color.card.default` → `--card` and `color.card.foreground` → `--card-foreground`
 *   (the names shadcn/ui components expect).
 * - Component tokens drop the `component` root: `component.control.height.md` → `--cds-control-height-md`.
 * - Everything else is prefixed: `color.neutral.975` → `--cds-color-neutral-975`.
 */
export function cssVarName(token: Pick<RawToken, "layer" | "path" | "type">): string {
  if (isSemanticColor(token)) {
    const segments = token.path.slice(1);
    if (segments.at(-1) === "default") segments.pop();
    return `--${segments.join("-")}`;
  }
  const segments = token.layer === "component" ? token.path.slice(1) : token.path;
  return `--${PREFIX}-${segments.join("-")}`;
}

/** Token path → Figma variable or style name (slash-separated groups). */
export function figmaName(token: Pick<RawToken, "path">): string {
  return token.path.join("/");
}

/** Tailwind utility suffix for a semantic color, e.g. `card-foreground` for `bg-card-foreground`. */
export function tailwindColorName(token: Pick<RawToken, "layer" | "path" | "type">): string {
  return cssVarName(token).slice(2);
}

/** Text style name used by `text-<name>` utilities, e.g. `display-2xl` for `text.display.2xl`. */
export function textStyleName(token: Pick<RawToken, "path">): string {
  return token.path.slice(1).join("-");
}
