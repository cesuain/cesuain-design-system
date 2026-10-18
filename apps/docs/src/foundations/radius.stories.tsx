import type { Meta, StoryObj } from "@storybook/react-vite";

import { Code, DocPage, DocSection, DocTable, tokenColumns } from "./doc-blocks.js";
import { tokensUnder, type Token } from "./tokens.js";

const meta = {
  title: "Foundations/Radius",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const radiusPreview = {
  header: "Preview",
  className: "w-24",
  cell: (token: Token) => (
    <span
      aria-hidden="true"
      className="block size-14 border border-brand/60 bg-brand/10"
      style={{ borderRadius: `var(${token.cssVar})` }}
    />
  ),
};

export const Radius: Story = {
  render: () => (
    <DocPage
      eyebrow="Foundations"
      title="Radius"
      lead={
        <p>
          Generous, soft corners. Components use semantic radii (<Code>rounded-card</Code>,{" "}
          <Code>rounded-control</Code>) so a single token change reshapes every card or control.
          Nested surfaces step down one size so inner corners stay concentric.
        </p>
      }
    >
      <DocSection title="Semantic radii">
        <DocTable
          caption="Semantic radius tokens"
          rows={tokensUnder("radius", "semantic")}
          rowKey={(token) => token.name}
          columns={tokenColumns({ preview: radiusPreview })}
        />
      </DocSection>
      <DocSection title="Radius scale">
        <DocTable
          caption="Primitive radius tokens"
          rows={tokensUnder("radius", "primitive")}
          rowKey={(token) => token.name}
          columns={tokenColumns({ preview: radiusPreview })}
        />
      </DocSection>
      <DocSection title="Border width">
        <DocTable
          caption="Border width tokens"
          rows={tokensUnder("border-width")}
          rowKey={(token) => token.name}
          columns={tokenColumns()}
        />
      </DocSection>
    </DocPage>
  ),
};
