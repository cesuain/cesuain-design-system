import type { Meta, StoryObj } from "@storybook/react-vite";

import { SectionHeading } from "./section-heading.js";

const meta = {
  title: "Patterns/Section Heading",
  component: SectionHeading,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    eyebrow: "Experience",
    title: "Where I've",
    highlight: "worked",
    description: "Product teams, agencies and commerce brands, building interfaces that ship.",
    align: "left",
  },
  argTypes: { align: { control: "inline-radio", options: ["left", "center"] } },
} satisfies Meta<typeof SectionHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Centered: Story = { args: { align: "center" } };
export const TitleOnly: Story = {
  args: { eyebrow: undefined, highlight: undefined, description: undefined, title: "Contact" },
};
