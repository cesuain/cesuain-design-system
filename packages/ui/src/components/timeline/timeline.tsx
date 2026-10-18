import type { ComponentProps, ReactNode } from "react";

import { cn } from "../../lib/utils.js";

/**
 * A vertical timeline, as in the site's experience section. Renders an ordered list along a
 * gradient rail. On large screens the period and index sit in a column left of the rail.
 */
export function Timeline({ className, children, ...props }: ComponentProps<"ol">) {
  return (
    <div data-slot="timeline" className="relative">
      <span
        aria-hidden="true"
        className="absolute top-0 bottom-0 left-[19px] w-px bg-linear-to-b from-gradient-middle via-gradient-start to-gradient-end opacity-70 sm:left-[27px] lg:left-[calc(10rem+1.25rem)]"
      />
      <ol className={cn("flex flex-col gap-10 sm:gap-14", className)} {...props}>
        {children}
      </ol>
    </div>
  );
}

export type TimelineItemProps = ComponentProps<"li"> & {
  /** Date range, e.g. "2022 — Present". */
  period: ReactNode;
  /** Highlights the node with a pulsing brand dot. */
  current?: boolean;
  /** Ordinal shown under the period on large screens (1-based). Decorative. */
  index?: number;
};

export function TimelineItem({
  period,
  current,
  index,
  className,
  children,
  ...props
}: TimelineItemProps) {
  return (
    <li
      data-slot="timeline-item"
      data-current={current || undefined}
      aria-current={current ? "step" : undefined}
      className={cn(
        "relative grid gap-4 pl-10 sm:pl-14 lg:grid-cols-[10rem_1fr] lg:gap-10 lg:pl-0",
        className,
      )}
      {...props}
    >
      <div className="lg:pt-9 lg:text-right">
        <p className="font-mono text-body-sm text-muted-foreground">{period}</p>
        {index !== undefined ? (
          // Decorative ordinal drawn with CSS `content`, so it is neither announced nor
          // evaluated as low-contrast text.
          <p
            aria-hidden="true"
            data-index={String(index).padStart(2, "0")}
            className="mt-1 hidden font-display text-display-sm text-foreground/10 before:content-[attr(data-index)] lg:block"
          />
        ) : null}
      </div>
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-1 left-[11px] grid size-[18px] place-items-center rounded-full border sm:left-[19px] lg:top-9 lg:left-[calc(10rem+1.25rem-9px)]",
          current ? "border-brand/60 bg-brand/20" : "border-border-strong bg-background",
        )}
      >
        <span
          className={cn(
            "size-2 rounded-full",
            current ? "bg-brand motion-safe:animate-pulse-soft" : "bg-muted-foreground",
          )}
        />
      </span>
      <div className="lg:pl-10">{children}</div>
    </li>
  );
}
