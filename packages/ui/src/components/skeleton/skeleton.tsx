import type { ComponentProps } from "react";

import { cn } from "../../lib/utils.js";

/**
 * Placeholder shown while content loads. Hidden from assistive technology: announce loading
 * once on the container instead (e.g. `aria-busy="true"` plus a visually hidden status).
 */
export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn("rounded-item bg-foreground/[0.08] motion-safe:animate-pulse-soft", className)}
      {...props}
    />
  );
}
