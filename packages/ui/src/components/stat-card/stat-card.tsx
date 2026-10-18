import type { ComponentProps, ReactNode } from "react";

import { cn } from "../../lib/utils.js";

export type StatCardProps = Omit<ComponentProps<"div">, "children"> & {
  /** The figure, e.g. "40%" or "12+". Rendered in the display face with the brand gradient. */
  value: ReactNode;
  label: ReactNode;
  description?: ReactNode;
};

/**
 * A headline metric with a label, from the site's stats row. The label follows the value in
 * the DOM so screen readers announce "40%, Faster page loads".
 */
export function StatCard({ value, label, description, className, ...props }: StatCardProps) {
  return (
    <div
      data-slot="stat-card"
      className={cn(
        "group relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-card p-(--cds-card-padding) surface",
        "transition-[translate,border-color] duration-(--cds-duration-slow) ease-standard hover:-translate-y-0.5 hover:border-brand/25",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 -top-px h-px bg-linear-to-r from-transparent via-brand/60 to-transparent opacity-0 transition-opacity duration-(--cds-duration-slow) group-hover:opacity-100"
      />
      <p className="font-display text-display-md leading-none">
        <span className="text-gradient">{value}</span>
      </p>
      <div>
        <p className="text-label-md text-foreground">{label}</p>
        {description ? (
          <p className="mt-1 text-body-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
