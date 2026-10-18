import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import { Separator } from "./separator.js";

describe("Separator", () => {
  it("is decorative by default", () => {
    const { container } = render(<Separator />);
    expect(container.firstChild).toHaveAttribute("role", "none");
    expect(container.firstChild).toHaveAttribute("data-orientation", "horizontal");
  });

  it("exposes a semantic separator with orientation when not decorative", async () => {
    render(<Separator decorative={false} orientation="vertical" />);
    const separator = screen.getByRole("separator");
    expect(separator).toHaveAttribute("aria-orientation", "vertical");
    await expectNoA11yViolations();
  });
});
