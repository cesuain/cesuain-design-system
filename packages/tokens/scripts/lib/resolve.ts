import { composite, contrastRatio, parseHex, toHex } from "./color.ts";
import { aliasTarget, isAlias, parseSources, type SourceFiles } from "./parse.ts";
import {
  LAYER_RANK,
  TokenValidationError,
  type ContrastPair,
  type ContrastResult,
  type Dimension,
  type RawToken,
  type ResolvedToken,
  type ResolvedValue,
  type TokenSet,
  type TokenType,
} from "./types.ts";

const DEFAULT_THEME = "dark";

/** Expected types for properties of composite tokens. */
const COMPOSITE_PROPERTY_TYPES: Partial<Record<TokenType, Record<string, TokenType>>> = {
  typography: {
    fontFamily: "fontFamily",
    fontSize: "dimension",
    fontWeight: "fontWeight",
    lineHeight: "number",
    letterSpacing: "dimension",
  },
  shadow: {
    color: "color",
    offsetX: "dimension",
    offsetY: "dimension",
    blur: "dimension",
    spread: "dimension",
  },
};

function normalize(type: TokenType, value: unknown): ResolvedValue {
  if (type === "color" && typeof value === "object" && value !== null && "components" in value) {
    const { components, alpha } = value as { components: number[]; alpha?: number };
    const [r = 0, g = 0, b = 0] = components.map((c) => Math.round(c * 255));
    const hex = toHex({ r, g, b, a: 1 });
    return alpha === undefined || alpha === 1
      ? hex
      : `${hex}${Math.round(alpha * 255)
          .toString(16)
          .padStart(2, "0")}`;
  }
  if (type === "color" && typeof value === "string") return value.toLowerCase();
  if (type === "fontFamily" && typeof value === "string") return [value];
  if (type === "fontWeight" && typeof value === "string") return value === "bold" ? 700 : 400;
  return value as ResolvedValue;
}

class Resolver {
  private readonly cache = new Map<string, ResolvedValue>();
  private readonly byName: Map<string, RawToken>;
  private readonly issues: string[];
  private readonly reported = new Set<string>();

  constructor(tokens: RawToken[], issues: string[]) {
    this.byName = new Map(tokens.map((t) => [t.name, t]));
    this.issues = issues;
  }

  private report(issue: string) {
    if (!this.reported.has(issue)) {
      this.reported.add(issue);
      this.issues.push(issue);
    }
  }

  /** Resolves an alias reference, enforcing existence, type compatibility, layering and acyclicity. */
  private follow(
    ref: string,
    expected: TokenType,
    from: RawToken,
    where: string,
    stack: string[],
  ): ResolvedValue | undefined {
    const target = this.byName.get(ref);
    if (!target) {
      const hint = [...this.byName.keys()].find((n) => n.endsWith(ref.split(".").pop() ?? ""));
      this.report(
        `${where}: references {${ref}}, which does not exist${hint ? ` (did you mean {${hint}}?)` : ""} [${from.source}]`,
      );
      return undefined;
    }
    if (target.type !== expected) {
      this.report(
        `${where}: references {${ref}} of type "${target.type}" where "${expected}" is required [${from.source}]`,
      );
      return undefined;
    }
    if (LAYER_RANK[target.layer] > LAYER_RANK[from.layer]) {
      this.report(
        `${where}: a ${from.layer} token cannot reference the ${target.layer} token {${ref}} [${from.source}]`,
      );
      return undefined;
    }
    if (stack.includes(ref)) {
      this.report(`Circular alias: ${[...stack.slice(stack.indexOf(ref)), ref].join(" → ")}`);
      return undefined;
    }
    return this.resolve(target, [...stack, ref]);
  }

  resolve(token: RawToken, stack: string[] = [token.name]): ResolvedValue | undefined {
    const cached = this.cache.get(token.name);
    if (cached !== undefined) return cached;

    let result: ResolvedValue | undefined;
    if (isAlias(token.value)) {
      result = this.follow(aliasTarget(token.value), token.type, token, token.name, stack);
    } else {
      const propertyTypes = COMPOSITE_PROPERTY_TYPES[token.type];
      if (propertyTypes && typeof token.value === "object" && token.value !== null) {
        const resolveLayer = (layer: Record<string, unknown>, prefix: string) => {
          const out: Record<string, unknown> = {};
          let ok = true;
          for (const [key, value] of Object.entries(layer)) {
            const expected = propertyTypes[key];
            if (expected && isAlias(value)) {
              const resolved = this.follow(
                aliasTarget(value),
                expected,
                token,
                `${prefix}.${key}`,
                stack,
              );
              if (resolved === undefined) ok = false;
              out[key] = resolved;
            } else {
              out[key] = expected ? normalize(expected, value) : value;
            }
          }
          return ok ? out : undefined;
        };
        if (Array.isArray(token.value)) {
          const layers = token.value.map((layer, i) =>
            resolveLayer(layer as Record<string, unknown>, `${token.name}[${i}]`),
          );
          result = layers.every(Boolean) ? (layers as unknown as ResolvedValue) : undefined;
        } else {
          result = resolveLayer(token.value as Record<string, unknown>, token.name) as
            ResolvedValue | undefined;
        }
      } else {
        result = normalize(token.type, token.value);
      }
    }

    if (result !== undefined) this.cache.set(token.name, result);
    return result;
  }

