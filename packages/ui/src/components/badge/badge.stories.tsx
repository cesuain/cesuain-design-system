import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircleCheck, Sparkles } from "lucide-react";

import { Badge } from "./badge.js";

const variants = [
  "default",
  "primary",
  "brand",
  "gradient",
  "outline",
  "success",
  "warning",
  "destructive",
] as const;

const meta = {
  title: "Components/Data Display/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: { children: "TypeScript", variant: "default", size: "md" },
  argTypes: {
    variant: { control: "select", options: variants },
    size: { control: "inline-radio", options: ["sm", "md"] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: Story = {
  name: "All variants",
  render: () => (
    <div className="flex flex-wrap gap-2">
      {variants.map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success">
        <CircleCheck aria-hidden="true" /> Available for work
      </Badge>
      <Badge variant="gradient">
        <Sparkles aria-hidden="true" /> New
      </Badge>
    </div>
  ),
};

export const AsLink: Story = {
  render: () => (
    <Badge asChild>
      <a href="#">#design-systems</a>
    </Badge>
  ),
};

export const Small: Story = { args: { size: "sm" } };
