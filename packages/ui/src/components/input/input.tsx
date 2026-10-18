import type { ComponentProps } from "react";

import { controlHeight, fieldControl } from "../../lib/styles.js";
import { cn } from "../../lib/utils.js";

export type InputProps = ComponentProps<"input"> & {
  /** Control height. Named `inputSize` because `size` is a native input attribute. */
  inputSize?: keyof typeof controlHeight;
};

/** Single-line text field. Set `aria-invalid` to show the error state. */
export function Input({ className, type = "text", inputSize = "md", ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      data-size={inputSize}
      className={cn(
        fieldControl,
        controlHeight[inputSize],
        "px-(--cds-field-padding-x)",
        "file:mr-3 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-label-sm file:text-foreground",
        className,
      )}
      {...props}
    />
  );
}
