import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";

import { Button } from "../button/button.js";
import { Field, FieldGroup, FieldLabel } from "../field/field.js";
import { Input } from "../input/input.js";
import { Textarea } from "../textarea/textarea.js";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog.js";

const meta = {
  title: "Components/Overlays/Dialog",
  component: DialogContent,
  tags: ["autodocs"],
  args: { size: "md", showCloseButton: true },
  argTypes: { size: { control: "inline-radio", options: ["sm", "md", "lg"] } },
  render: (args) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="gradient">Start a project</Button>
      </DialogTrigger>
      <DialogContent {...args}>
        <DialogHeader>
          <DialogTitle>Start a project</DialogTitle>
          <DialogDescription>Tell me a little about what you are building.</DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="dlg-name">Name</FieldLabel>
            <Input id="dlg-name" placeholder="Ada Lovelace" />
          </Field>
          <Field>
            <FieldLabel htmlFor="dlg-brief">Brief</FieldLabel>
            <Textarea id="dlg-brief" placeholder="A Hydrogen storefront for…" />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Send</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
} satisfies Meta<typeof DialogContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { name: "Start a project" });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole("dialog", { name: "Start a project" });
    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  },
};

export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };
