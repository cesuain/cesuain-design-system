import type { Meta, StoryObj } from "@storybook/react-vite";
import { AtSign, Copy, Search, SendHorizontal } from "lucide-react";
import { expect, userEvent, within } from "storybook/test";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "./input-group.js";

const meta = {
  title: "Components/Forms/Input Group",
  component: InputGroup,
  tags: ["autodocs"],
  decorators: [(Story) => <div className="w-96">{Story()}</div>],
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SearchWithShortcut: Story = {
  render: () => (
    <InputGroup>
      <InputGroupInput aria-label="Search" placeholder="Search components…" />
      <InputGroupAddon>
        <Search aria-hidden="true" />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <kbd className="rounded-indicator border border-border bg-muted px-1.5 font-mono text-caption text-muted-foreground">
          ⌘K
        </kbd>
      </InputGroupAddon>
    </InputGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText("⌘K"));
    await expect(canvas.getByRole("textbox", { name: "Search" })).toHaveFocus();
  },
};

export const PrefixAndSuffix: Story = {
  render: () => (
    <InputGroup>
      <InputGroupInput aria-label="Website" placeholder="your-portfolio" />
      <InputGroupAddon>
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <InputGroupText>.dev</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const WithButton: Story = {
  render: () => (
    <InputGroup>
      <InputGroupInput aria-label="Share link" defaultValue="https://cesarfonseca.dev" readOnly />
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="icon-sm" aria-label="Copy link">
          <Copy />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <InputGroup>
      <InputGroupInput aria-label="Username" placeholder="cesuain" />
      <InputGroupAddon>
        <AtSign aria-hidden="true" />
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const Textarea: Story = {
  render: () => (
    <InputGroup>
      <InputGroupTextarea
        aria-label="Message"
        placeholder="Ask anything about the design system…"
      />
      <InputGroupAddon align="block-end" className="justify-between">
        <InputGroupText>Markdown supported</InputGroupText>
        <InputGroupButton variant="default" size="icon-sm" aria-label="Send">
          <SendHorizontal />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const Invalid: Story = {
  render: () => (
    <InputGroup>
      <InputGroupInput aria-label="Email" aria-invalid defaultValue="ada@" />
      <InputGroupAddon>
        <AtSign aria-hidden="true" />
      </InputGroupAddon>
    </InputGroup>
  ),
};
