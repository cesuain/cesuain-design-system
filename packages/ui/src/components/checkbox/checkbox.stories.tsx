import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

import { Label } from "../label/label.js";
import { Checkbox } from "./checkbox.js";

const meta = {
  title: "Components/Forms/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: { id: "checkbox-terms" },
  render: (args) => (
    <div className="flex items-center gap-3">
      <Checkbox {...args} />
      <Label htmlFor={args.id}>Accept terms and conditions</Label>
    </div>
  ),
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const checkbox = within(canvasElement).getByRole("checkbox", {
      name: "Accept terms and conditions",
    });
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
  },
};

export const Checked: Story = { args: { defaultChecked: true } };
export const Indeterminate: Story = { args: { checked: "indeterminate" } };
export const Invalid: Story = { args: { "aria-invalid": true } };
export const Disabled: Story = { args: { disabled: true } };

function SelectAllDemo() {
  const items = ["Colors", "Typography", "Spacing"];
  const [selected, setSelected] = useState<string[]>(["Colors"]);
  const all = selected.length === items.length;
  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-3">
        <Checkbox
          id="select-all"
          checked={all ? true : selected.length > 0 ? "indeterminate" : false}
          onCheckedChange={(checked) => setSelected(checked === true ? items : [])}
        />
        <Label htmlFor="select-all">All foundations</Label>
      </div>
      {items.map((item) => (
        <div key={item} className="ml-6 flex items-center gap-3">
          <Checkbox
            id={`fnd-${item}`}
            checked={selected.includes(item)}
            onCheckedChange={(checked) =>
              setSelected((prev) => (checked ? [...prev, item] : prev.filter((x) => x !== item)))
            }
          />
          <Label htmlFor={`fnd-${item}`}>{item}</Label>
        </div>
      ))}
    </div>
  );
}

export const SelectAll: Story = { render: () => <SelectAllDemo /> };
