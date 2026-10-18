"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Tabs as TabsPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "../../lib/utils.js";

export type TabsProps = ComponentProps<typeof TabsPrimitive.Root>;

/** Switches between related panels in place. Arrow keys move between tabs. */
export function Tabs({ className, orientation = "horizontal", ...props }: TabsProps) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      orientation={orientation}
      className={cn("group/tabs flex gap-4 data-horizontal:flex-col", className)}
      {...props}
    />
  );
}

export const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center text-muted-foreground group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col group-data-vertical/tabs:items-stretch",
  {
    variants: {
      variant: {
        /** Pill track with a solid active pill, as in the site's navigation. */
        pill: "gap-0.5 rounded-full border border-border bg-foreground/[0.03] p-1 group-data-vertical/tabs:rounded-card",
        /** Underlined tabs for dense, document-like layouts. */
        line: "gap-4 border-border group-data-horizontal/tabs:border-b group-data-vertical/tabs:border-r",
      },
    },
    defaultVariants: { variant: "pill" },
  },
);

export type TabsListProps = ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>;

export function TabsList({ className, variant = "pill", ...props }: TabsListProps) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex items-center justify-center gap-1.5 text-label-sm whitespace-nowrap focus-ring",
        "transition-[color,background-color,box-shadow] duration-(--cds-duration-moderate) ease-standard",
        "hover:text-foreground disabled:pointer-events-none disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        // pill
        "group-data-[variant=pill]/tabs-list:h-(--cds-control-height-sm) group-data-[variant=pill]/tabs-list:rounded-full group-data-[variant=pill]/tabs-list:px-4",
        "group-data-[variant=pill]/tabs-list:data-active:bg-primary group-data-[variant=pill]/tabs-list:data-active:text-primary-foreground group-data-[variant=pill]/tabs-list:data-active:shadow-glow-brand",
        "group-data-vertical/tabs:justify-start",
        // line
        "group-data-[variant=line]/tabs-list:pb-3 group-data-[variant=line]/tabs-list:data-active:text-foreground",
        "group-data-vertical/tabs:group-data-[variant=line]/tabs-list:pr-4 group-data-vertical/tabs:group-data-[variant=line]/tabs-list:pb-0",
        "after:absolute after:rounded-full after:bg-brand after:opacity-0 after:transition-opacity group-data-[variant=line]/tabs-list:data-active:after:opacity-100",
        "group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:-bottom-px group-data-horizontal/tabs:after:h-0.5",
        "group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-px group-data-vertical/tabs:after:w-0.5",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "flex-1 text-body-md focus-ring outline-none focus-visible:rounded-card",
        className,
      )}
      {...props}
    />
  );
}
