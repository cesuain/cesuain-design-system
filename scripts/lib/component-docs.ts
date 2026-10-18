/**
 * Shared model for component documentation: reads the Figma component map, the token docs
 * and each component's source, and renders the per-component README.
 *
 * Used by `scripts/generate-component-docs.ts` (writes) and `scripts/check-docs.ts` (verifies).
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { format, resolveConfig } from "prettier";

export const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export const componentsDir = join(repoRoot, "packages/ui/src/components");
export const componentMapPath = join(repoRoot, "docs/figma/component-map.json");
/** The published Storybook. Run `pnpm storybook` for the same docs locally on port 6006. */
export const storybookUrl = "https://storybook.cesarfonseca.dev";

export interface ComponentEntry {
  name: string;
  storybook: string;
  figmaNodeId: string;
  figmaUrl: string;
  summary: string;
  figmaProperties: string[];
}

export interface ComponentMap {
  fileKey: string;
  fileUrl: string;
  components: Record<string, ComponentEntry>;
  [key: string]: unknown;
}

interface DocToken {
  name: string;
  cssVar: string;
  tailwind: string | null;
  layer: string;
  type: string;
}

export function readComponentMap(): ComponentMap {
  return JSON.parse(readFileSync(componentMapPath, "utf8")) as ComponentMap;
}

export function listComponentDirs(): string[] {
  return readdirSync(componentsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

/** Storybook's id for a title: "Components/Actions/Button" → "components-actions-button". */
export function storybookId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9/ -]/g, "")
    .replace(/[/ ]+/g, "-");
}

export function figmaNodeUrl(fileKey: string, nodeId: string): string {
  return `https://www.figma.com/design/${fileKey}?node-id=${nodeId.replace(":", "-")}`;
}

function readTokens(): DocToken[] {
  const docs = JSON.parse(
    readFileSync(join(repoRoot, "packages/tokens/json/docs.json"), "utf8"),
  ) as { tokens: DocToken[] };
  return docs.tokens;
}

/** Recipes from lib/styles.ts, so components that compose them list the tokens they use. */
function readStyleRecipes(): Map<string, string> {
  const source = readFileSync(join(repoRoot, "packages/ui/src/lib/styles.ts"), "utf8");
  const recipes = new Map<string, string>();
  const pattern = /export const (\w+)\s*=([\s\S]*?)(?=\nexport |\n\/\*\*|$)/g;
  for (const match of source.matchAll(pattern)) recipes.set(match[1]!, match[2]!);
  return recipes;
}

function componentSource(dir: string): string {
  const files = readdirSync(join(componentsDir, dir)).filter(
    (file) =>
      /\.tsx?$/.test(file) &&
      !file.endsWith(".test.tsx") &&
      !file.endsWith(".stories.tsx") &&
      file !== "index.ts",
  );
  const source = files
    .map((file) => readFileSync(join(componentsDir, dir, file), "utf8"))
    .join("\n");
  const recipes = readStyleRecipes();
  const imported = [
    ...source.matchAll(/import\s*{([^}]+)}\s*from\s*"\.\.\/\.\.\/lib\/styles\.js"/g),
  ]
    .flatMap((match) => match[1]!.split(","))
    .map((name) => name.trim())
    .filter(Boolean);
  return [source, ...imported.map((name) => recipes.get(name) ?? "")].join("\n");
}

