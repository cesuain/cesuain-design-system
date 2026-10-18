import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "../../lib/utils.js";

export const stackVariants = cva("flex", {
  variants: {
    direction: {
      column: "flex-col",
      row: "flex-row",
      /** Column on small screens, row from the `sm` breakpoint. */
      responsive: "flex-col sm:flex-row",
    },
    gap: {
      none: "gap-0",
      xs: "gap-(--cds-space-stack-xs)",
      sm: "gap-(--cds-space-stack-sm)",
      md: "gap-(--cds-space-stack-md)",
      lg: "gap-(--cds-space-stack-lg)",
      xl: "gap-(--cds-space-stack-xl)",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
    },
    wrap: { true: "flex-wrap", false: "" },
  },
  defaultVariants: { direction: "column", gap: "md", wrap: false },
});

export type StackProps = ComponentProps<"div"> &
  VariantProps<typeof stackVariants> & {
    asChild?: boolean;
  };

/** One-dimensional layout with token-based spacing. Use it instead of ad hoc margins. */
export function Stack({
  className,
  direction,
  gap,
  align,
  justify,
  wrap,
  asChild,
  ...props
}: StackProps) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="stack"
      className={cn(stackVariants({ direction, gap, align, justify, wrap }), className)}
      {...props}
    />
  );
}
