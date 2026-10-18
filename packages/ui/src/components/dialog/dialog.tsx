"use client";

import { XIcon } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
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

/** A modal window. Focus is trapped inside and returns to the trigger on close. */
export function Dialog(props: ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

export function DialogTrigger(props: ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

export function DialogPortal(props: ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

export function DialogClose(props: ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

export function DialogOverlay({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(overlayScrim, className)}
      {...props}
    />
  );
}

const widths = {
  sm: "sm:max-w-(--cds-overlay-width-sm)",
  md: "sm:max-w-(--cds-overlay-width-md)",
  lg: "sm:max-w-(--cds-overlay-width-lg)",
} as const;

export type DialogContentProps = ComponentProps<typeof DialogPrimitive.Content> & {
  /** Maximum width, from the overlay width tokens. */
  size?: keyof typeof widths;
  /** Render the top-right close button. Keep it unless the footer offers an explicit way out. */
  showCloseButton?: boolean;
  /** Accessible name of the close button. */
  closeLabel?: string;
};

export function DialogContent({
  className,
  children,
  size = "md",
  showCloseButton = true,
  closeLabel = "Close",
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        data-size={size}
        className={cn(
          overlayPanel,
          widths[size],
          "fixed top-1/2 left-1/2 z-(--cds-z-index-modal) grid max-h-[calc(100dvh-2rem)] w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-5 overflow-y-auto rounded-overlay p-(--cds-overlay-padding)",
          "duration-(--cds-duration-base) data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close asChild>
            <IconButton
              data-slot="dialog-close"
              label={closeLabel}
              icon={<XIcon />}
              size="sm"
              className="absolute top-3 right-3"
            />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

export function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div data-slot="dialog-header" className={cn(overlayHeader, "pr-8", className)} {...props} />
  );
}

export function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="dialog-footer" className={cn(overlayFooter, className)} {...props} />;
}

/** Required: gives the dialog its accessible name. Hide it visually with `sr-only` if needed. */
export function DialogTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(overlayTitle, className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(overlayDescription, className)}
      {...props}
    />
  );
}
