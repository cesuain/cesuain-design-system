"use client";

import { CircleCheckIcon, InfoIcon, OctagonXIcon, TriangleAlertIcon } from "lucide-react";
import { Toaster as Sonner, toast, type ToasterProps } from "sonner";

import { cn } from "../../lib/utils.js";
import { Spinner } from "../spinner/spinner.js";

/**
 * Renders toast notifications triggered with `toast()` from anywhere in the app. Mount once,
 * near the root. Toasts are fully styled with design tokens, so they follow the active theme
 * without a theme provider.
 */
export function Toaster({ toastOptions, className, ...props }: ToasterProps) {
  return (
    <Sonner
      className={cn("toaster group", className)}
      gap={10}
      icons={{
        success: <CircleCheckIcon className="size-4 text-success" />,
        info: <InfoIcon className="size-4 text-info" />,
        warning: <TriangleAlertIcon className="size-4 text-warning" />,
        error: <OctagonXIcon className="size-4 text-destructive" />,
        // The toast text is already announced by the live region.
        loading: <Spinner size="md" label={null} />,
      }}
      toastOptions={{
        ...toastOptions,
        unstyled: true,
        classNames: {
          toast: cn(
            "group/toast flex w-(--width) items-start gap-3 rounded-card border border-border bg-popover p-4 text-popover-foreground shadow-elevation-lg",
            "data-[type=error]:border-destructive/50 data-[type=success]:border-success/40 data-[type=warning]:border-warning/40",
          ),
          icon: "mt-0.5 flex size-4 shrink-0 items-center justify-center",
          content: "grid flex-1 gap-0.5",
          title: "text-label-md text-foreground",
          description: "text-body-sm text-muted-foreground",
          actionButton:
            "ml-auto inline-flex h-8 shrink-0 items-center rounded-control bg-primary px-3 text-label-sm text-primary-foreground focus-ring",
          cancelButton:
            "inline-flex h-8 shrink-0 items-center rounded-control px-3 text-label-sm text-muted-foreground hover:text-foreground focus-ring",
          closeButton:
            "absolute -top-2 -left-2 grid size-6 place-items-center rounded-full border border-border bg-popover text-muted-foreground hover:text-foreground focus-ring [&_svg]:size-3",
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  );
}

export { toast };
export type { ToasterProps };
