"use client";

import { cva } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "../../lib/utils.js";

export type NavigationMenuProps = ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  /**
   * Render panels inside one shared, animated viewport (default). Set to `false` to position
   * each panel under its own trigger.
   */
  viewport?: boolean;
};

/** Site navigation with optional fly-out panels of links. */
export function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: NavigationMenuProps) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className,
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

export function NavigationMenuList({
  className,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn("flex flex-1 list-none items-center justify-center gap-0.5", className)}
      {...props}
    />
  );
}

export function NavigationMenuItem({
  className,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  );
}

/** Pill link style of the header navigation. Also apply it to top-level `NavigationMenuLink`s. */
export const navigationMenuTriggerStyle = cva(
  [
    "group/navigation-menu-trigger inline-flex h-(--cds-control-height-sm) w-max items-center justify-center gap-1 rounded-full px-3.5",
    "text-label-sm text-muted-foreground focus-ring transition-[color,background-color] duration-(--cds-duration-moderate) ease-standard",
    "hover:bg-foreground/[0.06] hover:text-foreground disabled:pointer-events-none disabled:opacity-50",
    "data-open:bg-foreground/[0.07] data-open:text-foreground data-active:bg-foreground/[0.07] data-active:text-foreground",
  ].join(" "),
);

export function NavigationMenuTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), className)}
      {...props}
    >
      {children}
      <ChevronDownIcon
        aria-hidden="true"
        className="relative top-px size-3 transition-transform duration-(--cds-duration-moderate) group-data-open/navigation-menu-trigger:rotate-180"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

export function NavigationMenuContent({
  className,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "top-0 left-0 w-full p-2 md:absolute md:w-auto",
        "data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out",
        "data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52",
        // Without the shared viewport each panel draws its own surface.
        "group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-2 group-data-[viewport=false]/navigation-menu:rounded-overlay group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:border-border group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:shadow-elevation-lg",
        className,
      )}
      {...props}
    />
  );
}

export function NavigationMenuViewport({
  className,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div className="absolute top-full left-0 isolate z-(--cds-z-index-popover) flex justify-center">
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "relative mt-2 h-(--radix-navigation-menu-viewport-height) w-full origin-top overflow-hidden md:w-(--radix-navigation-menu-viewport-width)",
          "rounded-overlay border border-border bg-popover text-popover-foreground shadow-elevation-lg",
          "duration-(--cds-duration-fast) data-open:animate-in data-open:zoom-in-95 data-closed:animate-out data-closed:zoom-out-95",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export function NavigationMenuLink({
  className,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "flex flex-col gap-1 rounded-item p-3 text-body-sm focus-ring transition-colors duration-(--cds-duration-fast)",
        "hover:bg-accent hover:text-accent-foreground data-active:bg-accent/60",
        "[&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

export function NavigationMenuIndicator({
  className,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-1 flex h-2 items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in",
        className,
      )}
      {...props}
    >
      <div className="relative top-[60%] size-2 rotate-45 rounded-tl-xs bg-border" />
    </NavigationMenuPrimitive.Indicator>
  );
}
