export const TOKEN_TYPES = [
  "color",
  "dimension",
  "fontFamily",
  "fontWeight",
  "duration",
  "cubicBezier",
  "number",
  "shadow",
  "typography",
] as const;

export type TokenType = (typeof TOKEN_TYPES)[number];

/** Which tier of the architecture a token belongs to. Lower tiers may never alias higher ones. */
export type Layer = "primitive" | "semantic" | "component";

export const LAYER_RANK: Record<Layer, number> = { primitive: 0, semantic: 1, component: 2 };

export type DimensionUnit = "px" | "rem" | "em" | "%" | "vw" | "vh";

export interface Dimension {
  value: number;
  unit: DimensionUnit;
}

export interface Duration {
  value: number;
  unit: "ms" | "s";
}

export interface Shadow {
  color: string;
  offsetX: Dimension;
  offsetY: Dimension;
  blur: Dimension;
  spread: Dimension;
  inset?: boolean;
}

export interface Typography {
  fontFamily: string[];
  fontSize: Dimension;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: Dimension;
}

export type ResolvedValue =
  string | number | string[] | number[] | Dimension | Duration | Shadow | Shadow[] | Typography;

/** Extension namespace used by this design system (reverse-domain, per the DTCG spec). */
export const EXTENSION_KEY = "dev.cesuain";

export interface CesuainExtensions {
  /** CSS custom property provided by the host app's font loader, e.g. next/font. */
  cssVariable?: string;
  textTransform?: "uppercase" | "none";
  /** Lower bound for fluid typography; the token's fontSize is the upper bound. */
  fluidMin?: string | Dimension;
}

export interface RawToken {
  /** Path segments, e.g. ["color", "neutral", "975"]. */
  path: string[];
  /** Dot-joined path, e.g. "color.neutral.975". */
  name: string;
  type: TokenType;
  value: unknown;
  description?: string;
  extensions: CesuainExtensions;
  layer: Layer;
  /** `undefined` for theme-independent tokens. */
  theme?: string;
  /** Source file relative to the package root. */
  source: string;
}

export interface ResolvedToken extends RawToken {
  resolved: ResolvedValue;
  /** Present when the whole value is an alias, e.g. "color.neutral.975". */
  aliasOf?: string;
  /** Aliases used by individual properties of composite values. */
  propertyAliases: Record<string, string>;
  /** Resolved fluid minimum for typography tokens. */
  fluidMin?: Dimension;
}

export interface ContrastPair {
  foreground: string;
  background: string;
  minimum: number;
  usage: string;
}

export interface ContrastResult extends ContrastPair {
  theme: string;
  ratio: number;
  pass: boolean;
}

export interface TokenSet {
  themes: string[];
  defaultTheme: string;
  /** Theme-independent tokens (primitives, shared semantics, components). */
  base: ResolvedToken[];
  /** Theme-specific semantic tokens, keyed by theme name. */
  themed: Record<string, ResolvedToken[]>;
  contrast: ContrastResult[];
}

/** Thrown with every problem found, so authors can fix them in one pass. */
export class TokenValidationError extends Error {
  readonly issues: string[];

  constructor(issues: string[]) {
    super(
      `Token validation failed with ${issues.length} issue(s):\n${issues
        .map((issue) => `  • ${issue}`)
        .join("\n")}`,
    );
    this.name = "TokenValidationError";
    this.issues = issues;
  }
}
