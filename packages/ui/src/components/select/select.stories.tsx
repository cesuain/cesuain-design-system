import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";

import { Label } from "../label/label.js";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select.js";

const meta = {
  title: "Components/Forms/Select",
  component: Select,
  tags: ["autodocs"],
  args: { defaultValue: undefined },
  decorators: [(Story) => <div className="w-72">{Story()}</div>],
  render: (args) => (
    <div className="grid gap-2">
      <Label htmlFor="select-stack">Stack</Label>
      <Select {...args}>
        <SelectTrigger id="select-stack">
          <SelectValue placeholder="Choose a stack" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Frameworks</SelectLabel>
            <SelectItem value="next">Next.js</SelectItem>
            <SelectItem value="hydrogen">Shopify Hydrogen</SelectItem>
            <SelectItem value="remix">React Router</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Styling</SelectLabel>
            <SelectItem value="tailwind">Tailwind CSS</SelectItem>
            <SelectItem value="vanilla" disabled>
              Vanilla Extract
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("combobox", { name: "Stack" });
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole("option", { name: "Shopify Hydrogen" }));
    await expect(trigger).toHaveTextContent("Shopify Hydrogen");
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
  },
};

export const WithValue: Story = { args: { defaultValue: "next" } };

export const Small: Story = {
  render: () => (
    <Select defaultValue="md">
      <SelectTrigger size="sm" aria-label="Density">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="sm">Compact</SelectItem>
        <SelectItem value="md">Comfortable</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Invalid: Story = {
  render: () => (
    <Select>
      <SelectTrigger aria-label="Country" aria-invalid>
        <SelectValue placeholder="Required" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="br">Brazil</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = { args: { disabled: true } };
