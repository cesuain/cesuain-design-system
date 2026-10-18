import type { ComponentProps } from "react";

import { cn } from "../../lib/utils.js";

/** The header at the top of a page: eyebrow, `h1`, description and actions. */
export function PageHeader({
  className,
  align = "left",
  ...props
}: ComponentProps<"header"> & { align?: "left" | "center" }) {
  return (
    <header
      data-slot="page-header"
      data-align={align}
      className={cn(
        "flex max-w-3xl flex-col gap-5 data-[align=center]:mx-auto data-[align=center]:items-center data-[align=center]:text-center",
        className,
      )}
      {...props}
    />
  );
}

/** Monospaced kicker with the gradient rule. */
export function PageHeaderEyebrow({ className, children, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="page-header-eyebrow"
      className={cn(
        "inline-flex items-center gap-2.5 font-eyebrow text-eyebrow text-brand",
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="h-px w-8 bg-linear-to-r from-transparent to-brand" />
      {children}
    </p>
  );
}

export function PageHeaderTitle({ className, ...props }: ComponentProps<"h1">) {
  return (
    <h1
      data-slot="page-header-title"
      className={cn("font-display text-display-xl text-balance text-foreground", className)}
      {...props}
    />
  );
}

/** Wrap part of the title to paint it with the brand gradient. */
export function PageHeaderHighlight({ className, ...props }: ComponentProps<"span">) {
  return (
    <span data-slot="page-header-highlight" className={cn("text-gradient", className)} {...props} />
  );
}

export function PageHeaderDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="page-header-description"
      className={cn("max-w-2xl text-body-lg text-pretty text-muted-foreground", className)}
      {...props}
    />
  );
}

export function PageHeaderActions({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header-actions"
      className={cn("flex flex-wrap items-center gap-3", className)}
      {...props}
    />
  );
}
