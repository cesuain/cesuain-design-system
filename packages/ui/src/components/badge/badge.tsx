import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "../../lib/utils.js";

export const badgeVariants = cva(
  [
    "inline-flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full border font-medium whitespace-nowrap",
    "focus-ring transition-[color,background-color,border-color,box-shadow] duration-(--cds-duration-moderate) ease-standard",
    "[&>svg]:pointer-events-none [&>svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        /** Neutral pill used for technologies and tags. */
        default:
          "border-border bg-foreground/[0.03] text-foreground/80 [a&]:hover:bg-foreground/[0.06] [a&]:hover:text-foreground",
        primary: "border-transparent bg-primary text-primary-foreground",
        brand: "border-brand/40 bg-brand/10 text-brand",
        gradient: "border-transparent bg-brand-gradient text-gradient-foreground",
        outline: "border-border-strong text-foreground",
        success: "border-success/40 bg-success/10 text-success",
        warning: "border-warning/40 bg-warning/10 text-warning",
        destructive: "border-destructive/50 bg-destructive/10 text-destructive",
      },
      size: {
        sm: "px-2.5 py-1 text-label-xs [&>svg]:size-3",
        md: "px-3 py-1.5 text-label-xs [&>svg]:size-3.5",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export type BadgeProps = ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    /** Render a link or button with badge styles. */
    asChild?: boolean;
  };

/** A short label for status, category or technology. */
export function Badge({ className, variant, size, asChild, ...props }: BadgeProps) {
  const Comp = asChild ? Slot.Root : "span";
  return (
    <Comp
      data-slot="badge"
      data-variant={variant ?? "default"}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}
