import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, within } from "storybook/test";

import { Field, FieldDescription, FieldLabel } from "../field/field.js";
import { DatePicker } from "./date-picker.js";

const meta = {
  title: "Components/Forms/Date Picker",
  component: DatePicker,
  tags: ["autodocs"],
  args: { placeholder: "Pick a date", size: "md" },
  argTypes: { size: { control: "inline-radio", options: ["sm", "md", "lg"] } },
  decorators: [(Story) => <div className="w-72">{Story()}</div>],
  render: (args) => (
    <Field>
      <FieldLabel htmlFor="dp-start">Project start</FieldLabel>
      <DatePicker {...args} id="dp-start" aria-describedby="dp-start-hint" />
      <FieldDescription id="dp-start-hint">When should work begin?</FieldDescription>
    </Field>
  ),
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultValue: new Date(2026, 4, 14) },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { name: /Project start/ });
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole("button", { name: /May 21, 2026/ }));
    await expect(trigger).toHaveTextContent("May 21st, 2026");
  },
};
export const Empty: Story = {};
export const FutureOnly: Story = {
  name: "Future dates only",
  args: { disabledDays: { before: new Date(2026, 4, 10) }, defaultValue: new Date(2026, 4, 14) },
};
export const Invalid: Story = { args: { "aria-invalid": true } };
export const Disabled: Story = { args: { disabled: true } };
