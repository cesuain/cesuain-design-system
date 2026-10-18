import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronDown, Copy, Share } from "lucide-react";

import { Button } from "../button/button.js";
import { IconButton } from "../icon-button/icon-button.js";
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "./button-group.js";

const meta = {
  title: "Components/Actions/Button Group",
  component: ButtonGroup,
  tags: ["autodocs"],
  args: { "aria-label": "Document actions", orientation: "horizontal" },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Outline: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">Preview</Button>
      <Button variant="outline">Code</Button>
      <Button variant="outline">Tokens</Button>
    </ButtonGroup>
  ),
};

export const SplitButton: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button>Publish</Button>
      <ButtonGroupSeparator className="bg-primary-foreground/20" />
      <IconButton variant="default" label="More publish options" icon={<ChevronDown />} />
    </ButtonGroup>
  ),
};

export const WithText: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupText>v1.0.0</ButtonGroupText>
      <Button variant="outline">
        <Copy /> Copy
      </Button>
      <Button variant="outline">
        <Share /> Share
      </Button>
    </ButtonGroup>
  ),
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">Foundations</Button>
      <Button variant="outline">Components</Button>
      <Button variant="outline">Patterns</Button>
    </ButtonGroup>
  ),
};
