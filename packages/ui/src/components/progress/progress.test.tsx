import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import { Progress } from "./progress.js";

describe("Progress", () => {
  it("exposes its value to assistive technology", async () => {
    render(<Progress aria-label="Upload" value={40} />);
    const bar = screen.getByRole("progressbar", { name: "Upload" });
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    await expectNoA11yViolations();
  });

  it("positions the indicator from value and max", () => {
    const { container } = render(<Progress aria-label="Steps" value={3} max={4} />);
    expect(container.querySelector("[data-slot=progress-indicator]")).toHaveStyle({
      transform: "translateX(-25%)",
    });
  });

  it("clamps out-of-range values visually", () => {
    const { container } = render(<Progress aria-label="Overflow" value={250} />);
    expect(container.querySelector("[data-slot=progress-indicator]")).toHaveStyle({
      transform: "translateX(-0%)",
    });
  });

  it("supports an indeterminate state", () => {
    render(<Progress aria-label="Loading" value={null} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).not.toHaveAttribute("aria-valuenow");
    expect(bar).toHaveAttribute("data-state", "indeterminate");
  });
});
