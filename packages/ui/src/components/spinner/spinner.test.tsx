import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import { Spinner } from "./spinner.js";

describe("Spinner", () => {
  it("announces itself as a status with a default label", async () => {
    render(<Spinner />);
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
    await expectNoA11yViolations();
  });

  it("accepts a custom label", () => {
    render(<Spinner label="Saving changes" />);
    expect(screen.getByRole("status", { name: "Saving changes" })).toBeInTheDocument();
  });

  it("is hidden from assistive technology when the label is null", () => {
    const { container } = render(<Spinner label={null} />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("applies size variants", () => {
    const { container } = render(<Spinner size="lg" />);
    expect(container.querySelector("svg")).toHaveClass("size-6");
  });
});