  finalize(token: RawToken): ResolvedToken | undefined {
    const resolved = this.resolve(token);
    if (resolved === undefined) return undefined;
    const propertyAliases: Record<string, string> = {};
    if (
      !isAlias(token.value) &&
      typeof token.value === "object" &&
      token.value !== null &&
      !Array.isArray(token.value)
    ) {
      for (const [key, value] of Object.entries(token.value)) {
        if (isAlias(value)) propertyAliases[key] = aliasTarget(value);
      }
    }
    let fluidMin: Dimension | undefined;
    const rawMin = token.extensions.fluidMin;
    if (rawMin !== undefined) {
      fluidMin = isAlias(rawMin)
        ? (this.follow(aliasTarget(rawMin), "dimension", token, `${token.name}.fluidMin`, [
            token.name,
          ]) as Dimension | undefined)
        : (rawMin as Dimension);
    }
    return {
      ...token,
      resolved,
      aliasOf: isAlias(token.value) ? aliasTarget(token.value) : undefined,
      propertyAliases,
      fluidMin,
    };
  }
}

function readContrastPairs(files: SourceFiles, issues: string[]): ContrastPair[] {
  const meta = files["src/meta/contrast.json"] as { pairs?: unknown } | undefined;
  if (!meta) return [];
  if (!Array.isArray(meta.pairs)) {
    issues.push(`src/meta/contrast.json: "pairs" must be an array`);
    return [];
  }
  const pairs: ContrastPair[] = [];
  meta.pairs.forEach((pair, i) => {
    const p = pair as Partial<ContrastPair>;
    if (
      typeof p.foreground !== "string" ||
      typeof p.background !== "string" ||
      typeof p.minimum !== "number" ||
      typeof p.usage !== "string"
    ) {
      issues.push(
        `src/meta/contrast.json → pairs[${i}]: expected {foreground, background, minimum, usage}`,
      );
      return;
    }
    pairs.push(p as ContrastPair);
  });
  return pairs;
}

function evaluateContrast(
  pairs: ContrastPair[],
  theme: string,
  lookup: Map<string, ResolvedToken>,
  issues: string[],
): ContrastResult[] {
  const canvas = lookup.get("color.background.default");
  const results: ContrastResult[] = [];
  for (const pair of pairs) {
    const fg = lookup.get(pair.foreground);
    const bg = lookup.get(pair.background);
    if (!fg || !bg || fg.type !== "color" || bg.type !== "color") {
      issues.push(
        `Contrast pair "${pair.usage}": ${!fg || fg.type !== "color" ? pair.foreground : pair.background} is not a color token in theme "${theme}"`,
      );
      continue;
    }
    let background = parseHex(bg.resolved as string);
    if (background.a < 1) {
      if (!canvas) {
        issues.push(
          `Contrast pair "${pair.usage}": translucent background needs color.background.default`,
        );
        continue;
      }
      background = composite(background, parseHex(canvas.resolved as string));
    }
    const foreground = composite(parseHex(fg.resolved as string), background);
    const ratio = contrastRatio(foreground, background);
    const pass = ratio >= pair.minimum;
    if (!pass) {
      issues.push(
        `Contrast (${theme}): ${pair.foreground} on ${pair.background} is ${ratio}:1, below the required ${pair.minimum}:1 for "${pair.usage}"`,
      );
    }
    results.push({ ...pair, theme, ratio, pass });
  }
  return results;
}

/** Parses, validates and resolves the canonical sources. Throws TokenValidationError on any issue. */
export function resolveTokens(files: SourceFiles): TokenSet {
  const issues: string[] = [];
  const raw = parseSources(files, issues);

  const base = raw.filter((t) => !t.theme);
  const themes = [...new Set(raw.filter((t) => t.theme).map((t) => t.theme as string))].sort(
    (a, b) => (a === DEFAULT_THEME ? -1 : b === DEFAULT_THEME ? 1 : a.localeCompare(b)),
  );
  if (themes.length === 0)
    issues.push(`No themes found. Add token files under src/themes/<theme>/.`);
  if (themes.length > 0 && !themes.includes(DEFAULT_THEME)) {
    issues.push(`The default theme "${DEFAULT_THEME}" is missing from src/themes/.`);
  }

  // Every theme must define exactly the same token names.
  const namesByTheme = new Map(
    themes.map((theme) => [
      theme,
      new Set(raw.filter((t) => t.theme === theme).map((t) => t.name)),
    ]),
  );
  for (const theme of themes) {
    for (const other of themes) {
      if (theme === other) continue;
      for (const name of namesByTheme.get(theme) ?? []) {
        if (!namesByTheme.get(other)?.has(name)) {
          issues.push(`Theme parity: "${name}" exists in theme "${theme}" but not in "${other}"`);
        }
      }
    }
  }

  const pairs = readContrastPairs(files, issues);
  const resolvedBase: ResolvedToken[] = [];
  const themed: Record<string, ResolvedToken[]> = {};
  const contrast: ContrastResult[] = [];
  const baseResolver = new Resolver(base, issues);
  for (const token of base) {
    const resolved = baseResolver.finalize(token);
    if (resolved) resolvedBase.push(resolved);
  }

  for (const theme of themes) {
    const themeTokens = raw.filter((t) => t.theme === theme);
    const resolver = new Resolver([...base, ...themeTokens], issues);
    themed[theme] = [];
    for (const token of themeTokens) {
      const resolved = resolver.finalize(token);
      if (resolved) themed[theme].push(resolved);
    }
    const lookup = new Map([...resolvedBase, ...themed[theme]].map((t) => [t.name, t]));
    contrast.push(...evaluateContrast(pairs, theme, lookup, issues));
  }

  if (issues.length > 0) throw new TokenValidationError(issues);
  return { themes, defaultTheme: DEFAULT_THEME, base: resolvedBase, themed, contrast };
}
