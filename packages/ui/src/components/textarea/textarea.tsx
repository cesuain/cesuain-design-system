import type { ComponentProps } from "react";

import { fieldControl } from "../../lib/styles.js";
import { cn } from "../../lib/utils.js";

export type TextareaProps = ComponentProps<"textarea"> & {
  /** Grow with the content (CSS `field-sizing: content`) instead of a fixed height. */
  autoResize?: boolean;
};

/** Multi-line text field. */
export function Textarea({ className, autoResize = false, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        fieldControl,
        "min-h-36 resize-y px-(--cds-field-padding-x) py-3",
        autoResize && "field-sizing-content min-h-24 resize-none",
        className,
      )}
      {...props}
    />
  );
}
