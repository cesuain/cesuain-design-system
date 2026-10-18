import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { build } from "../scripts/lib/build.ts";
import { contrastRatio, parseHex } from "../scripts/lib/color.ts";
import { cssVarName } from "../scripts/lib/naming.ts";
import { readSources, type SourceFiles } from "../scripts/lib/parse.ts";
import { TokenValidationError } from "../scripts/lib/types.ts";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Minimal valid source set; individual tests patch it to provoke one failure at a time. */
function fixture(): SourceFiles {
  return {
    "src/primitives/color.json": {
      color: {
        $type: "color",
        neutral: { "0": { $value: "#ffffff" }, "950": { $value: "#09090b" } },
      },
    },
    "src/primitives/size.json": {
      spacing: { $type: "dimension", "4": { $value: { value: 1, unit: "rem" } } },
    },
    "src/themes/dark/theme.json": {
      color: {
        $type: "color",
        background: { default: { $value: "{color.neutral.950}" } },
        foreground: { default: { $value: "{color.neutral.0}" } },
      },
    },
    "src/themes/light/theme.json": {
      color: {
        $type: "color",
        background: { default: { $value: "{color.neutral.0}" } },
        foreground: { default: { $value: "{color.neutral.950}" } },
      },
    },
  };
}

// Fixtures are free-form JSON that tests mutate deep inside; a loose type keeps them readable.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FixtureJson = Record<string, any>;

const theme = (files: SourceFiles, name: "dark" | "light") =>
  files[`src/themes/${name}/theme.json`] as FixtureJson;

function issuesOf(files: SourceFiles): string[] {
  try {
    build(files);
  } catch (error) {
    if (error instanceof TokenValidationError) return error.issues;
    throw error;
  }
  return [];
}

