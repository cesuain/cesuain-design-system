"use client";

import { useSyncExternalStore } from "react";

/**
 * Subscribes to a CSS media query. Returns `false` during server rendering, then the live
 * value. Built on `useSyncExternalStore`, so every component reading the same query agrees.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Matches the `breakpoint.md` token (48rem / 768px). Below it, layouts switch to mobile patterns. */
export const MOBILE_QUERY = "(max-width: 47.99rem)";

/** True below the `md` breakpoint. */
export function useIsMobile(): boolean {
  return useMediaQuery(MOBILE_QUERY);
}
