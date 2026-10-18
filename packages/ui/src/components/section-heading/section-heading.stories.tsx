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
    size: "lg",
  },
  argTypes: {
    align: { control: "inline-radio", options: ["left", "center"] },
    size: { control: "inline-radio", options: ["lg", "xl", "2xl"] },
  },
} satisfies Meta<typeof SectionHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Centered: Story = { args: { align: "center" } };
/** The page-level section title used on cesarfonseca.dev. */
export const Large: Story = { args: { size: "2xl" } };
export const TitleOnly: Story = {
  args: { eyebrow: undefined, highlight: undefined, description: undefined, title: "Contact" },
};
