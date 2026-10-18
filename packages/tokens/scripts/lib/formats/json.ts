import { parseHex, toDtcgColor, toHex, toHslString, toRgbString } from "../color.ts";
import {
  cssVarName,
  figmaName,
  isSemanticColor,
  tailwindColorName,
  textStyleName,
} from "../naming.ts";
import type { Dimension, ResolvedToken, Shadow, TokenSet, Typography } from "../types.ts";
import { declarations, resolvedCss, type Lookup } from "../values.ts";

export const stringify = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`;

function tokensFor(set: TokenSet, theme: string): ResolvedToken[] {
  return [...set.base, ...(set.themed[theme] ?? [])];
}

/** Flat `name → CSS value` map per theme, fully resolved. */
export function flatJson(set: TokenSet, theme: string): string {
  const out: Record<string, unknown> = {};
  for (const t of tokensFor(set, theme)) {
    if (t.type === "typography") {
      const v = t.resolved as Typography;
      out[t.name] = {
        fontFamily: resolvedCss({ type: "fontFamily", extensions: {} }, v.fontFamily),
        fontSize: resolvedCss({ type: "dimension", extensions: {} }, v.fontSize),
        fontWeight: v.fontWeight,
        lineHeight: v.lineHeight,
        letterSpacing: resolvedCss({ type: "dimension", extensions: {} }, v.letterSpacing),
        ...(t.extensions.textTransform ? { textTransform: t.extensions.textTransform } : {}),
      };
    } else {
      out[t.name] = resolvedCss({ ...t, extensions: {} }, t.resolved);
    }
  }
  return stringify(out);
}

function dtcgValue(t: ResolvedToken): unknown {
  const color = (hex: string) => toDtcgColor(hex);
  switch (t.type) {
    case "color":
      return color(t.resolved as string);
    case "shadow": {
      const layers = (Array.isArray(t.resolved) ? t.resolved : [t.resolved]) as Shadow[];
      const mapped = layers.map((l) => ({ ...l, color: color(l.color) }));
      return mapped.length === 1 ? mapped[0] : mapped;
    }
    default:
      return t.resolved;
  }
}

/** Spec-conformant DTCG (2025.10) document per theme with every alias resolved. */
export function dtcgJson(set: TokenSet, theme: string): string {
  const root: Record<string, unknown> = {};
  for (const t of tokensFor(set, theme)) {
    let node = root;
    for (const segment of t.path.slice(0, -1)) {
      node[segment] ??= {};
      node = node[segment] as Record<string, unknown>;
    }
    node[t.path.at(-1) as string] = {
      $type: t.type,
      $value: dtcgValue(t),
      ...(t.description ? { $description: t.description } : {}),
    };
  }
  return stringify(root);
}

type FigmaType = "COLOR" | "FLOAT" | "STRING";

function figmaVariableType(t: ResolvedToken): FigmaType | null {
  switch (t.type) {
    case "color":
      return "COLOR";
    case "dimension":
    case "number":
    case "fontWeight":
      return "FLOAT";
    case "fontFamily":
      return "STRING";
    default:
      return null;
  }
}

function figmaValue(t: ResolvedToken): string | number {
  switch (t.type) {
    case "color":
      return t.resolved as string;
    case "dimension": {
      const d = t.resolved as Dimension;
      // Figma variables are unitless pixels; rem assumes a 16px root.
      return d.unit === "rem" ? d.value * 16 : d.value;
    }
    case "fontFamily":
      return (t.resolved as string[])[0] ?? "";
    default:
      return t.resolved as number;
  }
}

function figmaScopes(t: ResolvedToken): string[] {
  const root = t.path[0];
  if (t.type === "color") {
    if (t.path.includes("foreground")) return ["TEXT_FILL", "SHAPE_FILL"];
    if (
      root === "color" &&
      (t.path[1] === "border" || t.path[1] === "input" || t.path[1] === "ring")
    )
      return ["STROKE_COLOR"];
    return t.layer === "primitive" ? [] : ["FRAME_FILL", "SHAPE_FILL", "STROKE_COLOR", "TEXT_FILL"];
  }
  if (root === "radius" || t.path.includes("radius")) return ["CORNER_RADIUS"];
  if (
    root === "spacing" ||
    root === "space" ||
    t.path.includes("padding") ||
    t.path.includes("padding-x")
  )
    return ["GAP", "WIDTH_HEIGHT"];
  if (t.path.includes("height") || root === "size") return ["WIDTH_HEIGHT"];
  if (root === "border-width" || root === "focus") return ["STROKE_FLOAT"];
  if (root === "opacity") return ["OPACITY"];
  if (t.type === "fontFamily") return ["FONT_FAMILY"];
  if (t.type === "fontWeight") return ["FONT_WEIGHT"];
  if (t.path[1] === "size") return ["FONT_SIZE"];
  if (t.path[1] === "line-height") return [];
  if (t.path[1] === "letter-spacing") return ["LETTER_SPACING"];
  return [];
}

/**
 * Manifest consumed by the Figma sync script: variable collections (primitives, theme modes,
 * semantic scales), text styles and effect styles, all named after their token paths.
 */
export function figmaJson(set: TokenSet): string {
  const variable = (t: ResolvedToken, value: unknown) => ({
    name: figmaName(t),
    token: t.name,
    type: figmaVariableType(t),
    cssVar: cssVarName(t),
    scopes: figmaScopes(t),
    description: t.description ?? "",
    value,
  });
  const valueOrAlias = (t: ResolvedToken) =>
    t.aliasOf ? { alias: t.aliasOf.split(".").join("/") } : figmaValue(t);

  const primitives = set.base.filter((t) => t.layer === "primitive" && figmaVariableType(t));
  const semantic = set.base.filter((t) => t.layer !== "primitive" && figmaVariableType(t));
  const themeNames = set.themed[set.defaultTheme] ?? [];

  const theme = themeNames
    .filter((t) => figmaVariableType(t))
    .map((t) => ({
      ...variable(t, null),
      valuesByMode: Object.fromEntries(
        set.themes.map((mode) => {
          const match = (set.themed[mode] ?? []).find((m) => m.name === t.name);
          return [mode, match ? valueOrAlias(match) : null];
        }),
      ),
    }));

  const textStyles = set.base
    .filter((t) => t.type === "typography")
    .map((t) => {
      const v = t.resolved as Typography;
      return {
        name: figmaName(t),
        token: t.name,
        utility: `text-${textStyleName(t)}`,
        fontFamily: v.fontFamily[0],
        fontWeight: v.fontWeight,
        fontSize: v.fontSize.unit === "rem" ? v.fontSize.value * 16 : v.fontSize.value,
        lineHeight: v.lineHeight,
        letterSpacingEm: v.letterSpacing.unit === "em" ? v.letterSpacing.value : 0,
        textCase: t.extensions.textTransform === "uppercase" ? "UPPER" : "ORIGINAL",
        description: t.description ?? "",
      };
    });

  const effects = set.themes.flatMap((mode) =>
    (set.themed[mode] ?? [])
      .filter((t) => t.type === "shadow")
      .map((t) => ({ name: `${mode}/${figmaName(t)}`, token: t.name, value: t.resolved })),
  );
  const glows = set.base
    .filter((t) => t.type === "shadow" && t.path[1] === "glow")
    .map((t) => ({ name: figmaName(t), token: t.name, value: t.resolved }));

  return stringify({
    collections: [
      {
        name: "Primitives",
        modes: ["Value"],
        variables: primitives.map((t) => variable(t, valueOrAlias(t))),
      },
      {
        name: "Theme",
        modes: set.themes.map((t) => t[0]?.toUpperCase() + t.slice(1)),
        modeKeys: set.themes,
        variables: theme,
      },
      {
        name: "Semantic",
        modes: ["Value"],
        variables: semantic.map((t) => variable(t, valueOrAlias(t))),
      },
    ],
    textStyles,
    effectStyles: [...effects, ...glows],
  });
}

/** Rich metadata for documentation tables in Storybook and Markdown. */
export function docsJson(set: TokenSet): string {
  const describeColor = (hex: string) => {
    const rgba = parseHex(hex);
    return { hex: toHex(rgba), alpha: rgba.a, rgb: toRgbString(rgba), hsl: toHslString(rgba) };
  };
  const entry = (t: ResolvedToken, lookup: Lookup) => ({
    css: declarations(t, lookup)[0]?.[1] ?? "",
    resolved: resolvedCss(t, t.resolved),
    alias: t.aliasOf ?? null,
    ...(t.type === "color" ? { color: describeColor(t.resolved as string) } : {}),
    ...(t.type === "typography" ? { typography: t.resolved, fluidMin: t.fluidMin ?? null } : {}),
  });

  const baseLookup: Lookup = new Map(set.base.map((t) => [t.name, t]));
  const meta = (t: ResolvedToken) => ({
    name: t.name,
    path: t.path,
    type: t.type,
    layer: t.layer,
    description: t.description ?? "",
    source: t.source,
    cssVar: cssVarName(t),
    figma: figmaName(t),
    tailwind: isSemanticColor(t)
      ? `bg-${tailwindColorName(t)} · text-${tailwindColorName(t)}`
      : t.type === "typography"
        ? `text-${textStyleName(t)}`
        : null,
    extensions: t.extensions,
  });

  const tokens = [
    ...set.base.map((t) => ({ ...meta(t), themed: false, values: { all: entry(t, baseLookup) } })),
    ...(set.themed[set.defaultTheme] ?? []).map((t) => ({
      ...meta(t),
      themed: true,
      values: Object.fromEntries(
        set.themes.map((theme) => {
          const lookup: Lookup = new Map(
            [...set.base, ...(set.themed[theme] ?? [])].map((x) => [x.name, x]),
          );
          const match = (set.themed[theme] ?? []).find((m) => m.name === t.name) as ResolvedToken;
          return [theme, entry(match, lookup)];
        }),
      ),
    })),
  ];

  return stringify({
    themes: set.themes,
    defaultTheme: set.defaultTheme,
    tokens,
    contrast: set.contrast,
  });
}
