import type { Meta, StoryObj } from "@storybook/react-vite";
import { Settings2 } from "lucide-react";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";

import { Button } from "../button/button.js";
import { Input } from "../input/input.js";
import { Label } from "../label/label.js";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "./popover.js";

const meta = {
  title: "Components/Overlays/Popover",
  component: PopoverContent,
  tags: ["autodocs"],
  args: { side: "bottom", align: "center" },
  argTypes: {
    side: { control: "inline-radio", options: ["top", "right", "bottom", "left"] },
    align: { control: "inline-radio", options: ["start", "center", "end"] },
  },
  render: (args) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">
          <Settings2 /> Layout
        </Button>
      </PopoverTrigger>
      <PopoverContent {...args} aria-label="Layout">
        <PopoverHeader>
          <PopoverTitle>Layout</PopoverTitle>
          <PopoverDescription>Grid settings for this section.</PopoverDescription>
        </PopoverHeader>
        <div className="grid grid-cols-[5rem_1fr] items-center gap-3">
          <Label htmlFor="pop-cols">Columns</Label>
          <Input id="pop-cols" defaultValue="12" inputSize="sm" />
          <Label htmlFor="pop-gap">Gutter</Label>
          <Input id="pop-gap" defaultValue="24px" inputSize="sm" />
        </div>
      </PopoverContent>
    </Popover>
  ),
} satisfies Meta<typeof PopoverContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Layout" }));
    await waitFor(() => expect(screen.getByRole("dialog", { name: "Layout" })).toBeVisible());
    await expect(screen.getByLabelText("Columns")).toHaveValue("12");
  },
};
export const Top: Story = { args: { side: "top" } };
export const AlignStart: Story = { args: { align: "start" } };
