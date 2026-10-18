"use client";

import { Command as CommandPrimitive, useCommandState } from "cmdk";
import { SearchIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { menuShortcut } from "../../lib/styles.js";
import { cn } from "../../lib/utils.js";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../dialog/dialog.js";

/** Searchable list of commands with keyboard navigation (cmdk). */
export function Command({ className, ...props }: ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "flex size-full flex-col overflow-hidden rounded-overlay bg-popover text-popover-foreground",
        className,
      )}
      {...props}
    />
  );
}

export type CommandDialogProps = ComponentProps<typeof Dialog> & {
  /** Accessible name of the dialog (visually hidden). */
  title?: string;
  /** Accessible description of the dialog (visually hidden). */
  description?: string;
  className?: string;
  /** Props forwarded to the inner `Command`, e.g. `filter` or `loop`. */
  commandProps?: ComponentProps<typeof CommandPrimitive>;
};

/** The command palette: a `Command` inside a modal dialog, typically opened with ⌘K. */
export function CommandDialog({
  title = "Command palette",
  description = "Search for a page or action.",
  children,
  className,
  commandProps,
  ...props
}: CommandDialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent
        size="md"
        showCloseButton={false}
        className={cn("top-[20vh] translate-y-0 gap-0 overflow-hidden p-0", className)}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>
        <Command {...commandProps}>{children}</Command>
      </DialogContent>
    </Dialog>
  );
}

export type CommandInputProps = ComponentProps<typeof CommandPrimitive.Input> & {
  /** Content after the input, e.g. an `Esc` key hint. */
  end?: ReactNode;
};

export function CommandInput({ className, end, ...props }: CommandInputProps) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex items-center gap-3 border-b border-border px-4"
    >
      <SearchIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "h-14 w-full bg-transparent text-body-md text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
      {end}
    </div>
  );
}

export function CommandList({ className, ...props }: ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "no-scrollbar max-h-[min(26rem,60vh)] scroll-py-2 overflow-x-hidden overflow-y-auto overscroll-contain p-2 outline-none",
        className,
      )}
      {...props}
    />
  );
}

export function CommandEmpty({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn("py-10 text-center text-body-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export function CommandGroup({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden text-foreground",
        "**:[[cmdk-group-heading]]:px-3 **:[[cmdk-group-heading]]:pt-3 **:[[cmdk-group-heading]]:pb-1.5 **:[[cmdk-group-heading]]:font-eyebrow **:[[cmdk-group-heading]]:text-caption **:[[cmdk-group-heading]]:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export type CommandSeparatorProps = ComponentProps<"div"> & {
  /** Keep the divider visible while the user is searching. */
  alwaysRender?: boolean;
};

/**
 * Visual divider between groups. cmdk's own separator uses `role="separator"`, which ARIA does
 * not allow inside a listbox, so this one is presentational and mirrors cmdk's hide-on-search.
 */
export function CommandSeparator({ className, alwaysRender, ...props }: CommandSeparatorProps) {
  const searching = useCommandState((state) => state.search.length > 0);
  if (searching && !alwaysRender) return null;
  return (
    <div
      data-slot="command-separator"
      role="none"
      className={cn("-mx-2 my-2 h-px bg-border", className)}
      {...props}
    />
  );
}

export function CommandItem({ className, ...props }: ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "group/command-item relative flex cursor-pointer items-center gap-3 rounded-item px-3 py-2.5 text-body-sm text-foreground/85 outline-none select-none",
        "transition-colors duration-(--cds-duration-fast) data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

/** Square icon tile at the start of an item. */
export function CommandItemIcon({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="command-item-icon"
      aria-hidden="true"
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-item border border-border bg-foreground/[0.03]",
        className,
      )}
      {...props}
    />
  );
}

export function CommandShortcut({ className, ...props }: ComponentProps<"span">) {
  return <span data-slot="command-shortcut" className={cn(menuShortcut, className)} {...props} />;
}

/** Key hints shown under the list ("↑↓ to navigate, ↵ to select"). */
export function CommandFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="command-footer"
      className={cn(
        "flex items-center justify-between gap-4 border-t border-border px-4 py-2.5 text-caption text-muted-foreground [&>span]:flex [&>span]:items-center [&>span]:gap-1.5",
        className,
      )}
      {...props}
    />
  );
}