const COLOR_UTILITY =
  /(?:^|[\s"'`:])(?:bg|text|border|ring|outline|fill|stroke|from|via|to|decoration|divide|shadow)-([a-z-]+?)(?:\/[\d.[\]]+)?(?=[\s"'`]|$)/g;

/** Token names a component's source references, through utilities or CSS variables. */
export function tokensUsed(dir: string): string[] {
  const source = componentSource(dir);
  const tokens = readTokens();
  const used = new Set<string>();
  const byCssVar = new Map(tokens.map((token) => [token.cssVar, token.name]));
  for (const match of source.matchAll(/--cds-[a-z0-9-]+/g)) {
    const name = byCssVar.get(match[0]);
    if (name) used.add(name);
  }
  const colorBySuffix = new Map<string, string>();
  const exactUtilities = new Map<string, string>();
  for (const token of tokens) {
    if (!token.tailwind) continue;
    for (const utility of token.tailwind.split(" · ")) {
      if (token.type === "color" && utility.startsWith("bg-"))
        colorBySuffix.set(utility.slice(3), token.name);
      else exactUtilities.set(utility, token.name);
    }
  }
  // Radius, shadow, easing and font utilities come from the generated Tailwind theme.
  const theme = readFileSync(join(repoRoot, "packages/tokens/css/theme.css"), "utf8");
  const prefixes: Record<string, string> = {
    radius: "rounded-",
    shadow: "shadow-",
    ease: "ease-",
    font: "font-",
  };
  for (const match of theme.matchAll(
    /--(radius|shadow|ease|font)-([a-z0-9-]+): var\((--cds-[a-z0-9-]+)\)/g,
  )) {
    const name = byCssVar.get(match[3]!);
    if (name) exactUtilities.set(`${prefixes[match[1]!]}${match[2]}`, name);
  }
  for (const match of source.matchAll(COLOR_UTILITY)) {
    const name = colorBySuffix.get(match[1]!);
    if (name) used.add(name);
  }
  for (const [utility, name] of exactUtilities) {
    const escaped = utility.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp(`(?:^|[\\s"'\`:])${escaped}(?=[\\s"'\`/]|$)`).test(source)) used.add(name);
  }
  return [...used].sort();
}

/** Named exports of a component's index.ts, values before types. */
export function publicExports(dir: string): { values: string[]; types: string[] } {
  const source = readFileSync(join(componentsDir, dir, "index.ts"), "utf8");
  const values: string[] = [];
  const types: string[] = [];
  for (const match of source.matchAll(/export\s+(type\s+)?{([^}]+)}/g)) {
    for (const raw of match[2]!.split(",")) {
      const item = raw.trim();
      if (!item) continue;
      if (match[1] || item.startsWith("type ")) types.push(item.replace(/^type\s+/, ""));
      else values.push(item);
    }
  }
  return { values, types };
}

export function sourceFiles(dir: string): string[] {
  return readdirSync(join(componentsDir, dir))
    .filter((file) => file !== "README.md")
    .sort();
}

