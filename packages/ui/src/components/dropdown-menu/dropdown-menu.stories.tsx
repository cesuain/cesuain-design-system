import type { Meta, StoryObj } from "@storybook/react-vite";
import { Copy, LogOut, MoreHorizontal, Pencil, Share2, Trash2, User } from "lucide-react";
import { useState } from "react";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";

import { Button } from "../button/button.js";
import { IconButton } from "../icon-button/icon-button.js";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu.js";

const meta = {
  title: "Components/Overlays/Dropdown Menu",
  component: DropdownMenu,
  tags: ["autodocs"],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">
          <User /> Account
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Signed in as Cesar</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User /> Profile <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Share2 /> Share
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>
                <Copy /> Copy link
              </DropdownMenuItem>
              <DropdownMenuItem>Email</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Account" }));
    const menu = await screen.findByRole("menu");
    await waitFor(() => expect(menu).toBeVisible());
    await userEvent.keyboard("{ArrowDown}");
    await expect(screen.getByRole("menuitem", { name: /Profile/ })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
  },
};

function SettingsDemo() {
  const [grid, setGrid] = useState(true);
  const [rulers, setRulers] = useState(false);
  const [theme, setTheme] = useState("dark");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">View</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuLabel>Canvas</DropdownMenuLabel>
        {/* Preventing the default select keeps the menu open, so several options can be toggled in a row. */}
        <DropdownMenuCheckboxItem
          checked={grid}
          onCheckedChange={setGrid}
          onSelect={(event) => event.preventDefault()}
        >
          Show grid
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={rulers}
          onCheckedChange={setRulers}
          onSelect={(event) => event.preventDefault()}
        >
          Show rulers
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const CheckboxesAndRadios: Story = {
  name: "Checkboxes and radios",
  render: () => <SettingsDemo />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "View" }));
    const rulers = await screen.findByRole("menuitemcheckbox", { name: "Show rulers" });
    await userEvent.click(rulers);
    await waitFor(() =>
      expect(screen.getByRole("menuitemcheckbox", { name: "Show rulers" })).toHaveAttribute(
        "aria-checked",
        "true",
      ),
    );
    await userEvent.keyboard("{Escape}");
    // The rest of the page stays aria-hidden until the menu has fully closed.
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
  },
};

export const RowActions: Story = {
  name: "Row actions",
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton
          variant="ghost"
          size="sm"
          label="Actions for Hydrogen storefront"
          icon={<MoreHorizontal />}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Pencil /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Copy /> Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash2 /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
