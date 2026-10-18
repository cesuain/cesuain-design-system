import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import { Slider } from "./slider.js";

describe("Slider", () => {
  it("renders a labelled thumb with value attributes", async () => {
    render(<Slider aria-label="Volume" defaultValue={[40]} />);
    const thumb = screen.getByRole("slider", { name: "Volume" });
    expect(thumb).toHaveAttribute("aria-valuenow", "40");
    expect(thumb).toHaveAttribute("aria-valuemin", "0");
    expect(thumb).toHaveAttribute("aria-valuemax", "100");
    await expectNoA11yViolations();
  });

  it("changes value with the keyboard", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Slider aria-label="Opacity" defaultValue={[50]} step={10} onValueChange={onValueChange} />,
    );
    await user.tab();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenLastCalledWith([60]);
    await user.keyboard("{Home}");
    expect(onValueChange).toHaveBeenLastCalledWith([0]);
  });

  it("names each thumb of a range", () => {
    render(<Slider defaultValue={[20, 80]} thumbLabels={["Minimum", "Maximum"]} />);
    expect(screen.getByRole("slider", { name: "Minimum" })).toHaveAttribute("aria-valuenow", "20");
    expect(screen.getByRole("slider", { name: "Maximum" })).toHaveAttribute("aria-valuenow", "80");
  });
});
