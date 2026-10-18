import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ComponentProps } from "react";
import { expect, userEvent, within } from "storybook/test";

import { Slider } from "./slider.js";

const meta = {
  title: "Components/Forms/Slider",
  component: Slider,
  tags: ["autodocs"],
  args: { "aria-label": "Volume", defaultValue: [40], max: 100, step: 1 },
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const thumb = within(canvasElement).getByRole("slider", { name: "Volume" });
    thumb.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(thumb).toHaveAttribute("aria-valuenow", "41");
  },
};

export const Range: Story = {
  args: {
    defaultValue: [20, 80],
    thumbLabels: ["Minimum budget", "Maximum budget"],
    "aria-label": undefined,
  },
};

function ControlledDemo(props: ComponentProps<typeof Slider>) {
  const [value, setValue] = useState([24]);
  return (
    <div className="grid gap-3">
      <Slider {...props} aria-label="Radius" value={value} onValueChange={setValue} max={32} />
      <p className="text-body-sm text-muted-foreground">Radius: {value[0]}px</p>
    </div>
  );
}

export const Controlled: Story = {
  render: (args) => <ControlledDemo {...args} defaultValue={undefined} />,
};

export const Disabled: Story = { args: { disabled: true } };
