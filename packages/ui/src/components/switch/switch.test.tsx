import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import { Switch } from "./switch.js";

describe("Switch", () => {
  it("exposes role=switch and toggles aria-checked", async () => {
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="Dark mode" onCheckedChange={onCheckedChange} />);
    const control = screen.getByRole("switch", { name: "Dark mode" });
    expect(control).toHaveAttribute("aria-checked", "false");
    await userEvent.click(control);
    expect(control).toHaveAttribute("aria-checked", "true");
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    await expectNoA11yViolations();
  });

  it("toggles from the keyboard", async () => {
    const user = userEvent.setup();
    render(<Switch aria-label="Notifications" defaultChecked />);
    await user.tab();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });

  it("supports sizes and the disabled state", async () => {
    render(<Switch aria-label="Beta" size="sm" disabled />);
    const control = screen.getByRole("switch");
    expect(control).toHaveAttribute("data-size", "sm");
    await userEvent.click(control);
    expect(control).toHaveAttribute("aria-checked", "false");
  });
});
