import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { Label } from "../label/label.js";
import { RadioGroup, RadioGroupItem } from "./radio-group.js";

const options = [
  { value: "frontend", label: "Frontend" },
  { value: "full-stack", label: "Full stack" },
  { value: "shopify", label: "Shopify" },
];

const meta = {
  title: "Components/Forms/Radio Group",
  component: RadioGroup,
  tags: ["autodocs"],
  args: { "aria-label": "CV variant", defaultValue: "frontend", orientation: "vertical" },
  render: (args) => (
    <RadioGroup {...args}>
      {options.map((o) => (
        <div key={o.value} className="flex items-center gap-3">
          <RadioGroupItem value={o.value} id={`rg-${o.value}`} />
          <Label htmlFor={`rg-${o.value}`}>{o.label}</Label>
        </div>
      ))}
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("radio", { name: "Shopify" }));
    await expect(canvas.getByRole("radio", { name: "Shopify" })).toBeChecked();
    // Hold the key: Radix selects on the deferred focus move only while an arrow key is down.
    await userEvent.keyboard("{ArrowUp>}");
    await waitFor(() => expect(canvas.getByRole("radio", { name: "Full stack" })).toBeChecked());
    await userEvent.keyboard("{/ArrowUp}");
    await expect(canvas.getByRole("radio", { name: "Full stack" })).toHaveFocus();
  },
};

export const Horizontal: Story = { args: { orientation: "horizontal", className: "flex gap-6" } };
export const Disabled: Story = { args: { disabled: true } };
