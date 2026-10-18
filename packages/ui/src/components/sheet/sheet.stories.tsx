import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";

import { Button } from "../button/button.js";
import { Field, FieldGroup, FieldLabel } from "../field/field.js";
import { Input } from "../input/input.js";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet.js";

const meta = {
  title: "Components/Overlays/Sheet",
  component: SheetContent,
  tags: ["autodocs"],
  args: { side: "right" },
  argTypes: { side: { control: "inline-radio", options: ["top", "right", "bottom", "left"] } },
  render: (args) => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">Open {args.side} sheet</Button>
      </SheetTrigger>
      <SheetContent {...args}>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Update how you appear on the site.</SheetDescription>
        </SheetHeader>
        <FieldGroup className="px-(--cds-overlay-padding)">
          <Field>
            <FieldLabel htmlFor="sheet-name">Name</FieldLabel>
            <Input id="sheet-name" defaultValue="Cesar Fonseca" />
          </Field>
          <Field>
            <FieldLabel htmlFor="sheet-role">Role</FieldLabel>
            <Input id="sheet-role" defaultValue="Senior Frontend Engineer" />
          </Field>
        </FieldGroup>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button>Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
} satisfies Meta<typeof SheetContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Right: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: /Open right sheet/ }));
    await waitFor(() => expect(screen.getByRole("dialog", { name: "Edit profile" })).toBeVisible());
  },
};
export const Left: Story = { args: { side: "left" } };
export const Top: Story = { args: { side: "top" } };
export const Bottom: Story = { args: { side: "bottom" } };
