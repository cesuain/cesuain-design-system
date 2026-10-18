import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bold, Italic, Star } from "lucide-react";
import { expect, userEvent, within } from "storybook/test";

import { Toggle } from "./toggle.js";

const meta = {
  title: "Components/Actions/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  args: { "aria-label": "Bold", children: <Bold />, variant: "default", size: "md" },
  argTypes: {
    variant: { control: "inline-radio", options: ["default", "outline"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    children: { control: false },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const toggle = within(canvasElement).getByRole("button", { name: "Bold" });
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
  },
};

export const Outline: Story = {
  args: { variant: "outline", "aria-label": "Italic", children: <Italic /> },
};

export const WithText: Story = {
  args: {
    "aria-label": undefined,
    variant: "outline",
    children: (
      <>
        <Star /> Favorite
      </>
    ),
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Toggle {...args} size="sm" variant="outline" />
      <Toggle {...args} size="md" variant="outline" />
      <Toggle {...args} size="lg" variant="outline" />
    </div>
  ),
};

export const Pressed: Story = { args: { defaultPressed: true } };

export const Disabled: Story = { args: { disabled: true, variant: "outline" } };
