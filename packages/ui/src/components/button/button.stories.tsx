import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, ArrowUpRight, Download, Send } from "lucide-react";
import { expect, fn, userEvent, within } from "storybook/test";

import { Button } from "./button.js";

const meta = {
  title: "Components/Actions/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Get started", onClick: fn() },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "glow",
        "gradient",
        "secondary",
        "outline",
        "ghost",
        "destructive",
        "link",
      ],
    },
    size: { control: "select", options: ["sm", "md", "lg", "icon-sm", "icon", "icon-lg"] },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    asChild: { table: { disable: true } },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Get started" });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} variant="default">
        Default
      </Button>
      <Button {...args} variant="glow">
        Glow
      </Button>
      <Button {...args} variant="gradient">
        Gradient <Send />
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="outline">
        Outline
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
      <Button {...args} variant="destructive">
        Delete
      </Button>
      <Button {...args} variant="link">
        Link
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} variant="secondary">
        <Download /> Download CV
      </Button>
      <Button {...args}>
        Let&apos;s talk <ArrowRight />
      </Button>
    </div>
  ),
};

export const Loading: Story = {
  args: { loading: true, children: "Sending" },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Sending" });
    await expect(button).toHaveAttribute("aria-busy", "true");
    await expect(button).toBeDisabled();
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole("button");
    await expect(button).toBeDisabled();
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const AsLink: Story = {
  render: (args) => (
    <Button {...args} asChild variant="secondary">
      <a href="https://cesarfonseca.dev" target="_blank" rel="noreferrer">
        Visit cesarfonseca.dev <ArrowUpRight />
      </a>
    </Button>
  ),
};

export const KeyboardFocus: Story = {
  name: "Keyboard focus",
  render: (args) => (
    <div className="flex gap-3">
      <Button {...args}>First</Button>
      <Button {...args} variant="secondary">
        Second
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "First" })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Second" })).toHaveFocus();
  },
};
