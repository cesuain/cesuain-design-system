"use client";

import { Switch as SwitchPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "../../lib/utils.js";

export type SwitchProps = ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "md";
};

/** On/off setting that takes effect immediately (`role="switch"`). */
export function Switch({ className, size = "md", ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-input p-0.5 focus-ring",
        "transition-colors duration-(--cds-duration-moderate) ease-standard after:absolute after:-inset-2",
        "data-[size=md]:h-6 data-[size=md]:w-11 data-[size=sm]:h-5 data-[size=sm]:w-9",
        "data-[state=checked]:border-brand data-[state=checked]:bg-brand data-[state=unchecked]:bg-muted",
        "disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full shadow-elevation-sm transition-transform duration-(--cds-duration-moderate) ease-standard",
          "group-data-[size=md]/switch:size-[18px] group-data-[size=sm]/switch:size-3.5",
          "data-[state=unchecked]:translate-x-0 data-[state=unchecked]:bg-foreground",
          "data-[state=checked]:bg-brand-foreground group-data-[size=md]/switch:data-[state=checked]:translate-x-5 group-data-[size=sm]/switch:data-[state=checked]:translate-x-4",
        )}
      />
    </SwitchPrimitive.Root>
  );
}
