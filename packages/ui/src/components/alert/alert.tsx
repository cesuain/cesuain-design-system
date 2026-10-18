import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "../../lib/utils.js";

export const alertVariants = cva(
  [
    "group/alert relative grid w-full grid-cols-[0_1fr] items-start gap-y-1 rounded-card border px-4 py-3.5 text-body-sm",
    "has-[>svg]:grid-cols-[1.25rem_1fr] has-[>svg]:gap-x-3 [&>svg]:size-5 [&>svg]:translate-y-px",
    "has-data-[slot=alert-action]:pr-28",
  ],
  {
    variants: {
      variant: {
        default: "text-foreground surface [&>svg]:text-muted-foreground",
        info: "border-info/40 bg-info/[0.08] text-foreground [&>svg]:text-info",
        success: "border-success/40 bg-success/[0.08] text-foreground [&>svg]:text-success",
        warning: "border-warning/40 bg-warning/[0.08] text-foreground [&>svg]:text-warning",
        destructive:
          "border-destructive/50 bg-destructive/[0.08] text-foreground [&>svg]:text-destructive",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export type AlertProps = ComponentProps<"div"> & VariantProps<typeof alertVariants>;

/**
 * A prominent inline message. Uses `role="alert"` for `destructive` and `warning` (announced
 * immediately) and `role="status"` otherwise (announced politely). Override `role` if the alert
 * is part of the initial page and should not be announced.
 */
export function Alert({ className, variant = "default", role, ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      data-variant={variant}
      role={role ?? (variant === "destructive" || variant === "warning" ? "alert" : "status")}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

export function AlertTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("col-start-2 text-label-md text-foreground", className)}
      {...props}
    />
  );
}

export function AlertDescription({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 grid gap-1 text-body-sm text-muted-foreground [&_a]:text-brand [&_a]:underline-offset-4 [&_a:hover]:underline [&_p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

/** Optional action (e.g. "Undo", a dismiss button) pinned to the top-right. */
export function AlertAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-2.5 right-3 flex gap-1", className)}
      {...props}
    />
  );
}
