#!/usr/bin/env node
/**
 * @cesuain/tokens CLI.
 *
 *   node scripts/tokens.ts build [--only json,css,typescript,docs]
 *   node scripts/tokens.ts validate
 *   node scripts/tokens.ts check
 *
 * Every command validates the full source set first. `build` writes only after all outputs
 * rendered successfully, so a failing run never leaves partial or invalid files behind.
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { build, FORMATS, OUTPUT_DIRS, type OutputFormat } from "./lib/build.ts";
import { readSources } from "./lib/parse.ts";
import { TokenValidationError } from "./lib/types.ts";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function listFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? listFiles(full) : [full];
  });
}

function parseFormats(args: string[]): OutputFormat[] {
  const index = args.indexOf("--only");
  if (index === -1) return [...FORMATS];
  const requested = (args[index + 1] ?? "").split(",").filter(Boolean);
  const unknown = requested.filter((f) => !FORMATS.includes(f as OutputFormat));
  if (requested.length === 0 || unknown.length > 0) {
    throw new Error(`--only expects a comma-separated list of: ${FORMATS.join(", ")}`);
  }
  return requested as OutputFormat[];
}

function summary(result: ReturnType<typeof build>) {
  const { set } = result;
  const themed = set.themed[set.defaultTheme]?.length ?? 0;
  const failing = set.contrast.filter((c) => !c.pass).length;
  return `${set.base.length + themed} tokens (${set.base.length} shared, ${themed} per theme × ${set.themes.length} themes: ${set.themes.join(", ")}); ${set.contrast.length} contrast checks, ${failing} failing`;
}

function run(command: string | undefined, args: string[]): number {
  const sources = readSources(packageRoot);

  switch (command) {
    case "validate": {
      const result = build(sources, []);
      console.log(`✔ Tokens are valid — ${summary(result)}`);
      return 0;
    }

    case "build": {
      const formats = parseFormats(args);
      const result = build(sources, formats);
      for (const format of formats) {
        const dir = resolve(packageRoot, OUTPUT_DIRS[format]);
        for (const file of listFiles(dir)) {
          if (!result.files.has(relative(packageRoot, file))) rmSync(file);
        }
      }
      for (const [path, contents] of result.files) {
        const target = resolve(packageRoot, path);
        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(target, contents);
      }
      console.log(
        `✔ Built ${result.files.size} files (${formats.join(", ")}) — ${summary(result)}`,
      );
      return 0;
    }

    case "check": {
      const result = build(sources);
      const problems: string[] = [];
      for (const [path, contents] of result.files) {
        const target = resolve(packageRoot, path);
        if (!existsSync(target)) problems.push(`missing   ${path}`);
        else if (readFileSync(target, "utf8") !== contents) problems.push(`outdated  ${path}`);
      }
      for (const format of FORMATS) {
        for (const file of listFiles(resolve(packageRoot, OUTPUT_DIRS[format]))) {
          const rel = relative(packageRoot, file);
          if (!result.files.has(rel)) problems.push(`stale     ${rel}`);
        }
      }
      if (problems.length > 0) {
        console.error(
          `✖ Generated token files are out of sync with src/:\n${problems.map((p) => `  ${p}`).join("\n")}\n\nRun \`pnpm tokens:build\` and commit the result.`,
        );
        return 1;
      }
      console.log(`✔ Generated files are up to date — ${summary(result)}`);
      return 0;
    }

    default:
      console.error("Usage: tokens <build|validate|check> [--only json,css,typescript,docs]");
      return 2;
  }
}

try {
  process.exitCode = run(process.argv[2], process.argv.slice(3));
} catch (error) {
  if (error instanceof TokenValidationError) console.error(`✖ ${error.message}`);
  else console.error(`✖ ${(error as Error).message}`);
  process.exitCode = 1;
}
