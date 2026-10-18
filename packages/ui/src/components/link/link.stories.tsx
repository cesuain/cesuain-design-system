import type { Meta, StoryObj } from "@storybook/react-vite";

import { Link } from "./link.js";

const meta = {
  title: "Components/Navigation/Link",
  component: Link,
  tags: ["autodocs"],
  args: { href: "#", children: "Read the case study" },
  argTypes: { variant: { control: "inline-radio", options: ["default", "underline", "subtle"] } },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Underline: Story = { args: { variant: "underline" } };
export const Subtle: Story = { args: { variant: "subtle", children: "Privacy" } };
export const External: Story = {
  args: { href: "https://github.com", external: true, children: "GitHub" },
};

export const InText: Story = {
  name: "In running text",
  render: () => (
    <p className="max-w-prose text-body-md text-muted-foreground">
      I build commerce front ends with <Link href="#">Shopify Hydrogen</Link> and maintain design
      systems. The source for this library is on{" "}
      <Link href="https://github.com" external>
        GitHub
      </Link>
      .
    </p>
  ),
};
