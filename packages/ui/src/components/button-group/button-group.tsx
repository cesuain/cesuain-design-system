import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "../../lib/utils.js";
import { Separator, type SeparatorProps } from "../separator/separator.js";

export const buttonGroupVariants = cva(
  "group/button-group flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2 [&>input]:flex-1",
  {
    variants: {
      orientation: {
        horizontal:
          "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none [&>[data-variant=outline]:not(:first-child)]:border-l-0",
        vertical:
          "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none [&>[data-variant=outline]:not(:first-child)]:border-t-0",
      },
    },
    defaultVariants: { orientation: "horizontal" },
  },
);

export type ButtonGroupProps = ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>;

/** Joins related buttons into one control. Give it an `aria-label` describing the group. */
export function ButtonGroup({ className, orientation = "horizontal", ...props }: ButtonGroupProps) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  );
}

export type ButtonGroupTextProps = ComponentProps<"div"> & { asChild?: boolean };

/** Static label or value rendered inside a button group. */
export function ButtonGroupText({ className, asChild = false, ...props }: ButtonGroupTextProps) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="button-group-text"
      className={cn(
        "flex items-center gap-2 rounded-control border border-border-strong bg-muted px-4 text-label-sm text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

/** Divider between buttons that share a filled background. */
export function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: SeparatorProps) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn("relative self-stretch bg-border-strong data-vertical:h-auto", className)}
      {...props}
    />
  );
}
