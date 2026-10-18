import type { Meta, StoryObj } from "@storybook/react-vite";

import { Grid } from "../grid/grid.js";
import { StatCard } from "./stat-card.js";

const meta = {
  title: "Patterns/Stat Card",
  component: StatCard,
  tags: ["autodocs"],
  args: {
    value: "64",
    label: "Components",
    description: "Each with tests, stories and a README.",
    size: "md",
  },
  argTypes: { size: { control: "inline-radio", options: ["md", "lg"] } },
  decorators: [(Story) => <div className="w-64">{Story()}</div>],
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Large: Story = { args: { size: "lg" } };

export const Row: Story = {
  decorators: [(Story) => <div className="w-[52rem]">{Story()}</div>],
  render: () => (
    <Grid columns={4}>
      <StatCard
        value="300"
        label="Design tokens"
        description="Primitive, semantic and component."
      />
      <StatCard value="2" label="Themes" description="Dark by default, light on demand." />
      <StatCard value="50" label="Contrast checks" description="Enforced at build time." />
      <StatCard value="AA" label="WCAG target" description="Keyboard and screen reader tested." />
    </Grid>
  ),
};
