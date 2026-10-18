import type { Meta, StoryObj } from "@storybook/react-vite";

import { Separator } from "./separator.js";

const meta = {
  title: "Components/Data Display/Separator",
  component: Separator,
  tags: ["autodocs"],
  args: { orientation: "horizontal", decorative: true },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (args) => (
    <div className="max-w-sm">
      <p className="text-heading-sm">Cesuain Design System</p>
      <p className="text-body-sm text-muted-foreground">Foundations, components and patterns.</p>
      <Separator {...args} className="my-4" />
      <p className="text-body-sm text-muted-foreground">Version 0.1.0</p>
    </div>
  ),
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <div className="flex h-5 items-center gap-4 text-label-sm">
      <span>Docs</span>
      <Separator {...args} />
      <span>Storybook</span>
      <Separator {...args} />
      <span>Figma</span>
    </div>
  ),
};
