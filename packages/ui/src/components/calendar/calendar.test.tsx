import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import { Calendar } from "./calendar.js";

const month = new Date(2026, 4, 1); // May 2026

describe("Calendar", () => {
  it("renders an accessible month grid", async () => {
    render(<Calendar mode="single" defaultMonth={month} />);
    expect(screen.getByRole("grid", { name: "May 2026" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Next month/i })).toBeInTheDocument();
    await expectNoA11yViolations();
  });

  it("selects a day", async () => {
    const onSelect = vi.fn();
    render(<Calendar mode="single" defaultMonth={month} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole("button", { name: /^Thursday, May 14, 2026$/ }));
    expect(onSelect).toHaveBeenCalledWith(
      new Date(2026, 4, 14),
      expect.anything(),
      expect.anything(),
      expect.anything(),
    );
  });

  it("navigates months", async () => {
    render(<Calendar mode="single" defaultMonth={month} />);
    await userEvent.click(screen.getByRole("button", { name: /Next month/i }));
    expect(screen.getByRole("grid", { name: "June 2026" })).toBeInTheDocument();
  });

  it("marks the selected day for styling", () => {
    render(<Calendar mode="single" defaultMonth={month} selected={new Date(2026, 4, 20)} />);
    expect(
      screen.getByRole("button", { name: "Wednesday, May 20, 2026, selected" }),
    ).toHaveAttribute("data-selected-single", "true");
  });
});
