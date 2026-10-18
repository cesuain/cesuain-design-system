import { Input, Label, ToggleGroup, ToggleGroupItem } from "@cesuain/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useDeferredValue, useState } from "react";
import { expect, userEvent, within } from "storybook/test";

import { Code, DocPage, DocSection, DocTable, tokenColumns } from "./doc-blocks.js";
import { type Token, tokens } from "./tokens.js";

const meta = {
  title: "Foundations/Tokens",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type Layer = Token["layer"] | "all";

function TokenReference() {
  const [query, setQuery] = useState("");
  const [layer, setLayer] = useState<Layer>("all");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const rows = tokens.filter(
    (token) =>
      (layer === "all" || token.layer === layer) &&
      (!deferredQuery ||
        token.name.includes(deferredQuery) ||
        token.cssVar.includes(deferredQuery) ||
        token.description.toLowerCase().includes(deferredQuery)),
  );

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className="grid gap-2">
          <Label htmlFor="token-search">Search tokens</Label>
          <Input
            id="token-search"
            type="search"
            placeholder="brand, --cds-radius, spacing.4…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-72"
          />
        </div>
        <ToggleGroup
          type="single"
          variant="outline"
          aria-label="Token layer"
          value={layer}
          // Single toggle groups emit "" when the active item is pressed again; keep a selection.
          onValueChange={(value) => value && setLayer(value as Layer)}
        >
          <ToggleGroupItem value="all">All</ToggleGroupItem>
          <ToggleGroupItem value="primitive">Primitive</ToggleGroupItem>
          <ToggleGroupItem value="semantic">Semantic</ToggleGroupItem>
          <ToggleGroupItem value="component">Component</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <p role="status" className="text-body-sm text-muted-foreground">
        {rows.length} of {tokens.length} tokens
      </p>
      <DocTable
        caption="All design tokens"
        rows={rows}
        rowKey={(token) => token.name}
        columns={[
          {
            header: "Layer",
            cell: (token) => (
              <span className="text-caption text-muted-foreground">{token.layer}</span>
            ),
          },
          {
            header: "Type",
            cell: (token) => <span className="font-mono text-caption">{token.type}</span>,
          },
          ...tokenColumns({ themed: true }),
        ]}
      />
    </div>
  );
}

export const Reference: Story = {
  name: "Tokens",
  render: () => (
    <DocPage
      eyebrow="Foundations"
      title="Tokens"
      lead={
        <p>
          Every token in one table, generated from the DTCG sources in{" "}
          <Code>packages/tokens/src</Code>. Each row shows the same token in all four places it
          lives: the token path (JSON and TypeScript), the CSS variable, its value per theme, and
          the Figma variable.
        </p>
      }
    >
      <DocSection title="Reference">
        <TokenReference />
      </DocSection>
    </DocPage>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText("Search tokens"), "brand.default");
    await expect(await canvas.findByText(/^1 of \d+ tokens$/)).toBeVisible();
  },
};
