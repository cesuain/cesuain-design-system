import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "./stack.js";

const Box = ({ label }: { label: string }) => (
  <div className="grid h-14 min-w-20 place-items-center rounded-item px-4 font-mono text-caption text-muted-foreground surface">
    {label}
  </div>
);

const meta = {
  title: "Components/Layout/Stack",
  component: Stack,
  tags: ["autodocs"],
  args: { direction: "column", gap: "md" },
  argTypes: {
    direction: { control: "inline-radio", options: ["column", "row", "responsive"] },
    gap: { control: "inline-radio", options: ["none", "xs", "sm", "md", "lg", "xl"] },
    align: {
      control: "select",
      options: [undefined, "start", "center", "end", "stretch", "baseline"],
    },
    justify: { control: "select", options: [undefined, "start", "center", "end", "between"] },
  },
  render: (args) => (
    <Stack {...args} className="w-96">
      <Box label="one" />
      <Box label="two" />
      <Box label="three" />
    </Stack>
  ),
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Column: Story = {};
export const Row: Story = { args: { direction: "row", gap: "sm" } };
export const Between: Story = { args: { direction: "row", justify: "between", align: "center" } };
export const Responsive: Story = { args: { direction: "responsive", gap: "lg" } };
