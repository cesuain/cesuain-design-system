"use client";

import type { VariantProps } from "class-variance-authority";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { createContext, useContext, type ComponentProps } from "react";

import { cn } from "../../lib/utils.js";
import { toggleVariants } from "../toggle/toggle.js";

type ToggleGroupStyle = VariantProps<typeof toggleVariants> & { attached?: boolean };

const ToggleGroupContext = createContext<ToggleGroupStyle>({ variant: "default", size: "md" });

export type ToggleGroupProps = ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants> & {
    /** Render items as one joined control instead of separate pills. */
    attached?: boolean;
  };

/**
 * A set of toggles where one (`type="single"`) or several (`type="multiple"`) can be on.
 * Arrow keys move focus between items (roving tabindex).
 */
export function ToggleGroup({
  className,
  variant = "default",
  size = "md",
  attached = false,
  children,
  ...props
}: ToggleGroupProps) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-attached={attached || undefined}
      className={cn(
        "group/toggle-group flex w-fit items-center gap-1 data-vertical:flex-col data-vertical:items-stretch",
        attached && "gap-0 rounded-control border border-border p-0.5",
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size, attached }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

export type ToggleGroupItemProps = ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>;

export function ToggleGroupItem({ className, variant, size, ...props }: ToggleGroupItemProps) {
  const context = useContext(ToggleGroupContext);
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        toggleVariants({
          variant: context.attached ? "default" : (context.variant ?? variant),
          size: context.size ?? size,
        }),
        "shrink-0 focus-visible:z-10",
        className,
      )}
      {...props}
    />
  );
}
