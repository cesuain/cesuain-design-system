import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import { isHexColor } from "./color.ts";
import {
  EXTENSION_KEY,
  TOKEN_TYPES,
  type CesuainExtensions,
  type Layer,
  type RawToken,
  type TokenType,
} from "./types.ts";

/** In-memory view of the canonical sources: relative path → parsed JSON. */
export type SourceFiles = Record<string, unknown>;

export const ALIAS = /^\{([a-z0-9-]+(?:\.[a-z0-9-]+)*)\}$/;
const SEGMENT = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TOKEN_KEYS = new Set(["$value", "$type", "$description", "$extensions", "$deprecated"]);
const GROUP_KEYS = new Set(["$type", "$description", "$extensions"]);
const DIMENSION_UNITS = new Set(["px", "rem", "em", "%", "vw", "vh"]);
const FONT_WEIGHT_KEYWORDS = new Set(["normal", "bold"]);

/** Reads every *.json file below `src/` into a SourceFiles map with stable ordering. */
export function readSources(packageRoot: string): SourceFiles {
  const srcDir = join(packageRoot, "src");
  const files: SourceFiles = {};
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir).sort()) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (entry.endsWith(".json")) {
        const rel = relative(packageRoot, full);
        try {
          files[rel] = JSON.parse(readFileSync(full, "utf8"));
        } catch (error) {
          throw new Error(`${rel}: invalid JSON (${(error as Error).message})`, { cause: error });
        }
      }
    }
  };
  walk(srcDir);
  return files;
}

interface Classified {
  layer: Layer;
  theme?: string;
}

/** Maps a source path to its architectural layer and theme. */
export function classify(file: string): Classified | "meta" | null {
  const parts = file.split("/");
  if (parts[0] !== "src") return null;
  switch (parts[1]) {
    case "primitives":
      return { layer: "primitive" };
    case "semantic":
      return { layer: "semantic" };
    case "components":
      return { layer: "component" };
    case "themes":
      return parts.length >= 4 && parts[2] ? { layer: "semantic", theme: parts[2] } : null;
    case "meta":
      return "meta";
    default:
      return null;
  }
}

export function isAlias(value: unknown): value is string {
  return typeof value === "string" && ALIAS.test(value);
}

