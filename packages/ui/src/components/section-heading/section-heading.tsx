import type { ComponentProps, ReactNode } from "react";

import { cn } from "../../lib/utils.js";

export type SectionHeadingProps = Omit<ComponentProps<"header">, "title"> & {
  /** Small monospaced kicker above the title. */
  eyebrow?: ReactNode;
  title: ReactNode;
  /** Word(s) appended to the title in the brand gradient. */
  highlight?: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  /** Title size: a `text-display-*` style. `2xl` is the large, page-level section title. */
  size?: "lg" | "xl" | "2xl";
  /** Id of the `<h2>`. Pair with `Section`'s `labelledBy` (or `id`) to name the section landmark. */
  titleId?: string;
  /** Heading level. Defaults to `h2`, since `PageHeader` owns the page's `h1`. */
  as?: "h2" | "h3";
};

const titleSizes = {
  lg: "text-display-lg",
  xl: "text-display-xl",
  "2xl": "text-display-2xl",
} as const;

/** Section title: eyebrow with a gradient rule, condensed display title, lead paragraph. */
export function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  align = "left",
  size = "lg",
  titleId,
  as: Heading = "h2",
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <header
      data-slot="section-heading"
      data-align={align}
      data-size={size}
      className={cn(
        "flex max-w-3xl flex-col gap-5",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
      {...props}
    >
      {eyebrow ? (
        <p className="inline-flex items-center gap-2.5 font-eyebrow text-eyebrow text-brand">
          <span aria-hidden="true" className="h-px w-8 bg-linear-to-r from-transparent to-brand" />
          {eyebrow}
        </p>
      ) : null}
      <Heading
        id={titleId}
        className={cn("font-display text-balance text-foreground", titleSizes[size])}
      >
        {title}
        {highlight ? (
          <>
            {" "}
            <span className="text-gradient">{highlight}</span>
          </>
        ) : null}
      </Heading>
      {description ? (
        <p className="max-w-2xl text-body-lg text-pretty text-muted-foreground">{description}</p>
      ) : null}
    </header>
  );
}
