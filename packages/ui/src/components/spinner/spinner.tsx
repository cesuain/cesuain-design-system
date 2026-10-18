import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "../../lib/utils.js";

export const spinnerVariants = cva("shrink-0 animate-spin text-current", {
  variants: {
    size: {
      sm: "size-3.5",
      md: "size-4",
      lg: "size-6",
    },
  },
  defaultVariants: { size: "md" },
});

export type SpinnerProps = Omit<ComponentProps<"svg">, "ref"> &
  VariantProps<typeof spinnerVariants> & {
    /** Accessible name announced to assistive technology. Pass `null` when a parent already announces progress. */
    label?: string | null;
  };

/** Indeterminate loading indicator. */
export function Spinner({ className, size, label = "Loading", ...props }: SpinnerProps) {
  return (
    <LoaderCircle
      data-slot="spinner"
      role={label ? "status" : undefined}
      aria-label={label ?? undefined}
      aria-hidden={label ? undefined : true}
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    />
  );
}
