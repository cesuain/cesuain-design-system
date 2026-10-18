import type { Meta, StoryObj } from "@storybook/react-vite";
import { Menu, Moon, Search, Trash2 } from "lucide-react";
import { fn } from "storybook/test";

import { IconButton } from "./icon-button.js";

const meta = {
  title: "Components/Actions/Icon Button",
  component: IconButton,
  tags: ["autodocs"],
  args: { label: "Open menu", icon: <Menu />, onClick: fn() },
  argTypes: {
    icon: { control: false },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    variant: {
      control: "select",
      options: ["ghost", "secondary", "outline", "default", "destructive"],
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <IconButton {...args} variant="ghost" label="Search" icon={<Search />} />
      <IconButton {...args} variant="secondary" label="Switch to light theme" icon={<Moon />} />
      <IconButton {...args} variant="outline" label="Open menu" icon={<Menu />} />
      <IconButton {...args} variant="destructive" label="Delete item" icon={<Trash2 />} />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <IconButton {...args} variant="secondary" size="sm" />
      <IconButton {...args} variant="secondary" size="md" />
      <IconButton {...args} variant="secondary" size="lg" />
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true, variant: "secondary" } };
