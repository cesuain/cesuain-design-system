/**
 * Typed access to the generated token documentation (`@cesuain/tokens/json/docs.json`).
 * Every foundation page renders from this data, so the docs can never drift from the tokens.
 */
import docs from "@cesuain/tokens/json/docs.json";

export type ThemeName = "dark" | "light";

export type ColorValue = { hex: string; alpha: number; rgb: string; hsl: string };

export type TypographyValue = {
  fontFamily: string[];
  fontSize: { value: number; unit: string };
  fontWeight: number;
  lineHeight: number;
  letterSpacing: { value: number; unit: string };
};

export type TokenValue = {
  css: string;
  resolved: string;
  alias: string | null;
  color?: ColorValue;
  typography?: TypographyValue;
};

export type Token = {
  name: string;
  path: string[];
  type: string;
  layer: "primitive" | "semantic" | "component";
  description: string;
  source: string;
  cssVar: string;
  figma: string;
  tailwind: string | null;
  extensions: Record<string, unknown>;
  themed: boolean;
  values: Partial<Record<ThemeName | "all", TokenValue>>;
};

export type ContrastCheck = {
  foreground: string;
  background: string;
  minimum: number;
  usage: string;
  theme: ThemeName;
  ratio: number;
  pass: boolean;
};

const data = docs as unknown as {
  themes: ThemeName[];
  defaultTheme: ThemeName;
  tokens: Token[];
  contrast: ContrastCheck[];
};

export const themes = data.themes;
export const defaultTheme = data.defaultTheme;
export const tokens = data.tokens;
export const contrastChecks = data.contrast;

/** Tokens whose dotted name starts with `prefix` (e.g. `"color.sky"`), in source order. */
export function tokensUnder(prefix: string, layer?: Token["layer"]): Token[] {
  return tokens.filter(
    (token) =>
      (token.name === prefix || token.name.startsWith(`${prefix}.`)) &&
      (!layer || token.layer === layer),
  );
}

export function tokenByName(name: string): Token {
  const token = tokens.find((candidate) => candidate.name === name);
  if (!token) throw new Error(`Unknown token "${name}"`);
  return token;
}

/** The value for a theme, falling back to the theme-independent value. */
export function valueFor(token: Token, theme: ThemeName = defaultTheme): TokenValue {
  const value = token.values[theme] ?? token.values.all;
  if (!value) throw new Error(`Token "${token.name}" has no value for theme "${theme}"`);
  return value;
}

/** Groups tokens by the path segment at `depth`, keeping first-seen order. */
export function groupBy(list: Token[], depth: number): [string, Token[]][] {
  const groups = new Map<string, Token[]>();
  for (const token of list) {
    const key = token.path[depth] ?? token.name;
    groups.set(key, [...(groups.get(key) ?? []), token]);
  }
  return [...groups];
}

/** Converts a rem or px dimension to pixels (1rem = 16px). */
export function toPx(dimension: string): number {
  const match = /^(-?[\d.]+)(rem|px)$/.exec(dimension);
  if (!match) return Number.NaN;
  return Number(match[1]) * (match[2] === "rem" ? 16 : 1);
}
