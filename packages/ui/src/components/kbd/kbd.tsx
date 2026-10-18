import type { ComponentProps } from "react";

import { cn } from "../../lib/utils.js";

/** A keyboard key or shortcut, e.g. ⌘K in the site's command palette hint. */
export function Kbd({ className, ...props }: ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex h-5 min-w-5 items-center justify-center gap-1 rounded-indicator border border-border bg-foreground/[0.04] px-1.5",
        "font-mono text-caption text-muted-foreground select-none [&_svg:not([class*='size-'])]:size-3",
        "in-data-[slot=tooltip-content]:border-primary-foreground/20 in-data-[slot=tooltip-content]:bg-primary-foreground/10 in-data-[slot=tooltip-content]:text-primary-foreground",
        className,
      )}
      {...props}
    />
  );
}

/** Several keys pressed together. */
export function KbdGroup({ className, ...props }: ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  );
}
