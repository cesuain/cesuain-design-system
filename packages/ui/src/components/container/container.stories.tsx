import type { Meta, StoryObj } from "@storybook/react-vite";

import { Container } from "./container.js";

const meta = {
  title: "Components/Layout/Container",
  component: Container,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { size: "xl" },
  argTypes: { size: { control: "inline-radio", options: ["sm", "md", "lg", "xl", "full"] } },
  render: (args) => (
    <Container {...args} className="py-8">
      <div className="grid h-32 place-items-center rounded-card border border-dashed border-brand/50 bg-brand/5 font-mono text-body-sm text-muted-foreground">
        container · {args.size}
      </div>
    </Container>
  ),
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ExtraLarge: Story = {};
export const Large: Story = { args: { size: "lg" } };
export const Medium: Story = { args: { size: "md" } };
export const Small: Story = { args: { size: "sm" } };
