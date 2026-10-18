"use client";

import type { ReactNode } from "react";

import { Button, type ButtonProps } from "../button/button.js";

export type IconButtonProps = Omit<ButtonProps, "size" | "aria-label" | "children"> & {
  /** Accessible name. Required because the button has no visible text. */
  label: string;
  /** The icon to render. It is hidden from assistive technology. */
  icon: ReactNode;
  size?: "sm" | "md" | "lg";
};

const sizes = { sm: "icon-sm", md: "icon", lg: "icon-lg" } as const;

/** A square, icon-only button. Enforces an accessible name through the required `label` prop. */
export function IconButton({
  label,
  icon,
  size = "md",
  variant = "ghost",
  ...props
}: IconButtonProps) {
  return (
    <Button
      data-slot="icon-button"
      aria-label={label}
      size={sizes[size]}
      variant={variant}
      {...props}
    >
      <span aria-hidden="true" className="contents">
        {icon}
      </span>
    </Button>
  );
}
