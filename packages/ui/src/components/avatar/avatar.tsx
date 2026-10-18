"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Avatar as AvatarPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "../../lib/utils.js";

export const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full select-none",
  {
    variants: {
      size: {
        sm: "size-8 text-label-xs",
        md: "size-10 text-label-sm",
        lg: "size-14 text-label-md",
        xl: "size-20 text-heading-sm",
      },
      ring: {
        none: "",
        /** Brand gradient ring around the image. */
        brand:
          "bg-brand-gradient p-[1.5px] transition-shadow duration-(--cds-duration-moderate) *:rounded-full hover:shadow-glow-brand",
      },
    },
    defaultVariants: { size: "md", ring: "none" },
  },
);

export type AvatarProps = ComponentProps<typeof AvatarPrimitive.Root> &
  VariantProps<typeof avatarVariants>;

/** A person's photo with an initials fallback while the image loads or if it fails. */
export function Avatar({ className, size, ring, ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size ?? "md"}
      className={cn(avatarVariants({ size, ring }), className)}
      {...props}
    />
  );
}

/** Requires `alt`. Use the person's name, or `""` when their name is already next to the avatar. */
export function AvatarImage({
  className,
  alt,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Image> & { alt: string }) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      alt={alt}
      className={cn("aspect-square size-full bg-background object-cover", className)}
      {...props}
    />
  );
}

export function AvatarFallback({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center bg-muted font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

/** Overlapping stack of avatars. */
export function AvatarGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className,
      )}
      {...props}
    />
  );
}
