/**
 * Builds the publishable package into dist/:
 *  1. type-checks and emits ESM + declarations with tsc (one module per source file, so
 *     consumers' bundlers can tree-shake per component and keep "use client" boundaries);
 *  2. copies the stylesheet layers next to the compiled components.
 */
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, readdirSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const tsc = createRequire(import.meta.url).resolve("typescript/bin/tsc");

rmSync(dist, { recursive: true, force: true });
execFileSync(process.execPath, [tsc, "-p", join(root, "tsconfig.build.json")], {
  stdio: "inherit",
});
cpSync(join(root, "src/styles"), join(dist, "styles"), { recursive: true });

const components = readdirSync(join(root, "src/components"));
const missing = components.filter(
  (name) => !existsSync(join(dist, "components", name, "index.js")),
);
if (missing.length > 0) {
  console.error(`✖ Missing compiled entry points: ${missing.join(", ")}`);
  process.exit(1);
}
console.log(`✔ Built @cesuain/ui — ${components.length} components, styles copied to dist/styles`);
