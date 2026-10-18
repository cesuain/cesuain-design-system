import { Grid } from "@cesuain/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Code, DocPage, DocSection, DocTable, tokenColumns } from "./doc-blocks.js";
import { toPx, tokensUnder, valueFor, type Token } from "./tokens.js";

const meta = {
  title: "Foundations/Layout",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const widthBar = {
  header: "Width",
  className: "w-56",
  cell: (token: Token) => {
    const px = toPx(valueFor(token).resolved);
    return (
      <span
        aria-hidden="true"
        className="block h-3 rounded-xs bg-brand/60"
        style={{ width: `${(px / 1536) * 100}%` }}
      />
    );
  },
};

export const Layout: Story = {
  render: () => (
    <DocPage
      eyebrow="Foundations"
      title="Layout"
      lead={
        <p>
          Mobile-first. Pages sit in a centred <Code>Container</Code>, sections stack with{" "}
          <Code>space.section</Code> rhythm, and content columns use <Code>Grid</Code>. Breakpoints
          match Tailwind&apos;s defaults so responsive utilities (<Code>md:</Code>, <Code>lg:</Code>
          ) line up with the tokens.
        </p>
      }
    >
      <DocSection
        title="Column grid"
        description="The 12-column grid shows one column on phones, two from sm and twelve from lg. Resize the canvas to see it."
      >
        <Grid columns={12} gap="sm">
          {Array.from({ length: 12 }, (_, index) => (
            <div
              key={index}
              className="grid h-16 place-items-center rounded-md border border-brand/40 bg-brand/10 font-mono text-caption text-brand"
            >
              {index + 1}
            </div>
          ))}
        </Grid>
      </DocSection>
      <DocSection title="Breakpoints">
        <DocTable
          caption="Breakpoint tokens"
          rows={tokensUnder("breakpoint")}
          rowKey={(token) => token.name}
          columns={tokenColumns({ preview: widthBar })}
        />
      </DocSection>
      <DocSection
        title="Containers and measures"
        description="Page containers and comfortable reading widths."
      >
        <DocTable
          caption="Size tokens for containers and content"
          rows={[...tokensUnder("size.container"), ...tokensUnder("size.content")]}
          rowKey={(token) => token.name}
          columns={tokenColumns({ preview: widthBar })}
        />
      </DocSection>
      <DocSection
        title="Layering"
        description="z-index tokens keep overlays in a predictable order: sticky chrome < overlays < modals < popovers < toasts < tooltips."
      >
        <DocTable
          caption="z-index tokens"
          rows={tokensUnder("z-index")}
          rowKey={(token) => token.name}
          columns={tokenColumns()}
        />
      </DocSection>
    </DocPage>
  ),
};
