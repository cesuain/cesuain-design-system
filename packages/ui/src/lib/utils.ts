import { tailwindTheme } from "@cesuain/tokens";
import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge only knows Tailwind's default scale. Registering the token-derived names
 * lets it resolve conflicts such as `text-body-sm` vs `text-label-md` or `rounded-card` vs
 * `rounded-lg` instead of keeping both.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [...tailwindTheme.text],
      radius: [...tailwindTheme.radius],
      shadow: [...tailwindTheme.shadow],
      font: [...tailwindTheme.font, "eyebrow"],
      ease: [...tailwindTheme.ease],
    },
  },
});

/** Merges conditional class names and resolves Tailwind conflicts (last one wins). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