describe("canonical sources", () => {
  const sources = readSources(packageRoot);

  it("validate and resolve without issues", () => {
    expect(() => build(sources)).not.toThrow();
  });

  it("define identical token names in every theme", () => {
    const { set } = build(sources);
    const names = set.themes.map((t) => (set.themed[t] ?? []).map((x) => x.name).sort());
    for (const list of names) expect(list).toEqual(names[0]);
  });

  it("pass every declared contrast pair", () => {
    const { set } = build(sources);
    expect(set.contrast.length).toBeGreaterThan(0);
    expect(set.contrast.filter((c) => !c.pass)).toEqual([]);
  });

  it("render deterministically", () => {
    const a = build(sources).files;
    const b = build(sources).files;
    expect([...a.entries()]).toEqual([...b.entries()]);
  });

  it("keep shadcn/ui variable names for semantic colors", () => {
    const css = build(sources).files.get("css/tokens.css") ?? "";
    for (const name of [
      "--background",
      "--foreground",
      "--card",
      "--card-foreground",
      "--primary",
      "--ring",
      "--sidebar-primary-foreground",
    ]) {
      expect(css).toContain(`${name}:`);
    }
  });

  it("emit the dark theme on :root and the light theme behind data-theme/class selectors", () => {
    const css = build(sources).files.get("css/tokens.css") ?? "";
    expect(css).toMatch(/:root,\n\[data-theme="dark"\],\n\.dark \{\n {2}color-scheme: dark;/);
    expect(css).toMatch(/\[data-theme="light"\],\n\.light \{\n {2}color-scheme: light;/);
  });

  it("preserve alias chains as var() references", () => {
    const css = build(sources).files.get("css/tokens.css") ?? "";
    expect(css).toContain("--background: var(--cds-color-neutral-975);");
    expect(css).toContain("--cds-radius-control: var(--cds-radius-full);");
  });

  it("produce valid JSON for every JSON output", () => {
    for (const [path, contents] of build(sources).files) {
      if (path.endsWith(".json")) expect(() => JSON.parse(contents)).not.toThrow();
    }
  });
});

describe("validation", () => {
  it("accepts the minimal fixture", () => {
    expect(issuesOf(fixture())).toEqual([]);
  });

  it("reports missing references with a hint", () => {
    const files = fixture();
    theme(files, "dark").color.background.default.$value = "{color.neutral.900}";
    expect(issuesOf(files).join("\n")).toMatch(
      /references \{color\.neutral\.900\}, which does not exist/,
    );
  });

  it("detects circular aliases", () => {
    const files = fixture();
    files["src/semantic/loop.json"] = {
      loop: { $type: "dimension", a: { $value: "{loop.b}" }, b: { $value: "{loop.a}" } },
    };
    expect(issuesOf(files).join("\n")).toMatch(
      /Circular alias: loop\.(a|b) → loop\.(a|b) → loop\.(a|b)/,
    );
  });

  it("rejects aliases whose type does not match", () => {
    const files = fixture();
    theme(files, "dark").color.background.default.$value = "{spacing.4}";
    expect(issuesOf(files).join("\n")).toMatch(/of type "dimension" where "color" is required/);
  });

  it("rejects primitives that reference semantic tokens", () => {
    const files = fixture();
    files["src/semantic/space.json"] = {
      space: { $type: "dimension", md: { $value: "{spacing.4}" } },
    };
    files["src/primitives/bad.json"] = { gap: { $type: "dimension", x: { $value: "{space.md}" } } };
    expect(issuesOf(files).join("\n")).toMatch(
      /a primitive token cannot reference the semantic token \{space\.md\}/,
    );
  });

  it("enforces theme parity", () => {
    const files = fixture();
    theme(files, "light").color.muted = { default: { $value: "{color.neutral.0}" } };
    expect(issuesOf(files).join("\n")).toMatch(
      /"color\.muted\.default" exists in theme "light" but not in "dark"/,
    );
  });

  it("validates value shapes and types", () => {
    const files = fixture();
    files["src/primitives/bad.json"] = {
      broken: {
        color: { $type: "color", $value: "blue" },
        size: { $type: "dimension", $value: "12px" },
        ease: { $type: "cubicBezier", $value: [2, 0, 1, 1] },
        mystery: { $type: "gradient", $value: "x" },
        untyped: { $value: 1 },
      },
    };
    const report = issuesOf(files).join("\n");
    expect(report).toMatch(/broken\.color: expected a hex color/);
    expect(report).toMatch(/broken\.size: expected a dimension/);
    expect(report).toMatch(/broken\.ease: expected \[x1, y1, x2, y2\]/);
    expect(report).toMatch(/unsupported \$type "gradient"/);
    expect(report).toMatch(/broken\.untyped: missing \$type/);
  });

  it("rejects invalid names and duplicate definitions", () => {
    const files = fixture();
    files["src/primitives/dupe.json"] = {
      spacing: {
        $type: "dimension",
        "4": { $value: { value: 2, unit: "rem" } },
        Bad_Name: { $value: { value: 1, unit: "px" } },
      },
    };
    const report = issuesOf(files).join("\n");
    expect(report).toMatch(/spacing\.4: defined in both/);
    expect(report).toMatch(/invalid name "Bad_Name"/);
  });

  it("fails the build when a declared contrast pair is too low", () => {
    const files = fixture();
    theme(files, "dark").color.foreground.default.$value = "{color.neutral.950}";
    files["src/meta/contrast.json"] = {
      pairs: [
        {
          foreground: "color.foreground.default",
          background: "color.background.default",
          minimum: 4.5,
          usage: "Body",
        },
      ],
    };
    expect(issuesOf(files).join("\n")).toMatch(
      /Contrast \(dark\): color\.foreground\.default on color\.background\.default is 1:1/,
    );
  });

  it("reports every issue in one pass", () => {
    const files = fixture();
    theme(files, "dark").color.background.default.$value = "{nope.one}";
    theme(files, "light").color.background.default.$value = "{nope.two}";
    expect(issuesOf(files).length).toBeGreaterThanOrEqual(2);
  });
});

describe("helpers", () => {
  it("computes WCAG contrast ratios", () => {
    expect(contrastRatio(parseHex("#000000"), parseHex("#ffffff"))).toBe(21);
    expect(contrastRatio(parseHex("#777777"), parseHex("#ffffff"))).toBeCloseTo(4.48, 2);
  });

  it("names CSS variables from token paths", () => {
    expect(
      cssVarName({ layer: "semantic", type: "color", path: ["color", "card", "default"] }),
    ).toBe("--card");
    expect(
      cssVarName({
        layer: "semantic",
        type: "color",
        path: ["color", "sidebar", "primary", "foreground"],
      }),
    ).toBe("--sidebar-primary-foreground");
    expect(
      cssVarName({ layer: "primitive", type: "color", path: ["color", "neutral", "975"] }),
    ).toBe("--cds-color-neutral-975");
    expect(
      cssVarName({
        layer: "component",
        type: "dimension",
        path: ["component", "control", "height", "md"],
      }),
    ).toBe("--cds-control-height-md");
  });
});
