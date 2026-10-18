import type { Meta, StoryObj } from "@storybook/react-vite";

import { Code, DocPage, DocSection, DocTable, tokenColumns } from "./doc-blocks.js";
import { tokensUnder, type Token } from "./tokens.js";

const meta = {
  title: "Foundations/Shadows",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const shadowPreview = {
  header: "Preview",
  className: "w-32",
  cell: (token: Token) => (
    <span
      aria-hidden="true"
      className="block h-14 w-24 rounded-lg border border-border bg-card"
      style={{ boxShadow: `var(${token.cssVar})` }}
    />
  ),
};

export const Shadows: Story = {
  render: () => (
    <DocPage
      eyebrow="Foundations"
      title="Shadows"
      lead={
        <p>
          Depth comes mostly from layered surfaces and borders; shadows are soft and long. Use the
          themed <Code>shadow-elevation-*</Code> utilities, which switch to lighter shadows in the
          light theme. Glows are reserved for brand moments such as the primary call to action.
        </p>
      }
    >
      <DocSection title="Elevation" description="Themed: previews follow the toolbar theme.">
        <DocTable
          caption="Elevation tokens"
          rows={tokensUnder("elevation")}
          rowKey={(token) => token.name}
          columns={tokenColumns({ themed: true, preview: shadowPreview })}
        />
      </DocSection>
      <DocSection title="Shadow primitives">
        <DocTable
          caption="Primitive shadow tokens"
          rows={tokensUnder("shadow")}
          rowKey={(token) => token.name}
          columns={tokenColumns({ preview: shadowPreview })}
        />
      </DocSection>
    </DocPage>
  ),
};
