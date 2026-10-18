import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Label } from "../label/label.js";
import { Input } from "./input.js";

const meta = {
  title: "Components/Forms/Input",
  component: Input,
  tags: ["autodocs"],
  args: { placeholder: "you@company.com", type: "email", "aria-label": "Email", inputSize: "md" },
  argTypes: {
    inputSize: { control: "inline-radio", options: ["sm", "md", "lg"] },
    type: {
      control: "select",
      options: ["text", "email", "password", "search", "number", "url", "file"],
    },
  },
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("textbox", { name: "Email" });
    await userEvent.type(input, "hello@cesuain.dev");
    await expect(input).toHaveValue("hello@cesuain.dev");
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid gap-2">
      <Label htmlFor="input-email">Email</Label>
      <Input {...args} id="input-email" aria-label={undefined} />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="grid gap-3">
      <Input {...args} inputSize="sm" aria-label="Small" placeholder="Small" />
      <Input {...args} inputSize="md" aria-label="Medium" placeholder="Medium" />
      <Input {...args} inputSize="lg" aria-label="Large" placeholder="Large" />
    </div>
  ),
};

export const Invalid: Story = { args: { "aria-invalid": true, defaultValue: "not-an-email" } };

export const Disabled: Story = { args: { disabled: true } };

export const File: Story = {
  args: { type: "file", placeholder: undefined, "aria-label": "Attachment" },
};
