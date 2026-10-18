"use client";

import { Popover as PopoverPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

import { floatingSurface } from "../../lib/styles.js";
import { cn } from "../../lib/utils.js";

/** Non-modal floating panel anchored to a trigger, for rich content and small forms. */
export function Popover(props: ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

export function PopoverTrigger(props: ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

/** Positions the popover against an element other than the trigger. */
export function PopoverAnchor(props: ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

export function PopoverClose(props: ComponentProps<typeof PopoverPrimitive.Close>) {
  return <PopoverPrimitive.Close data-slot="popover-close" {...props} />;
}

export function PopoverContent({
  className,
  align = "center",
  sideOffset = 8,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          floatingSurface,
          "flex w-72 origin-(--radix-popover-content-transform-origin) flex-col gap-3 p-4 text-body-sm outline-none",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

export function PopoverHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div data-slot="popover-header" className={cn("flex flex-col gap-1", className)} {...props} />
  );
}

export function PopoverTitle({ className, ...props }: ComponentProps<"h2">) {
  return (
    <h2
      data-slot="popover-title"
      className={cn("text-label-md text-foreground", className)}
      {...props}
    />
  );
}

export function PopoverDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="popover-description"
      className={cn("text-body-sm text-muted-foreground", className)}
      {...props}
    />
  );
}
