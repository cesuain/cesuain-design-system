import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ArrowUpRight,
  Briefcase,
  Copy,
  Download,
  GitBranch,
  Hash,
  Mail,
  Search,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";

import { Button } from "../button/button.js";
import { Kbd } from "../kbd/kbd.js";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandItemIcon,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./command.js";

const meta = {
  title: "Components/Data Display/Command",
  component: Command,
  tags: ["autodocs"],
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

function PaletteItems() {
  return (
    <>
      <CommandInput placeholder="Type a command or search…" end={<Kbd>Esc</Kbd>} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          {[
            { label: "Work", icon: <Briefcase /> },
            { label: "About", icon: <User /> },
            { label: "Contact", icon: <Hash /> },
          ].map((item) => (
            <CommandItem key={item.label}>
              <CommandItemIcon>{item.icon}</CommandItemIcon>
              <span className="flex-1">{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Links">
          <CommandItem>
            <CommandItemIcon>
              <GitBranch />
            </CommandItemIcon>
            <span className="flex-1">Open GitHub</span>
            <ArrowUpRight className="size-3.5" />
          </CommandItem>
          <CommandItem>
            <CommandItemIcon>
              <Mail />
            </CommandItemIcon>
            <span className="flex-1">Send an email</span>
          </CommandItem>
          <CommandItem>
            <CommandItemIcon>
              <Copy />
            </CommandItemIcon>
            <span className="flex-1">Copy email address</span>
            <CommandShortcut>⌘C</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Documents">
          <CommandItem>
            <CommandItemIcon>
              <Download />
            </CommandItemIcon>
            <span className="flex-1">Download résumé</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
      <CommandFooter>
        <span>
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd> to navigate
        </span>
        <span>
          <Kbd>↵</Kbd> to select
        </span>
      </CommandFooter>
    </>
  );
}

export const Inline: Story = {
  render: () => (
    <Command label="Commands" className="w-[32rem] border border-border shadow-elevation-lg">
      <PaletteItems />
    </Command>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("combobox"), "email");
    await expect(canvas.getAllByRole("option")).toHaveLength(2);
  },
};

function PaletteDemo() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        <Search /> Search <Kbd className="ml-2">⌘K</Kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <PaletteItems />
      </CommandDialog>
    </>
  );
}

export const Palette: Story = {
  name: "Command palette (⌘K)",
  render: () => <PaletteDemo />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: /Search/ }));
    await waitFor(() =>
      expect(screen.getByRole("dialog", { name: "Command palette" })).toBeVisible(),
    );
    await userEvent.keyboard("{Escape}");
  },
};
