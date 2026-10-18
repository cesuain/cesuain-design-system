import type { Meta, StoryObj } from "@storybook/react-vite";

import { Code, DocPage, DocSection, DocTable, tokenColumns } from "./doc-blocks.js";
import { toPx, tokensUnder, valueFor, type Token } from "./tokens.js";

const meta = {
  title: "Foundations/Spacing",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const bar = {
  header: "Scale",
  className: "w-56",
  cell: (token: Token) => (
    <span
      aria-hidden="true"
      className="block h-3 rounded-xs bg-brand/70"
      style={{ width: `min(${toPx(valueFor(token).resolved)}px, 13rem)` }}
    />
  ),
};

export const Scale: Story = {
  name: "Spacing",
  render: () => (
    <DocPage
      eyebrow="Foundations"
      title="Spacing"
      lead={
        <p>
          A 4px base grid (<Code>spacing.1</Code> = 0.25rem). Tailwind&apos;s spacing utilities (
          <Code>p-4</Code>, <Code>gap-6</Code>) resolve to the same scale. Semantic aliases name the
          recurring decisions: stack gaps between siblings, insets inside containers, gutters and
          section rhythm.
        </p>
      }
    >
      <DocSection title="Semantic spacing">
        <DocTable
          caption="Semantic spacing tokens"
          rows={tokensUnder("space", "semantic")}
          rowKey={(token) => token.name}
          columns={tokenColumns({ preview: bar })}
        />
      </DocSection>
      <DocSection
        title="Component spacing"
        description="Control heights and paddings shared by buttons, inputs, selects, cards, overlays and menus."
      >
        <DocTable
          caption="Component dimension tokens"
          rows={tokensUnder("component")}
          rowKey={(token) => token.name}
          columns={tokenColumns({ preview: bar })}
        />
      </DocSection>
      <DocSection title="Spacing scale">
        <DocTable
          caption="Primitive spacing scale"
          rows={tokensUnder("spacing", "primitive")}
          rowKey={(token) => token.name}
          columns={tokenColumns({ preview: bar })}
        />
      </DocSection>
    </DocPage>
  ),
};
