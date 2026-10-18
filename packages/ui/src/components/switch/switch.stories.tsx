import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Label } from "../label/label.js";
import { Switch } from "./switch.js";

const meta = {
  title: "Components/Forms/Switch",
  component: Switch,
  tags: ["autodocs"],
  args: { id: "switch-motion", size: "md" },
  argTypes: { size: { control: "inline-radio", options: ["sm", "md"] } },
  render: (args) => (
    <div className="flex items-center gap-3">
      <Switch {...args} />
      <Label htmlFor={args.id}>Reduce motion</Label>
    </div>
  ),
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const control = within(canvasElement).getByRole("switch", { name: "Reduce motion" });
    await userEvent.click(control);
    await expect(control).toHaveAttribute("aria-checked", "true");
  },
};
export const Checked: Story = { args: { defaultChecked: true } };
export const Small: Story = { args: { size: "sm" } };
export const Disabled: Story = { args: { disabled: true, defaultChecked: true } };
