import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";

import { Code, DocPage, DocSection, DocTable, tokenColumns } from "./doc-blocks.js";
import { tokensUnder, valueFor, type Token } from "./tokens.js";

const meta = {
  title: "Foundations/Typography",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const textStyles = tokensUnder("text", "semantic");

/** Applies a composite text style through its generated CSS variables (`--cds-text-*-font-size`…). */
function textStyle(token: Token): CSSProperties {
  const v = (property: string) => `var(${token.cssVar}-${property})`;
  return {
    fontFamily: v("font-family"),
    fontSize: v("font-size"),
    fontWeight: v("font-weight"),
    lineHeight: v("line-height"),
    letterSpacing: v("letter-spacing"),
    textTransform: token.extensions.textTransform === "uppercase" ? "uppercase" : undefined,
  };
}

function specimen(token: Token) {
  if (token.path[1] === "display") return "Unified foundations";
  if (token.path[1] === "eyebrow") return "Section kicker";
  if (token.path[1] === "code") return "const theme = useDocumentTheme();";
  return "Interfaces built from one shared vocabulary.";
}

export const TypeScale: Story = {
  name: "Typography",
  render: () => (
    <DocPage
      eyebrow="Foundations"
      title="Typography"
      lead={
        <p>
          Three families: <strong className="text-foreground">Anton</strong> for display headlines,{" "}
          <strong className="text-foreground">Poppins</strong> for interface and body text, and{" "}
          <strong className="text-foreground">JetBrains Mono</strong> for eyebrows and code. Each
          style is a composite token that maps to one Tailwind utility (<Code>text-heading-lg</Code>
          ) and one Figma text style.
        </p>
      }
    >
      <DocSection title="Type scale">
        <ul className="grid divide-y divide-border rounded-card border border-border">
          {textStyles.map((token) => {
            const value = valueFor(token).typography;
            return (
              <li
                key={token.name}
                className="grid gap-3 p-5 md:grid-cols-[14rem_1fr] md:items-baseline"
              >
                <div className="grid gap-1">
                  <Code className="w-fit">{token.tailwind}</Code>
                  {value ? (
                    <span className="font-mono text-caption text-muted-foreground">
                      {value.fontWeight} · {value.fontSize.value}
                      {value.fontSize.unit} / {value.lineHeight} · {value.letterSpacing.value}
                      {value.letterSpacing.unit}
                    </span>
                  ) : null}
                </div>
                <p className="min-w-0 break-words" style={textStyle(token)}>
                  {specimen(token)}
                </p>
              </li>
            );
          })}
        </ul>
      </DocSection>

      <DocSection
        title="Text style tokens"
        description="Display styles scale fluidly between the listed minimum and their full size."
      >
        <DocTable
          caption="Composite typography tokens"
          rows={textStyles}
          rowKey={(token) => token.name}
          columns={tokenColumns()}
        />
      </DocSection>

      <DocSection title="Primitives" description="Families, weights, sizes and line heights.">
        <DocTable
          caption="Font primitives"
          rows={tokensUnder("font", "primitive")}
          rowKey={(token) => token.name}
          columns={tokenColumns()}
        />
      </DocSection>
    </DocPage>
  ),
};
