"use client";

import { CheckIcon, MinusIcon } from "lucide-react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "../../lib/utils.js";

export type CheckboxProps = ComponentProps<typeof CheckboxPrimitive.Root>;

/** Binary or indeterminate (`checked="indeterminate"`) choice. Pair with a Label. */
export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative grid size-[18px] shrink-0 place-items-center rounded-indicator border border-input bg-surface-from focus-ring",
        "transition-colors duration-(--cds-duration-fast) ease-standard",
        "after:absolute after:-inset-2.5 hover:border-foreground/50",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        "data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
        "disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="group grid place-items-center"
      >
        <CheckIcon className="size-3.5 group-data-[state=indeterminate]:hidden" strokeWidth={3} />
        <MinusIcon
          className="hidden size-3.5 group-data-[state=indeterminate]:block"
          strokeWidth={3}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
