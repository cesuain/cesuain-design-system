import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "../../lib/utils.js";

export const containerVariants = cva(
  "mx-auto w-full px-(--cds-space-gutter-sm) sm:px-(--cds-space-gutter-lg)",
  {
    variants: {
      size: {
        sm: "max-w-(--cds-size-container-sm)",
        md: "max-w-(--cds-size-container-md)",
        lg: "max-w-(--cds-size-container-lg)",
        /** The site's page width (80rem). */
        xl: "max-w-(--cds-size-container-xl)",
        full: "max-w-none",
      },
    },
    defaultVariants: { size: "xl" },
  },
);

export type ContainerProps = ComponentProps<"div"> &
  VariantProps<typeof containerVariants> & {
    /** Render as the child element, e.g. `<main>`. */
    asChild?: boolean;
  };

/** Centers content at a maximum width with responsive side gutters. */
export function Container({ className, size, asChild, ...props }: ContainerProps) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp data-slot="container" className={cn(containerVariants({ size }), className)} {...props} />
  );
}
