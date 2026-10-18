import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "../../lib/utils.js";
import { buttonVariants } from "../button/button.variants.js";

/** Links between pages of a long list. */
export function Pagination({
  className,
  "aria-label": label = "Pagination",
  ...props
}: ComponentProps<"nav">) {
  return (
    <nav
      aria-label={label}
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

export function PaginationContent({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  );
}

export function PaginationItem(props: ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

export type PaginationLinkProps = ComponentProps<"a"> & {
  /** Marks the current page with `aria-current="page"`. */
  isActive?: boolean;
  size?: "icon" | "md";
};

export function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive || undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size: size === "icon" ? "icon" : "sm",
        }),
        isActive && "text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function PaginationPrevious({
  className,
  children = "Previous",
  ...props
}: PaginationLinkProps) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="md"
      className={cn("pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon aria-hidden="true" />
      <span className="hidden sm:block">{children}</span>
    </PaginationLink>
  );
}

export function PaginationNext({ className, children = "Next", ...props }: PaginationLinkProps) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="md"
      className={cn("pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">{children}</span>
      <ChevronRightIcon aria-hidden="true" />
    </PaginationLink>
  );
}

export function PaginationEllipsis({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-10 items-center justify-center text-muted-foreground [&_svg]:size-4",
        className,
      )}
      {...props}
    >
      <MoreHorizontalIcon aria-hidden="true" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

/**
 * Page numbers to render for `page` of `pageCount`, with `"ellipsis"` gaps.
 * Always includes the first and last page and `siblings` pages either side of the current one.
 */
export function paginationRange(
  page: number,
  pageCount: number,
  siblings = 1,
): (number | "ellipsis")[] {
  const total = Math.max(1, pageCount);
  const current = Math.min(Math.max(1, page), total);
  // first + last + current + siblings on both sides + two ellipses
  if (total <= siblings * 2 + 5) return Array.from({ length: total }, (_, i) => i + 1);
  const start = Math.max(2, current - siblings);
  const end = Math.min(total - 1, current + siblings);
  const range: (number | "ellipsis")[] = [1];
  if (start > 2) range.push(start === 3 ? 2 : "ellipsis");
  for (let n = start; n <= end; n++) range.push(n);
  if (end < total - 1) range.push(end === total - 2 ? total - 1 : "ellipsis");
  range.push(total);
  return range;
}
