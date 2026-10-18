import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "../../lib/utils.js";

export const surfaceVariants = cva("relative", {
  variants: {
    variant: {
      /** Translucent layered surface. */
      surface: "surface",
      /** Frosted glass over imagery. */
      glass: "glass",
      /** Opaque raised panel (navbar, mobile menu). */
      panel: "border border-border bg-panel",
      /** Subtle tinted area without a border. */
      muted: "bg-muted",
    },
    radius: {
      none: "rounded-none",
      item: "rounded-item",
      card: "rounded-card",
      overlay: "rounded-overlay",
      full: "rounded-full",
    },
    padding: {
      none: "p-0",
      sm: "p-(--cds-space-inset-sm)",
      md: "p-(--cds-space-inset-md)",
      lg: "p-(--cds-space-inset-lg)",
      xl: "p-(--cds-space-inset-xl)",
    },
    elevation: {
      none: "",
      sm: "shadow-elevation-sm",
      md: "shadow-elevation-md",
      lg: "shadow-elevation-lg",
      xl: "shadow-elevation-xl",
    },
  },
  defaultVariants: { variant: "surface", radius: "card", padding: "md", elevation: "none" },
});

export type SurfaceProps = ComponentProps<"div"> &
  VariantProps<typeof surfaceVariants> & {
    asChild?: boolean;
  };

/** A styled box. The building block behind cards, panels and popovers when no semantics are needed. */
export function Surface({
  className,
  variant,
  radius,
  padding,
  elevation,
  asChild,
  ...props
}: SurfaceProps) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="surface"
      className={cn(surfaceVariants({ variant, radius, padding, elevation }), className)}
      {...props}
    />
  );
}
