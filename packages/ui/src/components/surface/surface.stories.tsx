import type { Meta, StoryObj } from "@storybook/react-vite";

import { Surface } from "./surface.js";

const meta = {
  title: "Components/Layout/Surface",
  component: Surface,
  tags: ["autodocs"],
  args: { variant: "surface", radius: "card", padding: "lg", elevation: "none" },
  argTypes: {
    variant: { control: "inline-radio", options: ["surface", "glass", "panel", "muted"] },
    radius: { control: "inline-radio", options: ["none", "item", "card", "overlay", "full"] },
    padding: { control: "inline-radio", options: ["none", "sm", "md", "lg", "xl"] },
    elevation: { control: "inline-radio", options: ["none", "sm", "md", "lg", "xl"] },
  },
  render: (args) => (
    <Surface {...args} className="w-80">
      <p className="text-label-md">{args.variant}</p>
      <p className="mt-1 text-body-sm text-muted-foreground">
        A styled container without semantics.
      </p>
    </Surface>
  ),
} satisfies Meta<typeof Surface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Glass: Story = { args: { variant: "glass" } };
export const Panel: Story = { args: { variant: "panel", elevation: "lg" } };
export const Muted: Story = { args: { variant: "muted" } };
export const AllVariants: Story = {
  name: "All variants",
  render: () => (
    <div className="grid grid-cols-2 gap-4 rounded-overlay bg-[radial-gradient(circle_at_20%_10%,var(--gradient-start),transparent_50%),radial-gradient(circle_at_90%_90%,var(--gradient-end),transparent_45%)] p-6">
      {(["surface", "glass", "panel", "muted"] as const).map((variant) => (
        <Surface key={variant} variant={variant} padding="lg" className="w-48">
          <p className="font-mono text-body-sm">{variant}</p>
        </Surface>
      ))}
    </div>
  ),
};
