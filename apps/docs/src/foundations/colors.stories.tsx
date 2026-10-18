import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Code,
  DocPage,
  DocSection,
  DocTable,
  PassBadge,
  Swatch,
  tokenColumns,
} from "./doc-blocks.js";
import {
  contrastChecks,
  groupBy,
  type ContrastCheck,
  tokenByName,
  tokensUnder,
  valueFor,
} from "./tokens.js";

const meta = {
  title: "Foundations/Colors",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const primitivePalettes = groupBy(tokensUnder("color", "primitive"), 1);
const semanticGroups = groupBy(tokensUnder("color", "semantic"), 1);

export const Palette: Story = {
  name: "Colors",
  render: () => (
    <DocPage
      eyebrow="Foundations"
      title="Colors"
      lead={
        <p>
          Two layers. <strong className="text-foreground">Primitives</strong> are the raw palette
          and never change between themes. <strong className="text-foreground">Semantic</strong>{" "}
          tokens describe intent (<Code>--background</Code>, <Code>--brand</Code>,{" "}
          <Code>--destructive</Code>) and alias a primitive per theme. Components only use semantic
          tokens.
        </p>
      }
    >
      <DocSection
        title="Semantic colors"
        description="Swatches use the live CSS variable, so they follow the theme selected in the toolbar. Values for both themes are listed alongside."
      >
        {semanticGroups.map(([group, list]) => (
          <div key={group} className="grid gap-3">
            <h3 className="font-eyebrow text-eyebrow text-muted-foreground">{group}</h3>
            <DocTable
              caption={`Semantic ${group} colors`}
              rows={list}
              rowKey={(token) => token.name}
              columns={tokenColumns({
                themed: true,
                preview: {
                  header: "Swatch",
                  className: "w-16",
                  cell: (token) => <Swatch cssVar={token.cssVar} />,
                },
              })}
            />
          </div>
        ))}
      </DocSection>

      <DocSection
        title="Primitive palette"
        description="Reference only. Reach for a primitive in a component only through a new semantic token."
      >
        <div className="grid gap-6">
          {primitivePalettes.map(([palette, list]) => (
            <div key={palette} className="grid gap-2">
              <h3 className="font-eyebrow text-eyebrow text-muted-foreground">{palette}</h3>
              <ul className="grid grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] gap-3">
                {list.map((token) => {
                  const value = valueFor(token);
                  return (
                    <li key={token.name} className="grid gap-1.5">
                      <Swatch cssVar={token.cssVar} className="h-14 w-full" />
                      <span className="font-mono text-caption text-foreground">
                        {token.path.slice(2).join(".") || token.path[1]}
                      </span>
                      <span className="font-mono text-caption text-muted-foreground">
                        {value.resolved}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </DocSection>
    </DocPage>
  ),
};

const contrastColumns = [
  {
    header: "Sample",
    className: "w-40",
    cell: (check: ContrastCheck) => {
      const fg = tokenByName(check.foreground);
      const bg = tokenByName(check.background);
      const color = valueFor(fg, check.theme).resolved;
      const background = valueFor(bg, check.theme).resolved;
      // Below 4.5:1 the pair is a non-text one (WCAG 1.4.11), so show it as a boundary, not text.
      if (check.minimum < 4.5) {
        return (
          <span className="inline-flex rounded-md p-2" style={{ background }}>
            <span
              aria-hidden="true"
              className="block h-7 w-24 rounded-sm border-2"
              style={{ borderColor: color }}
            />
          </span>
        );
      }
      return (
        <span
          className="inline-flex rounded-md border border-border px-3 py-2 text-label-md"
          style={{ color, background }}
        >
          Aa Sample
        </span>
      );
    },
  },
  { header: "Usage", cell: (check: ContrastCheck) => check.usage },
  {
    header: "Pair",
    cell: (check: ContrastCheck) => (
      <div className="grid gap-1">
        <Code>{check.foreground}</Code>
        <span className="text-caption text-muted-foreground">on</span>
        <Code>{check.background}</Code>
      </div>
    ),
  },
  {
    header: "Ratio",
    cell: (check: ContrastCheck) => (
      <span className="font-mono tabular-nums">{check.ratio.toFixed(2)}:1</span>
    ),
  },
  {
    header: "Minimum",
    cell: (check: ContrastCheck) => (
      <span className="font-mono tabular-nums">{check.minimum}:1</span>
    ),
  },
  { header: "WCAG", cell: (check: ContrastCheck) => <PassBadge pass={check.pass} /> },
];

export const Contrast: Story = {
  render: () => (
    <DocPage
      eyebrow="Foundations · Colors"
      title="Contrast"
      lead={
        <p>
          Every pairing below is declared in <Code>src/meta/contrast.json</Code> and measured by{" "}
          <Code>pnpm tokens:check</Code>, which fails the build when a pair drops below its WCAG 2.2
          minimum: 4.5:1 for text, 3:1 for large text, icons and focus indicators.
        </p>
      }
    >
      {(["dark", "light"] as const).map((theme) => (
        <DocSection key={theme} title={theme === "dark" ? "Dark theme" : "Light theme"}>
          <DocTable
            caption={`Contrast checks, ${theme} theme`}
            rows={contrastChecks.filter((check) => check.theme === theme)}
            rowKey={(check) => `${check.foreground}/${check.background}`}
            columns={contrastColumns}
          />
        </DocSection>
      ))}
    </DocPage>
  ),
};
