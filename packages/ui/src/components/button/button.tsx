"use client";

import { Slot } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "../../lib/utils.js";
import { Spinner } from "../spinner/spinner.js";
import { buttonVariants, type ButtonVariantProps } from "./button.variants.js";

export type ButtonProps = ComponentProps<"button"> &
  ButtonVariantProps & {
    /** Render the child element (e.g. a link) with button styles instead of a `<button>`. */
    asChild?: boolean;
    /** Shows a spinner, sets `aria-busy` and blocks interaction while keeping the label visible. */
    loading?: boolean;
  };

/** Triggers an action. Use `asChild` with an anchor for navigation. */
export function Button({
  className,
  variant = "default",
  size = "md",
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  const isIconOnly = typeof size === "string" && size.startsWith("icon");

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      disabled={asChild ? undefined : disabled || loading}
      aria-disabled={asChild && (disabled || loading) ? true : undefined}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {loading ? <Spinner label={null} /> : null}
          {loading && isIconOnly ? null : children}
        </>
      )}
    </Comp>
  );
}
