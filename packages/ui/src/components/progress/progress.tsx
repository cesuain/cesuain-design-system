"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Progress as ProgressPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "../../lib/utils.js";

export const progressVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-foreground/10",
  {
    variants: {
      size: { sm: "h-1", md: "h-2", lg: "h-3" },
    },
    defaultVariants: { size: "md" },
  },
);

export const progressIndicatorVariants = cva(
  "size-full flex-1 rounded-full transition-transform duration-(--cds-duration-slow) ease-standard",
  {
    variants: {
      tone: {
        default: "bg-primary",
        brand: "bg-brand-gradient",
        success: "bg-success",
      },
    },
    defaultVariants: { tone: "default" },
  },
);

export type ProgressProps = ComponentProps<typeof ProgressPrimitive.Root> &
  VariantProps<typeof progressVariants> &
  VariantProps<typeof progressIndicatorVariants>;

/**
 * Shows how much of a task is complete. Pass `value={null}` for an indeterminate state.
 * Give it an accessible name with `aria-label` or `aria-labelledby`.
 */
export function Progress({ className, value, max = 100, size, tone, ...props }: ProgressProps) {
  const indeterminate = value === null || value === undefined;
  const percent = indeterminate ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      max={max}
      className={cn(progressVariants({ size }), className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          progressIndicatorVariants({ tone }),
          indeterminate &&
            "w-1/3 motion-safe:animate-progress-indeterminate motion-reduce:animate-pulse-soft",
        )}
        style={indeterminate ? undefined : { transform: `translateX(-${100 - percent}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
