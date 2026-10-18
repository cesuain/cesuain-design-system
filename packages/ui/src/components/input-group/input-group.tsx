"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { fieldControl } from "../../lib/styles.js";
import { cn } from "../../lib/utils.js";
import { Button, type ButtonProps } from "../button/button.js";

/**
 * A text field with inline or block add-ons (icons, prefixes, buttons, keyboard hints).
 * Focus and invalid styles are driven by the inner control.
 */
export function InputGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        fieldControl,
        "group/input-group relative flex h-(--cds-control-height-md) items-center",
        "has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-4 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/20",
        "has-[[data-slot=input-group-control][aria-invalid=true]]:border-destructive",
        "has-[:disabled]:opacity-50",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto",
        className,
      )}
      {...props}
    />
  );
}

export const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-label-sm text-muted-foreground select-none [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start": "order-first pl-4 has-[>button]:pl-1.5",
        "inline-end": "order-last pr-4 has-[>button]:pr-1.5",
        "block-start": "order-first w-full justify-start px-4 pt-3",
        "block-end": "order-last w-full justify-start px-4 pb-3",
      },
    },
    defaultVariants: { align: "inline-start" },
  },
);

export type InputGroupAddonProps = ComponentProps<"div"> &
  VariantProps<typeof inputGroupAddonVariants>;

/** Decorative or interactive content placed around the control. Clicking it focuses the input. */
export function InputGroupAddon({
  className,
  align = "inline-start",
  onClick,
  ...props
}: InputGroupAddonProps) {
  return (
    // The click handler only forwards focus to the input, which remains keyboard reachable on its own.
    <div
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(event) => {
        onClick?.(event);
        if ((event.target as HTMLElement).closest("button")) return;
        event.currentTarget.parentElement
          ?.querySelector<HTMLElement>("[data-slot=input-group-control]")
          ?.focus();
      }}
      {...props}
    />
  );
}

/** Plain text such as a currency or unit. */
export function InputGroupText({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="input-group-text"
      className={cn("flex items-center gap-2 text-body-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export type InputGroupButtonProps = Omit<ButtonProps, "size"> & { size?: "sm" | "icon-sm" };

/** Compact button placed inside an add-on. Defaults to `type="button"` so it never submits the form. */
export function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "sm",
  ...props
}: InputGroupButtonProps) {
  return (
    <Button
      type={type}
      variant={variant}
      size={size === "sm" ? "sm" : "icon-sm"}
      className={cn(size === "sm" ? "h-8 px-3" : "size-8", className)}
      {...props}
    />
  );
}

export function InputGroupInput({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      data-slot="input-group-control"
      className={cn(
        "h-full min-w-0 flex-1 bg-transparent px-(--cds-field-padding-x) text-body-md text-foreground outline-none placeholder:text-muted-foreground",
        "group-has-[>[data-align=inline-end]]/input-group:pr-2 group-has-[>[data-align=inline-start]]/input-group:pl-2",
        "disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
}

export function InputGroupTextarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="input-group-control"
      className={cn(
        "min-h-24 w-full flex-1 resize-none bg-transparent px-(--cds-field-padding-x) py-3 text-body-md text-foreground outline-none placeholder:text-muted-foreground",
        "disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
}
