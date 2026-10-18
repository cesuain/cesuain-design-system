import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "../../lib/utils.js";

/** Explains why an area is empty and what to do next: no results, first run, cleared inbox. */
export function EmptyState({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-card border border-dashed border-border-strong p-8 text-center text-balance md:p-12",
        className,
      )}
      {...props}
    />
  );
}

export function EmptyStateHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-state-header"
      className={cn("flex max-w-sm flex-col items-center gap-2", className)}
      {...props}
    />
  );
}

export const emptyStateMediaVariants = cva(
  "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "size-12 rounded-card text-brand shadow-glow-brand surface [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export type EmptyStateMediaProps = ComponentProps<"div"> &
  VariantProps<typeof emptyStateMediaVariants>;

/** Decorative illustration or icon. Hidden from assistive technology. */
export function EmptyStateMedia({
  className,
  variant = "default",
  ...props
}: EmptyStateMediaProps) {
  return (
    <div
      data-slot="empty-state-media"
      data-variant={variant}
      aria-hidden="true"
      className={cn(emptyStateMediaVariants({ variant }), className)}
      {...props}
    />
  );
}

export function EmptyStateTitle({ className, ...props }: ComponentProps<"h3">) {
  return (
    <h3
      data-slot="empty-state-title"
      className={cn("text-heading-sm text-foreground", className)}
      {...props}
    />
  );
}

export function EmptyStateDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="empty-state-description"
      className={cn(
        "text-body-sm text-muted-foreground [&>a]:text-brand [&>a]:underline-offset-4 [&>a:hover]:underline",
        className,
      )}
      {...props}
    />
  );
}

/** Actions: usually one primary button, optionally a secondary link. */
export function EmptyStateContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-state-content"
      className={cn(
        "flex w-full max-w-sm min-w-0 flex-col items-center gap-3 sm:flex-row sm:justify-center",
        className,
      )}
      {...props}
    />
  );
}
