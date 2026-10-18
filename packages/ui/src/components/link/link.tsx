import { cva, type VariantProps } from "class-variance-authority";
import { ArrowUpRightIcon } from "lucide-react";
import { Slot } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "../../lib/utils.js";

export const linkVariants = cva(
  "inline-flex items-center gap-1 rounded-xs underline-offset-4 focus-ring transition-colors duration-(--cds-duration-fast) ease-standard [&_svg]:size-[0.9em] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /**
         * Brand-colored with a soft underline that strengthens on hover. Links inside running text
         * must not rely on color alone (WCAG 1.4.1), so the underline is always present.
         */
        default: "text-brand underline decoration-brand/40 hover:decoration-brand",
        /** Always underlined. Use where color alone cannot identify a link. */
        underline: "text-foreground underline decoration-foreground/30 hover:decoration-foreground",
        /** Muted until hovered. For footers and secondary navigation. */
        subtle: "text-muted-foreground hover:text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export type LinkProps = ComponentProps<"a"> &
  VariantProps<typeof linkVariants> & {
    /** Render your router's link (e.g. Next.js `Link`) with these styles. */
    asChild?: boolean;
    /** Opens in a new tab with safe `rel`, an arrow icon and a screen-reader hint. */
    external?: boolean;
  };

/** Text link. Use `asChild` to style a framework link component. */
export function Link({
  className,
  variant,
  asChild,
  external,
  children,
  target,
  rel,
  ...props
}: LinkProps) {
  const Comp = asChild ? Slot.Root : "a";
  return (
    <Comp
      data-slot="link"
      target={external ? "_blank" : target}
      rel={external ? "noopener noreferrer" : rel}
      className={cn(linkVariants({ variant }), className)}
      {...props}
    >
      {external && !asChild ? (
        <>
          {children}
          <ArrowUpRightIcon aria-hidden="true" />
          <span className="sr-only">, opens in a new tab</span>
        </>
      ) : (
        children
      )}
    </Comp>
  );
}
