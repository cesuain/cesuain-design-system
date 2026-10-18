import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "../../lib/utils.js";

export const sectionVariants = cva("relative scroll-mt-20", {
  variants: {
    spacing: {
      none: "",
      sm: "py-(--cds-space-section-sm)",
      md: "py-(--cds-space-section-sm) sm:py-(--cds-space-section-md)",
      lg: "py-(--cds-space-section-md) sm:py-(--cds-space-section-lg)",
    },
  },
  defaultVariants: { spacing: "lg" },
});

export type SectionProps = ComponentProps<"section"> &
  VariantProps<typeof sectionVariants> & {
    /**
     * Id of the heading that names the section. A `<section>` is only exposed as a landmark when
     * it has an accessible name; when `id` is set and this is omitted, `${id}-title` is used.
     */
    labelledBy?: string;
  };

/** A page section with vertical rhythm from the section spacing tokens. */
export function Section({ className, spacing, id, labelledBy, ...props }: SectionProps) {
  return (
    <section
      data-slot="section"
      id={id}
      aria-labelledby={labelledBy ?? (id ? `${id}-title` : undefined)}
      className={cn(sectionVariants({ spacing }), className)}
      {...props}
    />
  );
}