export function aliasTarget(value: string): string {
  return ALIAS.exec(value)?.[1] ?? "";
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function checkDimension(value: unknown, where: string, issues: string[], allowAlias = true) {
  if (allowAlias && isAlias(value)) return;
  if (
    !isObject(value) ||
    typeof value.value !== "number" ||
    !Number.isFinite(value.value) ||
    typeof value.unit !== "string" ||
    !DIMENSION_UNITS.has(value.unit)
  ) {
    issues.push(
      `${where}: expected a dimension like {"value": 1, "unit": "rem"} (units: ${[
        ...DIMENSION_UNITS,
      ].join(", ")}), got ${JSON.stringify(value)}`,
    );
  }
}

function checkColor(value: unknown, where: string, issues: string[]) {
  if (isAlias(value) || isHexColor(value)) return;
  if (
    isObject(value) &&
    value.colorSpace === "srgb" &&
    Array.isArray(value.components) &&
    value.components.length === 3 &&
    value.components.every((c) => typeof c === "number" && c >= 0 && c <= 1)
  ) {
    return;
  }
  issues.push(
    `${where}: expected a hex color (#rrggbb or #rrggbbaa) or a DTCG srgb color object, got ${JSON.stringify(value)}`,
  );
}

function checkShadowLayer(value: unknown, where: string, issues: string[]) {
  if (!isObject(value)) {
    issues.push(`${where}: expected a shadow object, got ${JSON.stringify(value)}`);
    return;
  }
  checkColor(value.color, `${where}.color`, issues);
  for (const key of ["offsetX", "offsetY", "blur", "spread"]) {
    checkDimension(value[key], `${where}.${key}`, issues);
  }
  if (value.inset !== undefined && typeof value.inset !== "boolean") {
    issues.push(`${where}.inset: expected a boolean`);
  }
}

/** Validates a non-alias value against its declared type. */
export function checkValue(type: TokenType, value: unknown, where: string, issues: string[]) {
  if (isAlias(value)) return;
  switch (type) {
    case "color":
      checkColor(value, where, issues);
      break;
    case "dimension":
      checkDimension(value, where, issues);
      break;
    case "duration":
      if (
        !isObject(value) ||
        typeof value.value !== "number" ||
        value.value < 0 ||
        (value.unit !== "ms" && value.unit !== "s")
      ) {
        issues.push(
          `${where}: expected a duration like {"value": 200, "unit": "ms"}, got ${JSON.stringify(value)}`,
        );
      }
      break;
    case "fontFamily":
      if (
        !(typeof value === "string" && value.length > 0) &&
        !(
          Array.isArray(value) &&
          value.length > 0 &&
          value.every((v) => typeof v === "string" && v.length > 0)
        )
      ) {
        issues.push(`${where}: expected a font family name or a non-empty array of names`);
      }
      break;
    case "fontWeight":
      if (
        !(typeof value === "number" && value >= 1 && value <= 1000) &&
        !(typeof value === "string" && FONT_WEIGHT_KEYWORDS.has(value))
      ) {
        issues.push(
          `${where}: expected a font weight between 1 and 1000, got ${JSON.stringify(value)}`,
        );
      }
      break;
    case "number":
      if (typeof value !== "number" || !Number.isFinite(value)) {
        issues.push(`${where}: expected a number, got ${JSON.stringify(value)}`);
      }
      break;
    case "cubicBezier":
      if (
        !Array.isArray(value) ||
        value.length !== 4 ||
        !value.every((v) => typeof v === "number") ||
        (value[0] as number) < 0 ||
        (value[0] as number) > 1 ||
        (value[2] as number) < 0 ||
        (value[2] as number) > 1
      ) {
        issues.push(
          `${where}: expected [x1, y1, x2, y2] with x values between 0 and 1, got ${JSON.stringify(value)}`,
        );
      }
      break;
    case "shadow":
      if (Array.isArray(value)) {
        value.forEach((layer, i) => checkShadowLayer(layer, `${where}[${i}]`, issues));
      } else {
        checkShadowLayer(value, where, issues);
      }
      break;
    case "typography": {
      if (!isObject(value)) {
        issues.push(`${where}: expected a typography object`);
        break;
      }
      const required = ["fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing"];
      for (const key of required) {
        if (!(key in value)) issues.push(`${where}: typography is missing "${key}"`);
      }
      for (const key of Object.keys(value)) {
        if (!required.includes(key))
          issues.push(`${where}: unsupported typography property "${key}"`);
      }
      if ("fontFamily" in value)
        checkValue("fontFamily", value.fontFamily, `${where}.fontFamily`, issues);
      if ("fontSize" in value) checkDimension(value.fontSize, `${where}.fontSize`, issues);
      if ("fontWeight" in value)
        checkValue("fontWeight", value.fontWeight, `${where}.fontWeight`, issues);
      if ("lineHeight" in value)
        checkValue("number", value.lineHeight, `${where}.lineHeight`, issues);
      if ("letterSpacing" in value)
        checkDimension(value.letterSpacing, `${where}.letterSpacing`, issues);
      break;
    }
  }
}

function readExtensions(raw: unknown, where: string, issues: string[]): CesuainExtensions {
  if (raw === undefined) return {};
  if (!isObject(raw)) {
    issues.push(`${where}: $extensions must be an object`);
    return {};
  }
  const ours = raw[EXTENSION_KEY];
  if (ours === undefined) return {};
  if (!isObject(ours)) {
    issues.push(`${where}: $extensions["${EXTENSION_KEY}"] must be an object`);
    return {};
  }
  const result: CesuainExtensions = {};
  for (const [key, value] of Object.entries(ours)) {
    if (key === "cssVariable" && typeof value === "string" && value.startsWith("--")) {
      result.cssVariable = value;
    } else if (key === "textTransform" && (value === "uppercase" || value === "none")) {
      result.textTransform = value;
    } else if (key === "fluidMin") {
      checkDimension(value, `${where}.$extensions.fluidMin`, issues);
      result.fluidMin = value as CesuainExtensions["fluidMin"];
    } else {
      issues.push(
        `${where}: unsupported extension "${EXTENSION_KEY}.${key}" = ${JSON.stringify(value)}`,
      );
    }
  }
  return result;
}

/**
 * Flattens every token file into RawTokens, enforcing naming, structure,
 * type inheritance and value shape. Collects all issues instead of failing fast.
 */
export function parseSources(files: SourceFiles, issues: string[]): RawToken[] {
  const tokens: RawToken[] = [];
  const seen = new Map<string, string>();

  for (const [file, json] of Object.entries(files)) {
    const kind = classify(file);
    if (kind === "meta") continue;
    if (kind === null) {
      issues.push(
        `${file}: files must live in src/primitives, src/semantic, src/components, src/themes/<theme> or src/meta`,
      );
      continue;
    }

    const walk = (node: unknown, path: string[], inheritedType: TokenType | undefined) => {
      const where = `${file} → ${path.join(".") || "(root)"}`;
      if (!isObject(node)) {
        issues.push(`${where}: expected a group or token object`);
        return;
      }
      let type = inheritedType;
      if ("$type" in node) {
        if (TOKEN_TYPES.includes(node.$type as TokenType)) type = node.$type as TokenType;
        else
          issues.push(
            `${where}: unsupported $type "${String(node.$type)}" (supported: ${TOKEN_TYPES.join(", ")})`,
          );
      }

      if ("$value" in node) {
        for (const key of Object.keys(node)) {
          if (key.startsWith("$") && !TOKEN_KEYS.has(key))
            issues.push(`${where}: unknown token property "${key}"`);
          if (!key.startsWith("$")) issues.push(`${where}: a token cannot contain child "${key}"`);
        }
        if (path.length === 0) {
          issues.push(`${where}: a token needs a name`);
          return;
        }
        if (!type) {
          issues.push(`${where}: missing $type (set it on the token or a parent group)`);
          return;
        }
        if (node.$description !== undefined && typeof node.$description !== "string") {
          issues.push(`${where}: $description must be a string`);
        }
        checkValue(type, node.$value, where, issues);
        const name = path.join(".");
        const key = `${kind.theme ?? "*"}:${name}`;
        const previous = seen.get(key);
        if (previous) {
          issues.push(`${name}: defined in both ${previous} and ${file}`);
          return;
        }
        seen.set(key, file);
        tokens.push({
          path,
          name,
          type,
          value: node.$value,
          description: typeof node.$description === "string" ? node.$description : undefined,
          extensions: readExtensions(node.$extensions, where, issues),
          layer: kind.layer,
          theme: kind.theme,
          source: file,
        });
        return;
      }

      for (const [key, child] of Object.entries(node)) {
        if (key.startsWith("$")) {
          if (!GROUP_KEYS.has(key)) issues.push(`${where}: unknown group property "${key}"`);
          continue;
        }
        if (!SEGMENT.test(key)) {
          issues.push(
            `${where}: invalid name "${key}" (use lowercase letters, digits and single hyphens)`,
          );
          continue;
        }
        walk(child, [...path, key], type);
      }
    };

    walk(json, [], undefined);
  }

  // A themed token must not shadow a theme-independent one.
  const baseNames = new Set(tokens.filter((t) => !t.theme).map((t) => t.name));
  for (const token of tokens) {
    if (token.theme && baseNames.has(token.name)) {
      issues.push(
        `${token.name}: defined in ${token.source} but already exists as a theme-independent token`,
      );
    }
  }

  return tokens;
}
