import type { Meta, StoryObj } from "@storybook/react-vite";

import { Grid } from "./grid.js";

const Cell = ({ label, className }: { label: string; className?: string }) => (
  <div
    className={`grid h-28 place-items-center rounded-card font-mono text-caption text-muted-foreground surface ${className ?? ""}`}
  >
    {label}
  </div>
);

const meta = {
  title: "Components/Layout/Grid",
  component: Grid,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { columns: 3, gap: "md" },
  argTypes: {
    columns: { control: "select", options: [1, 2, 3, 4, 12, "auto"] },
    gap: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
  render: (args) => (
    <Grid {...args}>
      {Array.from({ length: 6 }, (_, i) => (
        <Cell key={i} label={`cell ${i + 1}`} />
      ))}
    </Grid>
  ),
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThreeColumns: Story = {};
export const Auto: Story = { args: { columns: "auto" } };
export const Bento: Story = {
  name: "Bento (12 columns)",
  args: { columns: 12 },
  render: (args) => (
    <Grid {...args}>
      <Cell label="lg:col-span-7" className="lg:col-span-7" />
      <Cell label="lg:col-span-5" className="lg:col-span-5" />
      <Cell label="lg:col-span-5" className="lg:col-span-5" />
      <Cell label="lg:col-span-7" className="lg:col-span-7" />
    </Grid>
  ),
};
