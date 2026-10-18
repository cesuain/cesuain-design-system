import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox } from "../checkbox/checkbox.js";
import { Input } from "../input/input.js";
import { Label } from "./label.js";

const meta = {
  title: "Components/Forms/Label",
  component: Label,
  tags: ["autodocs"],
  args: { children: "Email address", htmlFor: "label-email" },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithInput: Story = {
  render: (args) => (
    <div className="grid w-80 gap-2">
      <Label {...args} />
      <Input id="label-email" type="email" placeholder="you@company.com" />
    </div>
  ),
};

export const WithCheckbox: Story = {
  args: { htmlFor: "label-terms", children: "Accept the terms and conditions" },
  render: (args) => (
    <div className="flex items-center gap-3">
      <Checkbox id="label-terms" />
      <Label {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: { htmlFor: "label-disabled", children: "Disabled field" },
  render: (args) => (
    <div className="flex items-center gap-3">
      <Checkbox id="label-disabled" disabled />
      <Label {...args} />
    </div>
  ),
};
