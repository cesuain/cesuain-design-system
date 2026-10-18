import type { Meta, StoryObj } from "@storybook/react-vite";

import { Kbd, KbdGroup } from "./kbd.js";

const meta = {
  title: "Components/Data Display/Kbd",
  component: Kbd,
  tags: ["autodocs"],
  args: { children: "Esc" },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Shortcut: Story = {
  render: () => (
    <p className="text-body-sm text-muted-foreground">
      Press{" "}
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>{" "}
      to open the command palette.
    </p>
  ),
};
