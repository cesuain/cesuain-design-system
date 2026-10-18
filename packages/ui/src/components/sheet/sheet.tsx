"use client";

import { XIcon } from "lucide-react";
import { Dialog as SheetPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

import {
  overlayDescription,
  overlayFooter,
  overlayHeader,
  overlayPanel,
  overlayScrim,
  overlayTitle,
} from "../../lib/styles.js";
import { cn } from "../../lib/utils.js";
import { IconButton } from "../icon-button/icon-button.js";

/** A modal panel that slides in from an edge of the screen. Built on the Dialog primitive. */
export function Sheet(props: ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

export function SheetTrigger(props: ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

export function SheetClose(props: ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

export function SheetPortal(props: ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

export function SheetOverlay({
  className,
  ...props
}: ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(overlayScrim, className)}
      {...props}
    />
  );
}

export type SheetContentProps = ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left";
  showCloseButton?: boolean;
  closeLabel?: string;
};

export function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  closeLabel = "Close",
  ...props
}: SheetContentProps) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          overlayPanel,
          "fixed z-(--cds-z-index-modal) flex flex-col gap-4 overflow-y-auto",
          "duration-(--cds-duration-slow) ease-standard data-open:animate-in data-closed:animate-out",
          "data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-y-0 data-[side=right]:border-r-0 data-[side=right]:sm:max-w-(--cds-overlay-width-sm)",
          "data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-y-0 data-[side=left]:border-l-0 data-[side=left]:sm:max-w-(--cds-overlay-width-sm)",
          "data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:border-x-0 data-[side=top]:border-t-0",
          "data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:border-x-0 data-[side=bottom]:border-b-0",
          "data-[side=right]:data-open:slide-in-from-right data-[side=right]:data-closed:slide-out-to-right",
          "data-[side=left]:data-open:slide-in-from-left data-[side=left]:data-closed:slide-out-to-left",
          "data-[side=top]:data-open:slide-in-from-top data-[side=top]:data-closed:slide-out-to-top",
          "data-[side=bottom]:data-open:slide-in-from-bottom data-[side=bottom]:data-closed:slide-out-to-bottom",
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close asChild>
            <IconButton
              data-slot="sheet-close"
              label={closeLabel}
              icon={<XIcon />}
              size="sm"
              className="absolute top-4 right-4"
            />
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

export function SheetHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn(overlayHeader, "p-(--cds-overlay-padding) pr-14", className)}
      {...props}
    />
  );
}

export function SheetFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(overlayFooter, "mt-auto p-(--cds-overlay-padding)", className)}
      {...props}
    />
  );
}

export function SheetTitle({ className, ...props }: ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(overlayTitle, className)}
      {...props}
    />
  );
}

export function SheetDescription({
  className,
  ...props
}: ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn(overlayDescription, className)}
      {...props}
    />
  );
}
