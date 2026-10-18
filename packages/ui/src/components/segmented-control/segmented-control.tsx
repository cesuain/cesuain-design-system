import { Slot } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "../../lib/utils.js";

export type SegmentedControlProps = ComponentProps<"nav"> & {
  /** Accessible name, e.g. "Language". Required: the control has no visible label. */
  "aria-label": string;
  size?: "sm" | "md";
};

/**
 * Pill-shaped switch whose options are real links, so it works without JavaScript and is
 * crawlable. Used on the site for the language switcher. For in-page state use `ToggleGroup`.
 */
export function SegmentedControl({ className, size = "sm", ...props }: SegmentedControlProps) {
  return (
    <nav
      data-slot="segmented-control"
      data-size={size}
      className={cn(
        "group/segmented inline-flex rounded-full border border-border bg-foreground/[0.03] p-0.5",
        className,
      )}
      {...props}
    />
  );
}

export type SegmentedControlItemProps = ComponentProps<"a"> & {
  /** The current option. Sets `aria-current="page"`. */
  active?: boolean;
  /** Render your router's link component instead of `<a>`. */
  asChild?: boolean;
};

export function SegmentedControlItem({
  className,
  active,
  asChild,
  ...props
}: SegmentedControlItemProps) {
  const Comp = asChild ? Slot.Root : "a";
  return (
    <Comp
      data-slot="segmented-control-item"
      data-active={active || undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-full font-medium whitespace-nowrap focus-ring transition-[color,background-color,box-shadow] duration-(--cds-duration-moderate) ease-standard",
        "group-data-[size=sm]/segmented:px-3 group-data-[size=sm]/segmented:py-1.5 group-data-[size=sm]/segmented:text-label-xs",
        "group-data-[size=md]/segmented:px-4 group-data-[size=md]/segmented:py-2 group-data-[size=md]/segmented:text-label-sm",
        active
          ? "bg-primary text-primary-foreground shadow-glow-brand"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}
