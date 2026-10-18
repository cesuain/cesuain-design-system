import type { Meta, StoryObj } from "@storybook/react-vite";

import { Separator } from "../separator/separator.js";
import { ScrollArea, ScrollBar } from "./scroll-area.js";

const versions = Array.from({ length: 30 }, (_, i) => `1.${29 - i}.0`);

const meta = {
  title: "Components/Data Display/Scroll Area",
  component: ScrollArea,
  tags: ["autodocs"],
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  render: () => (
    <ScrollArea className="h-72 w-56 rounded-card border border-border" aria-label="Releases">
      <div className="p-4">
        <h4 className="mb-3 font-eyebrow text-caption text-muted-foreground">Releases</h4>
        {versions.map((v) => (
          <div key={v}>
            <div className="py-2 font-mono text-body-sm">v{v}</div>
            <Separator />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea
      className="w-96 rounded-card border border-border whitespace-nowrap"
      aria-label="Swatches"
    >
      <div className="flex w-max gap-3 p-4">
        {Array.from({ length: 16 }, (_, i) => (
          <div
            key={i}
            className="grid size-24 place-items-center rounded-item font-mono text-caption surface"
          >
            {(i + 1) * 50}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};
