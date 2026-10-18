import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowUpRight, MoreHorizontal } from "lucide-react";

import { Badge } from "../badge/badge.js";
import { Button } from "../button/button.js";
import { IconButton } from "../icon-button/icon-button.js";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card.js";

const meta = {
  title: "Components/Data Display/Card",
  component: Card,
  tags: ["autodocs"],
  args: { variant: "surface", interactive: false, size: "md" },
  argTypes: {
    variant: { control: "inline-radio", options: ["surface", "glass", "solid", "gradient"] },
    size: { control: "inline-radio", options: ["md", "lg"] },
  },
  decorators: [(Story) => <div className="w-96">{Story()}</div>],
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Hydrogen storefront</CardTitle>
        <CardDescription>Headless commerce rebuild for a multi-brand retailer.</CardDescription>
        <CardAction>
          <IconButton label="Project actions" icon={<MoreHorizontal />} size="sm" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Badge size="sm">Hydrogen</Badge>
        <Badge size="sm">React</Badge>
        <Badge size="sm">TypeScript</Badge>
      </CardContent>
      <CardFooter>
        <Button variant="link">
          Read the case study <ArrowUpRight />
        </Button>
      </CardFooter>
    </Card>
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Surface: Story = {};
export const Glass: Story = {
  args: { variant: "glass" },
  decorators: [
    (Story) => (
      <div className="rounded-overlay bg-[radial-gradient(circle_at_30%_20%,var(--gradient-start),transparent_55%),radial-gradient(circle_at_80%_80%,var(--gradient-end),transparent_50%)] p-8">
        {Story()}
      </div>
    ),
  ],
};
export const Solid: Story = { args: { variant: "solid" } };
export const Gradient: Story = { args: { variant: "gradient", size: "lg" } };
export const Interactive: Story = { args: { interactive: true } };
