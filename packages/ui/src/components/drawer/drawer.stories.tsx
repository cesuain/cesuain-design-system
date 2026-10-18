import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, within } from "storybook/test";

import { Button } from "../button/button.js";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer.js";

const meta = {
  title: "Components/Overlays/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  args: { direction: "bottom" },
  argTypes: { direction: { control: "inline-radio", options: ["top", "right", "bottom", "left"] } },
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger asChild>
        <Button variant="secondary">Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Download résumé</DrawerTitle>
            <DrawerDescription>Choose the version that fits the role.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button>Frontend (PDF)</Button>
            <Button variant="secondary">Shopify (PDF)</Button>
            <DrawerClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  ),
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Bottom: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Open drawer" }));
    await expect(
      await screen.findByRole("dialog", { name: "Download résumé" }),
    ).toBeInTheDocument();
  },
};
export const Right: Story = { args: { direction: "right" } };
