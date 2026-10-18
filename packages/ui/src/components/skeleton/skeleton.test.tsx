import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Skeleton } from "./skeleton.js";

describe("Skeleton", () => {
  it("is hidden from assistive technology and accepts sizing classes", () => {
    const { container } = render(<Skeleton className="h-4 w-32" />);
    const el = container.firstElementChild;
    expect(el).toHaveAttribute("aria-hidden", "true");
    expect(el).toHaveClass("h-4", "w-32");
  });
});
