import type { Meta, StoryObj } from "@storybook/react-vite";
import { Globe, Layers, Palette, Zap } from "lucide-react";

import { Grid } from "../grid/grid.js";
import { FeatureCard } from "./feature-card.js";

const meta = {
  title: "Patterns/Feature Card",
  component: FeatureCard,
  tags: ["autodocs"],
  args: {
    icon: <Layers />,
    title: "Design systems",
    description: "Tokens, components and documentation that keep product teams consistent.",
    accent: "cyan",
    featured: false,
    size: "md",
  },
  argTypes: {
    size: { control: "inline-radio", options: ["md", "lg"] },
    accent: { control: "inline-radio", options: ["blue", "cyan", "purple"] },
    icon: { control: false },
  },
  decorators: [(Story) => <div className="w-96">{Story()}</div>],
} satisfies Meta<typeof FeatureCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Purple: Story = { args: { accent: "purple", icon: <Palette /> } };
export const Large: Story = { args: { size: "lg", featured: true } };

export const Bento: Story = {
  decorators: [(Story) => <div className="w-[60rem]">{Story()}</div>],
  render: () => (
    <Grid columns={12}>
      <FeatureCard
        className="lg:col-span-7"
        featured
        accent="blue"
        icon={<Globe />}
        title="Commerce"
        description="Headless storefronts built for speed and conversion."
      />
      <FeatureCard
        className="lg:col-span-5"
        accent="cyan"
        icon={<Zap />}
        title="Performance"
        description="Core Web Vitals as a feature."
      />
      <FeatureCard
        className="lg:col-span-5"
        accent="purple"
        icon={<Palette />}
        title="Interfaces"
        description="Motion and detail."
      />
      <FeatureCard
        className="lg:col-span-7"
        featured
        accent="cyan"
        icon={<Layers />}
        title="Systems"
        description="Shared foundations across products."
      />
    </Grid>
  ),
};
