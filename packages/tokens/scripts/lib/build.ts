import { themeCss, tokensCss } from "./formats/css.ts";
import { jsModules } from "./formats/js.ts";
import { docsJson, dtcgJson, figmaJson, flatJson } from "./formats/json.ts";
import { mappingMd, tokenReferenceMd } from "./formats/markdown.ts";
import type { SourceFiles } from "./parse.ts";
import { resolveTokens } from "./resolve.ts";
import type { TokenSet } from "./types.ts";

export type OutputFormat = "json" | "css" | "typescript" | "docs";

export const FORMATS: readonly OutputFormat[] = ["json", "css", "typescript", "docs"];

/**
 * Directories (relative to the package root) owned by the generator. `check` treats any file
 * inside them that the generator would not produce as stale.
 */
export const OUTPUT_DIRS: Record<OutputFormat, string> = {
  json: "json",
  css: "css",
  typescript: "js",
  docs: "../../docs/foundations/generated",
};

export interface BuildResult {
  set: TokenSet;
  /** Output path relative to the package root → file contents. */
  files: Map<string, string>;
}

/** Validates the sources and renders every requested format in memory. Never touches the disk. */
export function build(
  sources: SourceFiles,
  formats: readonly OutputFormat[] = FORMATS,
): BuildResult {
  const set = resolveTokens(sources);
  const files = new Map<string, string>();

  if (formats.includes("json")) {
    for (const theme of set.themes) {
      files.set(`json/tokens.${theme}.json`, flatJson(set, theme));
      files.set(`json/tokens.${theme}.dtcg.json`, dtcgJson(set, theme));
    }
    files.set("json/figma-variables.json", figmaJson(set));
    files.set("json/docs.json", docsJson(set));
  }
  if (formats.includes("css")) {
    files.set("css/tokens.css", tokensCss(set));
    files.set("css/theme.css", themeCss(set));
  }
  if (formats.includes("typescript")) {
    const { js, dts } = jsModules(set);
    files.set("js/index.js", js);
    files.set("js/index.d.ts", dts);
  }
  if (formats.includes("docs")) {
    files.set(`${OUTPUT_DIRS.docs}/tokens.md`, tokenReferenceMd(set));
    files.set(`${OUTPUT_DIRS.docs}/mapping.md`, mappingMd(set));
  }
  return { set, files };
}
