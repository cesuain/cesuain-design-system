import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bold, Italic, Underline } from "lucide-react";
import { expect, screen, userEvent, within } from "storybook/test";

import { IconButton } from "../icon-button/icon-button.js";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip.js";

const meta = {
  title: "Components/Overlays/Tooltip",
  component: TooltipContent,
  tags: ["autodocs"],
  args: { side: "top" },
  argTypes: { side: { control: "inline-radio", options: ["top", "right", "bottom", "left"] } },
  decorators: [(Story) => <TooltipProvider delayDuration={150}>{Story()}</TooltipProvider>],
  render: (args) => (
    <div className="flex gap-1">
      {[
        { label: "Bold", icon: <Bold />, keys: "⌘B" },
        { label: "Italic", icon: <Italic />, keys: "⌘I" },
        { label: "Underline", icon: <Underline />, keys: "⌘U" },
      ].map((item) => (
        <Tooltip key={item.label}>
          <TooltipTrigger asChild>
            <IconButton label={item.label} icon={item.icon} variant="ghost" />
          </TooltipTrigger>
          <TooltipContent {...args}>
            {item.label} <span className="font-mono opacity-70">{item.keys}</span>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
} satisfies Meta<typeof TooltipContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.hover(within(canvasElement).getByRole("button", { name: "Italic" }));
    await expect(await screen.findByRole("tooltip")).toHaveTextContent("Italic");
    await userEvent.unhover(within(canvasElement).getByRole("button", { name: "Italic" }));
  },
};
export const Bottom: Story = { args: { side: "bottom" } };
