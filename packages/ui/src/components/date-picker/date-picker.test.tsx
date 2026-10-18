import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import { Label } from "../label/label.js";
import { DatePicker } from "./date-picker.js";

describe("DatePicker", () => {
  it("is a labelled button showing the placeholder", async () => {
    render(
      <>
        <Label htmlFor="start">Start date</Label>
        <DatePicker id="start" />
      </>,
    );
    const trigger = screen.getByRole("button", { name: /Start date/ });
    expect(trigger).toHaveTextContent("Pick a date");
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    await expectNoA11yViolations();
  });

  it("picks a date, closes and submits it as ISO", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <form>
        <DatePicker
          aria-label="Start date"
          defaultValue={new Date(2026, 4, 14)}
          onValueChange={onValueChange}
          name="start"
        />
      </form>,
    );
    const trigger = screen.getByRole("button", { name: "Start date" });
    expect(trigger).toHaveTextContent("May 14th, 2026");
    await user.click(trigger);
    await user.click(await screen.findByRole("button", { name: /May 20, 2026/ }));
    expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 4, 20));
    expect(trigger).toHaveTextContent("May 20th, 2026");
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
    expect(container.querySelector<HTMLInputElement>("input[name=start]")?.value).toBe(
      "2026-05-20",
    );
  });
});
