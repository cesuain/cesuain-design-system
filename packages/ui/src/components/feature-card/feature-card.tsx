import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../../lib/utils.js";

const glow = cva(
  "pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-radial to-transparent to-70% opacity-50 blur-3xl transition-opacity duration-(--cds-duration-slower) group-hover:opacity-100",
  {
    variants: {
      accent: {
        blue: "from-gradient-start/30",
        cyan: "from-gradient-middle/30",
        purple: "from-gradient-end/30",
      },
    },
  },
);

const iconTone = cva("", {
  variants: {
    accent: {
      blue: "text-gradient-start",
      cyan: "text-gradient-middle",
      purple: "text-gradient-end",
    },
  },
});

export type FeatureCardProps = Omit<ComponentProps<"article">, "title"> &
  VariantProps<typeof glow> & {
    icon: ReactNode;
    title: ReactNode;
    description: ReactNode;
    /** Larger title for the wide cells of a bento grid. */
    featured?: boolean;
    /** Title scale. `lg` steps the title up one display size from the `sm` breakpoint. */
    size?: "md" | "lg";
    /** Heading level of the title. */
    headingLevel?: "h3" | "h4";
  };

const titleSizes = {
  md: { regular: "text-display-sm", featured: "text-display-md" },
  lg: { regular: "text-display-sm sm:text-display-md", featured: "text-display-lg" },
} as const;

/** Highlight card: icon tile, accent glow, display-face title and description. */
export function FeatureCard({
  icon,
  title,
  description,
  accent = "cyan",
  featured = false,
  size = "md",
  headingLevel: Heading = "h3",
  className,
  ...props
}: FeatureCardProps) {
  return (
    <article
      data-slot="feature-card"
      data-accent={accent}
      data-size={size}
      className={cn(
        "group relative flex h-full flex-col justify-between gap-10 overflow-hidden rounded-overlay p-(--cds-card-padding-lg) surface",
        "transition-[translate,background-color,border-color] duration-(--cds-duration-slower) ease-standard hover:-translate-y-1 hover:border-border-strong",
        className,
      )}
      {...props}
    >
      <div aria-hidden="true" className={glow({ accent })} />
      <span
        aria-hidden="true"
        className={cn(
          "relative grid size-14 place-items-center rounded-card border border-border bg-foreground/[0.04] [&_svg]:size-6",
          "transition-transform duration-(--cds-duration-slower) ease-standard group-hover:scale-110 group-hover:-rotate-4",
          iconTone({ accent }),
        )}
      >
        {icon}
      </span>
      <div className="relative">
        <Heading
          className={cn(
            "font-display text-foreground",
            titleSizes[size][featured ? "featured" : "regular"],
          )}
        >
          {title}
        </Heading>
        <p className="mt-3 max-w-xl text-body-md text-pretty text-muted-foreground">
          {description}
        </p>
      </div>
    </article>
  );
}
