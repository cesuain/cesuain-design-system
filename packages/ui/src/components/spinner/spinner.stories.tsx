import type { Meta, StoryObj } from "@storybook/react-vite";

import { Spinner } from "./spinner.js";

const meta = {
  title: "Components/Feedback/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  args: { size: "md", label: "Loading" },
  argTypes: { size: { control: "inline-radio", options: ["sm", "md", "lg"] } },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6 text-brand">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};

export const InlineWithText: Story = {
  render: () => (
    <p className="flex items-center gap-2 text-body-sm text-muted-foreground">
      <Spinner size="sm" label={null} />
      Syncing tokens with Figma…
    </p>
  ),
};
