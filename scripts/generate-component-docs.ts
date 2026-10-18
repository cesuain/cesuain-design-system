#!/usr/bin/env node
/**
 * Writes packages/ui/src/components/<name>/README.md for every component listed in
 * docs/figma/component-map.json, plus docs/component-index.md. `pnpm docs:check` fails when a README is out of date.
 */
import { writeFileSync } from "node:fs";

import {
  componentIndexPath,
  formatMarkdown,
  listComponentDirs,
  readComponentMap,
  readIfExists,
  readmePath,
  renderComponentIndex,
  renderReadme,
} from "./lib/component-docs.ts";

const map = readComponentMap();
let written = 0;
for (const dir of listComponentDirs()) {
  const entry = map.components[dir];
  if (!entry) {
    console.error(`✖ ${dir} is missing from docs/figma/component-map.json`);
    process.exitCode = 1;
    continue;
  }
  const path = readmePath(dir);
  const content = await formatMarkdown(renderReadme(dir, entry, map.fileKey), path);
  if (readIfExists(path) !== content) {
    writeFileSync(path, content);
    written++;
  }
}
const index = await formatMarkdown(renderComponentIndex(map), componentIndexPath);
if (readIfExists(componentIndexPath) !== index) {
  writeFileSync(componentIndexPath, index);
  written++;
}
console.log(`✔ Component READMEs and docs/component-index.md up to date (${written} written).`);
