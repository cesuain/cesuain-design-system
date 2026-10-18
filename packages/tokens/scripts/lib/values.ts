import { cssVarName } from "./naming.ts";
import type {
  Dimension,
  Duration,
  ResolvedToken,
  ResolvedValue,
  Shadow,
  Typography,
} from "./types.ts";

const GENERIC_FAMILIES = new Set([
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui",
  "ui-sans-serif",
  "ui-serif",
  "ui-monospace",
  "ui-rounded",
  "emoji",
  "math",
  "fangsong",
]);

const round = (n: number) => Math.round(n * 10000) / 10000;

export function dimension({ value, unit }: Dimension): string {
  return `${round(value)}${unit}`;
}

export function duration({ value, unit }: Duration): string {
  return `${value}${unit}`;
}

export function fontFamily(families: string[], cssVariable?: string): string {
  const quoted = families.map((f) => (GENERIC_FAMILIES.has(f) ? f : `"${f}"`));
  if (cssVariable && quoted.length > 0) {
    const [first, ...rest] = quoted;
    return [`var(${cssVariable}, ${first})`, ...rest].join(", ");
  }
  return quoted.join(", ");
}

export function shadow(value: Shadow | Shadow[]): string {
  const layers = Array.isArray(value) ? value : [value];
  return layers
    .map(
      (l) =>
        `${l.inset ? "inset " : ""}${dimension(l.offsetX)} ${dimension(l.offsetY)} ${dimension(l.blur)} ${dimension(l.spread)} ${l.color}`,
    )
    .join(", ");
}

/** Viewport range used for fluid type: 360px → 1280px. */
const FLUID_MIN_VW = 22.5;
const FLUID_MAX_VW = 80;

/** clamp() that grows linearly from `min` at 360px to `max` at 1280px. Both must be rem. */
export function fluid(min: Dimension, max: Dimension): string {
  if (min.unit !== "rem" || max.unit !== "rem") {
    throw new Error(
      `Fluid typography requires rem values (got ${dimension(min)} and ${dimension(max)})`,
    );
  }
  const slope = (max.value - min.value) / (FLUID_MAX_VW - FLUID_MIN_VW);
  const intercept = min.value - slope * FLUID_MIN_VW;
  return `clamp(${dimension(min)}, ${round(intercept)}rem + ${round(slope * 100)}vw, ${dimension(max)})`;
}

/** Fully resolved CSS value with no var() references. */
export function resolvedCss(
  token: Pick<ResolvedToken, "type" | "extensions">,
  value: ResolvedValue,
): string {
  switch (token.type) {
    case "color":
      return value as string;
    case "dimension":
      return dimension(value as Dimension);
    case "duration":
      return duration(value as Duration);
    case "fontFamily":
      return fontFamily(value as string[], token.extensions.cssVariable);
    case "fontWeight":
    case "number":
      return String(value);
    case "cubicBezier":
      return `cubic-bezier(${(value as number[]).join(", ")})`;
    case "shadow":
      return shadow(value as Shadow | Shadow[]);
    case "typography": {
      const t = value as Typography;
      return `${t.fontWeight} ${dimension(t.fontSize)}/${t.lineHeight} ${fontFamily(t.fontFamily)}`;
    }
  }
}

export type Lookup = Map<string, ResolvedToken>;

function ref(name: string, lookup: Lookup): string {
  const target = lookup.get(name);
  if (!target) throw new Error(`Unknown token ${name}`);
  return `var(${cssVarName(target)})`;
}

/** Custom properties emitted for a token. Aliases become var() references to keep the chain visible. */
export function declarations(token: ResolvedToken, lookup: Lookup): [string, string][] {
  const name = cssVarName(token);
  if (token.type === "typography") {
    const t = token.resolved as Typography;
    const a = token.propertyAliases;
    const fontSize =
      token.fluidMin !== undefined
        ? fluid(token.fluidMin, t.fontSize)
        : a.fontSize
          ? ref(a.fontSize, lookup)
          : dimension(t.fontSize);
    const pick = (key: keyof Typography, literal: string) =>
      a[key] ? ref(a[key], lookup) : literal;
    return [
      [`${name}-font-family`, pick("fontFamily", fontFamily(t.fontFamily))],
      [`${name}-font-size`, fontSize],
      [`${name}-font-weight`, pick("fontWeight", String(t.fontWeight))],
      [`${name}-line-height`, pick("lineHeight", String(t.lineHeight))],
      [`${name}-letter-spacing`, pick("letterSpacing", dimension(t.letterSpacing))],
      ...(token.extensions.textTransform
        ? ([[`${name}-text-transform`, token.extensions.textTransform]] as [string, string][])
        : []),
    ];
  }
  if (token.aliasOf) return [[name, ref(token.aliasOf, lookup)]];
  return [[name, resolvedCss(token, token.resolved)]];
}
