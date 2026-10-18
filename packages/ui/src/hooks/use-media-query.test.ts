import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MOBILE_QUERY, useIsMobile, useMediaQuery } from "./use-media-query.js";

describe("useMediaQuery", () => {
  it("returns the current match", () => {
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      ...original(query),
      matches: query === MOBILE_QUERY,
    })) as typeof window.matchMedia;
    try {
      expect(renderHook(() => useIsMobile()).result.current).toBe(true);
      expect(
        renderHook(() => useMediaQuery("(prefers-reduced-motion: reduce)")).result.current,
      ).toBe(false);
    } finally {
      window.matchMedia = original;
    }
  });
});
