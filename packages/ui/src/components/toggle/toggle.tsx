"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Toggle as TogglePrimitive } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "../../lib/utils.js";

export const toggleVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 rounded-control font-medium whitespace-nowrap focus-ring",
    "text-muted-foreground transition-[color,background-color,border-color] duration-(--cds-duration-fast) ease-standard",
    "hover:bg-accent/60 hover:text-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-border-strong bg-transparent data-[state=on]:border-transparent",
      },
      size: {
        sm: "h-(--cds-control-height-sm) min-w-(--cds-control-height-sm) px-3 text-label-sm",
        md: "h-10 min-w-10 px-3.5 text-label-sm",
        lg: "h-(--cds-control-height-md) min-w-(--cds-control-height-md) px-4 text-label-md",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export type ToggleProps = ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>;

/** Two-state button (`aria-pressed`). Supports `pressed`/`onPressedChange` or `defaultPressed`. */
export function Toggle({ className, variant = "default", size = "md", ...props }: ToggleProps) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      data-variant={variant}
      data-size={size}
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
    />
  );
}