export function renderReadme(dir: string, entry: ComponentEntry, fileKey: string): string {
  const { values, types } = publicExports(dir);
  const tokens = tokensUsed(dir);
  const storyId = storybookId(entry.storybook);
  const unitAxe = (readIfExists(join(componentsDir, dir, `${dir}.test.tsx`)) ?? "").includes(
    "expectNoA11yViolations",
  );
  const lines = [
    "<!-- Generated by scripts/generate-component-docs.ts from docs/figma/component-map.json. Do not edit by hand; run `pnpm docs:generate`. -->",
    "",
    `# ${entry.name}`,
    "",
    entry.summary,
    "",
    "| | |",
    "| --- | --- |",
    `| Storybook | [\`${entry.storybook}\`](${storybookUrl}/?path=/docs/${storyId}--docs) |`,
    `| Figma | [${entry.name} component set](${figmaNodeUrl(fileKey, entry.figmaNodeId)}) (node \`${entry.figmaNodeId}\`) |`,
    `| Source | [\`packages/ui/src/components/${dir}\`](./) |`,
    "",
    "## Import",
    "",
    "```tsx",
    `import { ${values.slice(0, 4).join(", ")}${values.length > 4 ? ", …" : ""} } from "@cesuain/ui";`,
    `// or the per-component entry point`,
    `import { ${values[0]} } from "@cesuain/ui/${dir}";`,
    "```",
    "",
    "## API",
    "",
    `Exports: ${values.map((name) => `\`${name}\``).join(", ")}.`,
    "",
    types.length > 0 ? `Types: ${types.map((name) => `\`${name}\``).join(", ")}.` : "",
    "",
    "Props, defaults and live examples are on the Storybook Docs page, generated from the TypeScript types.",
    "",
    "## Figma",
    "",
    "Component properties in the Figma library:",
    "",
    ...entry.figmaProperties.map((property) => `- ${property}`),
    "",
    "## Design tokens",
    "",
    tokens.length > 0
      ? "Tokens referenced by the implementation (directly or through shared recipes in `lib/styles.ts`):"
      : "This component sets no token-backed styles of its own; it inherits them from its children.",
    "",
    ...tokens.map((name) => `- \`${name}\``),
    "",
    "## Accessibility",
    "",
    "- Behaviour and semantics are summarized above; keyboard and screen reader behaviour follow the WAI-ARIA pattern of the underlying primitive.",
    `- \`${dir}.test.tsx\` covers rendering, variants and interaction with Testing Library${
      unitAxe
        ? " and runs axe-core on the rendered output (contrast is checked at token level)"
        : ""
    }. Every story also runs axe-core's default rule set in the Storybook browser tests; violations fail the run.`,
    "- Colors come from semantic tokens whose contrast is checked in both themes by `pnpm tokens:check`.",
    "",
    "## Files",
    "",
    ...sourceFiles(dir).map((file) => `- \`${file}\``),
    "",
  ];
  return lines.join("\n");
}

export async function formatMarkdown(markdown: string, filePath: string): Promise<string> {
  const config = (await resolveConfig(filePath)) ?? {};
  return format(markdown, { ...config, filepath: filePath });
}

export function readmePath(dir: string): string {
  return join(componentsDir, dir, "README.md");
}

export function readIfExists(path: string): string | null {
  return existsSync(path) ? readFileSync(path, "utf8") : null;
}

export const componentIndexPath = join(repoRoot, "docs/component-index.md");

/** docs/component-index.md: Component → source, Storybook, tests, tokens and Figma. */
export function renderComponentIndex(map: ComponentMap): string {
  const groups = new Map<string, string[]>();
  for (const [dir, entry] of Object.entries(map.components)) {
    const group = entry.storybook.split("/").slice(0, -1).join(" / ");
    groups.set(group, [...(groups.get(group) ?? []), dir]);
  }
  const lines = [
    "<!-- Generated by scripts/generate-component-docs.ts from docs/figma/component-map.json. Do not edit by hand; run `pnpm docs:generate`. -->",
    "",
    "# Component index",
    "",
    "Every component with its source, Storybook entry, tests, design tokens and Figma component set. Storybook links open the published Storybook; `pnpm storybook` serves the same pages locally on port 6006.",
    "",
  ];
  for (const [group, dirs] of [...groups].sort(([a], [b]) => a.localeCompare(b))) {
    lines.push(
      `## ${group}`,
      "",
      "| Component | Source | Storybook | Tests | Tokens | Figma |",
      "| --- | --- | --- | --- | --- | --- |",
    );
    for (const dir of dirs.sort()) {
      const entry = map.components[dir]!;
      const base = `../packages/ui/src/components/${dir}`;
      lines.push(
        `| [${entry.name}](${base}/README.md) | [\`${dir}/\`](${base}) | [${entry.storybook.split("/").at(-1)}](${storybookUrl}/?path=/docs/${storybookId(entry.storybook)}--docs) | [\`${dir}.test.tsx\`](${base}/${dir}.test.tsx) | [${tokensUsed(dir).length} tokens](${base}/README.md#design-tokens) | [\`${entry.figmaNodeId}\`](${figmaNodeUrl(map.fileKey, entry.figmaNodeId)}) |`,
      );
    }
    lines.push("");
  }
  return lines.join("\n");
}
