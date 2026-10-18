import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "../../lib/utils.js";

export const gridVariants = cva("grid", {
  variants: {
    columns: {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      /** 12-column grid from `lg`; children set `lg:col-span-*` (bento layouts). */
      12: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-12",
      /** As many 16rem columns as fit. */
      auto: "grid-cols-[repeat(auto-fill,minmax(min(16rem,100%),1fr))]",
    },
    gap: {
      sm: "gap-(--cds-space-stack-sm)",
      md: "gap-(--cds-space-stack-md)",
      lg: "gap-(--cds-space-stack-lg)",
    },
  },
  defaultVariants: { columns: 3, gap: "md" },
});

export type GridProps = ComponentProps<"div"> &
  VariantProps<typeof gridVariants> & {
    asChild?: boolean;
  };

/** Responsive grid. Column counts collapse to one column on small screens. */
export function Grid({ className, columns, gap, asChild, ...props }: GridProps) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp data-slot="grid" className={cn(gridVariants({ columns, gap }), className)} {...props} />
  );
}
