#!/usr/bin/env node
/**
 * Verifies that documentation matches the code:
 *  - every component directory has index.ts, implementation, test, story and README;
 *  - the package barrel exports exactly the component directories;
 *  - every component is mapped to a Figma node and a Storybook title that exists;
 *  - generated READMEs and docs/component-index.md are up to date;
 *  - the repository docs referenced from the README exist.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  componentIndexPath,
  componentsDir,
  formatMarkdown,
  listComponentDirs,
  readComponentMap,
  readIfExists,
  readmePath,
  renderComponentIndex,
  renderReadme,
  repoRoot,
} from "./lib/component-docs.ts";

const errors: string[] = [];
const dirs = listComponentDirs();
const map = readComponentMap();

for (const dir of dirs) {
  const files = readdirSync(join(componentsDir, dir));
  for (const required of [
    "index.ts",
    `${dir}.tsx`,
    `${dir}.test.tsx`,
    `${dir}.stories.tsx`,
    "README.md",
  ]) {
    if (!files.includes(required)) errors.push(`${dir}: missing ${required}`);
  }
}

const barrel = readFileSync(join(repoRoot, "packages/ui/src/index.ts"), "utf8");
const exported = [...barrel.matchAll(/from "\.\/components\/([^/]+)\/index\.js"/g)].map(
  (m) => m[1]!,
);
for (const dir of dirs)
  if (!exported.includes(dir)) errors.push(`barrel: ${dir} is not exported from src/index.ts`);
for (const dir of exported)
  if (!dirs.includes(dir)) errors.push(`barrel: exports missing directory ${dir}`);

for (const dir of dirs) {
  const entry = map.components[dir];
  if (!entry) {
    errors.push(`${dir}: not in docs/figma/component-map.json`);
    continue;
  }
  if (!/^\d+:\d+$/.test(entry.figmaNodeId))
    errors.push(`${dir}: invalid Figma node id ${entry.figmaNodeId}`);
  const story = readIfExists(join(componentsDir, dir, `${dir}.stories.tsx`)) ?? "";
  const metaTitle = /const meta = \{\s*title: "([^"]+)"/.exec(story)?.[1];
  if (metaTitle !== entry.storybook) {
    errors.push(
      `${dir}: component map says "${entry.storybook}", story meta title is "${metaTitle}"`,
    );
  }
  const path = readmePath(dir);
  const expected = await formatMarkdown(renderReadme(dir, entry, map.fileKey), path);
  if (readIfExists(path) !== expected)
    errors.push(`${dir}: README.md is out of date (run pnpm docs:generate)`);
}
for (const dir of Object.keys(map.components)) {
  if (!dirs.includes(dir)) errors.push(`component-map: ${dir} has no component directory`);
}

const index = await formatMarkdown(renderComponentIndex(map), componentIndexPath);
if (readIfExists(componentIndexPath) !== index) {
  errors.push("docs/component-index.md is out of date (run pnpm docs:generate)");
}

for (const doc of [
  "README.md",
  "CONTRIBUTING.md",
  "CHANGELOG.md",
  "LICENSE",
  "docs/figma/README.md",
  "docs/accessibility/README.md",
  "docs/contribution/README.md",
  "docs/architecture/README.md",
]) {
  if (!existsSync(join(repoRoot, doc))) errors.push(`missing ${doc}`);
}

if (errors.length > 0) {
  console.error(`✖ docs:check found ${errors.length} problem(s):\n  ${errors.join("\n  ")}`);
  process.exit(1);
}
console.log(`✔ Docs match code: ${dirs.length} components, barrel, Figma map and READMEs.`);
