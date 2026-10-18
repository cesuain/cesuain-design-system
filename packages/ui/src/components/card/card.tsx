import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "../../lib/utils.js";

export const cardVariants = cva(
  "group/card relative flex flex-col gap-5 rounded-card p-(--cds-card-padding) text-card-foreground",
  {
    variants: {
      variant: {
        /** Translucent layered surface: the site's signature card. */
        surface: "surface",
        /** Frosted glass for cards placed over imagery or gradients. */
        glass: "glass",
        /** Solid card with a hairline border. */
        solid: "border border-border bg-card",
        /** Solid panel framed by the brand gradient (the site's contact card). */
        gradient:
          "border border-transparent [background:linear-gradient(var(--panel),var(--panel))_padding-box,linear-gradient(120deg,var(--gradient-start),var(--gradient-middle),var(--gradient-end))_border-box]",
      },
      interactive: {
        true: "transition-[border-color,box-shadow,transform] duration-(--cds-duration-moderate) ease-standard focus-within:border-border-strong hover:-translate-y-0.5 hover:border-border-strong hover:shadow-elevation-lg",
        false: "",
      },
      size: {
        md: "",
        lg: "gap-6 p-(--cds-card-padding-lg)",
      },
    },
    defaultVariants: { variant: "surface", interactive: false, size: "md" },
  },
);

export type CardProps = ComponentProps<"div"> & VariantProps<typeof cardVariants>;

/** Groups related content and actions. Use `interactive` when the whole card is clickable. */
export function Card({ className, variant, interactive, size, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      data-variant={variant ?? "surface"}
      className={cn(cardVariants({ variant, interactive, size }), className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return (
    <h3
      data-slot="card-title"
      className={cn("text-heading-sm text-foreground", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-body-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

/** Top-right slot in the header for a menu or badge. */
export function CardAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("text-body-md", className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("mt-auto flex items-center gap-3", className)}
      {...props}
    />
  );
}
