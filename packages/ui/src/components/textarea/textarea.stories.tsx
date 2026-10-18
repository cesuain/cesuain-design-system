import type { Meta, StoryObj } from "@storybook/react-vite";

import { Textarea } from "./textarea.js";

const meta = {
  title: "Components/Forms/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  args: { "aria-label": "Message", placeholder: "Tell me about your project…" },
  decorators: [(Story) => <div className="w-96">{Story()}</div>],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const AutoResize: Story = {
  args: { autoResize: true, defaultValue: "Grows with its content.\nTry adding lines." },
};
export const Invalid: Story = { args: { "aria-invalid": true } };
export const Disabled: Story = { args: { disabled: true } };
