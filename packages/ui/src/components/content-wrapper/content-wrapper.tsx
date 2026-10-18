import { Slot } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "../../lib/utils.js";

export type ContentWrapperProps = ComponentProps<"div"> & {
  /** Render as the child element, e.g. `<article>`. */
  asChild?: boolean;
};

/**
 * Styles long-form content you do not control (Markdown, CMS rich text): headings, paragraphs,
 * lists, links, quotes and code, at a readable line length.
 */
export function ContentWrapper({ className, asChild, ...props }: ContentWrapperProps) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="content-wrapper"
      className={cn(
        "max-w-(--cds-size-content-prose) text-body-md text-muted-foreground",
        "[&>*+*]:mt-(--cds-space-stack-md)",
        "[&_h2]:mt-(--cds-space-stack-xl) [&_h2]:text-heading-lg [&_h2]:text-foreground",
        "[&_h3]:mt-(--cds-space-stack-lg) [&_h3]:text-heading-md [&_h3]:text-foreground",
        "[&_h4]:mt-(--cds-space-stack-lg) [&_h4]:text-heading-sm [&_h4]:text-foreground",
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        "[&_a]:rounded-xs [&_a]:text-brand [&_a]:underline [&_a]:decoration-brand/40 [&_a]:underline-offset-4 [&_a:hover]:decoration-brand",
        "[&_li+li]:mt-(--cds-space-stack-xs) [&_li::marker]:text-brand [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6",
        "[&_blockquote]:border-l-2 [&_blockquote]:border-brand [&_blockquote]:pl-4 [&_blockquote]:text-foreground [&_blockquote]:italic",
        "[&_code]:rounded-indicator [&_code]:bg-foreground/[0.06] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-code [&_code]:text-foreground",
        "[&_pre]:overflow-x-auto [&_pre]:rounded-card [&_pre]:border [&_pre]:border-border [&_pre]:bg-panel [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0",
        "[&_hr]:border-border [&_img]:rounded-card",
        className,
      )}
      {...props}
    />
  );
}
