import type { Meta, StoryObj } from "@storybook/react-vite";
import { Copy, ExternalLink, Pin, Trash2 } from "lucide-react";
import { expect, fireEvent, screen, waitFor, within } from "storybook/test";

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "./context-menu.js";

const meta = {
  title: "Components/Overlays/Context Menu",
  component: ContextMenu,
  tags: ["autodocs"],
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="grid h-40 w-80 place-items-center rounded-card border border-dashed border-border-strong text-body-sm text-muted-foreground">
        Right-click this project card
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuLabel>Hydrogen storefront</ContextMenuLabel>
        <ContextMenuItem>
          <ExternalLink /> Open case study <ContextMenuShortcut>↵</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <Copy /> Copy link <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuCheckboxItem checked>
          <Pin /> Pinned
        </ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">
          <Trash2 /> Remove
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
  play: async ({ canvasElement }) => {
    await fireEvent.contextMenu(within(canvasElement).getByText(/Right-click/));
    await waitFor(() => expect(screen.getByRole("menu")).toBeVisible());
    await expect(screen.getByRole("menuitem", { name: /Open case study/ })).toBeInTheDocument();
  },
};
