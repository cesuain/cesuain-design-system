import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline } from "lucide-react";
import { expect, userEvent, within } from "storybook/test";

import { ToggleGroup, ToggleGroupItem } from "./toggle-group.js";

const meta = {
  title: "Components/Actions/Toggle Group",
  component: ToggleGroup,
  tags: ["autodocs"],
  args: { type: "single", "aria-label": "Text alignment", defaultValue: "left" },
  argTypes: {
    variant: { control: "inline-radio", options: ["default", "outline"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeft />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenter />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRight />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("radio", { name: "Align right" }));
    await expect(canvas.getByRole("radio", { name: "Align right" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  },
};

export const Multiple: Story = {
  args: {
    type: "multiple",
    "aria-label": "Formatting",
    defaultValue: ["bold"],
    variant: "outline",
  },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="bold" aria-label="Bold">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <Underline />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Attached: Story = {
  args: { attached: true, "aria-label": "Period", defaultValue: "month", size: "sm" },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="week">Week</ToggleGroupItem>
      <ToggleGroupItem value="month">Month</ToggleGroupItem>
      <ToggleGroupItem value="year">Year</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: Single.render,
};
