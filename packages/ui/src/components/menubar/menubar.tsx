"use client";

import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import { Menubar as MenubarPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

import {
  menuContent,
  menuIndicator,
  menuIndicatorItem,
  menuItem,
  menuItemDestructive,
  menuLabel,
  menuSeparator,
  menuShortcut,
} from "../../lib/styles.js";
import { cn } from "../../lib/utils.js";

/** A persistent horizontal bar of menus, as in desktop applications. */
export function Menubar({ className, ...props }: ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      className={cn(
        "flex h-(--cds-control-height-md) items-center gap-1 rounded-control p-1 surface",
        className,
      )}
      {...props}
    />
  );
}

export function MenubarMenu(props: ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />;
}

export function MenubarTrigger({
  className,
  ...props
}: ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "flex h-full items-center rounded-full px-3 text-label-sm text-muted-foreground outline-none select-none",
        "transition-colors duration-(--cds-duration-fast) hover:text-foreground focus-visible:bg-accent focus-visible:text-foreground",
        "data-open:bg-accent data-open:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(menuContent, "origin-(--radix-menubar-content-transform-origin)", className)}
        {...props}
      />
    </MenubarPrimitive.Portal>
  );
}

export function MenubarGroup(props: ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />;
}

export function MenubarPortal(props: ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />;
}

export function MenubarSub(props: ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />;
}

export function MenubarRadioGroup(props: ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />;
}

export type MenubarItemProps = ComponentProps<typeof MenubarPrimitive.Item> & {
  /** Indent to align with checkbox and radio rows. */
  inset?: boolean;
  variant?: "default" | "destructive";
};

export function MenubarItem({ className, inset, variant = "default", ...props }: MenubarItemProps) {
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      data-inset={inset || undefined}
      data-variant={variant}
      className={cn(menuItem, menuItemDestructive, inset && menuIndicatorItem, className)}
      {...props}
    />
  );
}

export function MenubarCheckboxItem({
  className,
  children,
  checked,
  ...props
}: ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      checked={checked}
      className={cn(menuItem, menuIndicatorItem, className)}
      {...props}
    >
      <span className={menuIndicator}>
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon className="text-brand" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  );
}

export function MenubarRadioItem({
  className,
  children,
  ...props
}: ComponentProps<typeof MenubarPrimitive.RadioItem>) {
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      className={cn(menuItem, menuIndicatorItem, className)}
      {...props}
    >
      <span className={menuIndicator}>
        <MenubarPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-brand text-brand" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  );
}

export function MenubarLabel({
  className,
  inset,
  ...props
}: ComponentProps<typeof MenubarPrimitive.Label> & { inset?: boolean }) {
  return (
    <MenubarPrimitive.Label
      data-slot="menubar-label"
      data-inset={inset || undefined}
      className={cn(menuLabel, inset && menuIndicatorItem, className)}
      {...props}
    />
  );
}

export function MenubarSeparator({
  className,
  ...props
}: ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      className={cn(menuSeparator, className)}
      {...props}
    />
  );
}

/** Keyboard shortcut hint. Display only: wire the shortcut yourself. */
export function MenubarShortcut({ className, ...props }: ComponentProps<"span">) {
  return <span data-slot="menubar-shortcut" className={cn(menuShortcut, className)} {...props} />;
}

export function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: ComponentProps<typeof MenubarPrimitive.SubTrigger> & { inset?: boolean }) {
  return (
    <MenubarPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset || undefined}
      className={cn(
        menuItem,
        "data-open:bg-accent data-open:text-accent-foreground",
        inset && menuIndicatorItem,
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto" />
    </MenubarPrimitive.SubTrigger>
  );
}

export function MenubarSubContent({
  className,
  ...props
}: ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.SubContent
        data-slot="menubar-sub-content"
        className={cn(menuContent, "origin-(--radix-menubar-content-transform-origin)", className)}
        {...props}
      />
    </MenubarPrimitive.Portal>
  );
}
