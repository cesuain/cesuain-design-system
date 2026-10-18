import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Menu } from "lucide-react";
import { describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import { IconButton } from "./icon-button.js";

describe("IconButton", () => {
  it("uses the label as its accessible name and hides the icon", async () => {
    render(<IconButton label="Open menu" icon={<Menu />} />);
    const button = screen.getByRole("button", { name: "Open menu" });
    expect(button.querySelector("svg")?.closest("[aria-hidden=true]")).not.toBeNull();
    await expectNoA11yViolations();
  });

  it("defaults to the ghost variant and maps sizes to icon sizes", () => {
    render(<IconButton label="Close" icon={<Menu />} size="lg" />);
    const button = screen.getByRole("button", { name: "Close" });
    expect(button).toHaveAttribute("data-variant", "ghost");
    expect(button).toHaveAttribute("data-size", "icon-lg");
  });

  it("forwards button props such as onClick and aria-expanded", async () => {
    const onClick = vi.fn();
    render(<IconButton label="Toggle" icon={<Menu />} aria-expanded={false} onClick={onClick} />);
    const button = screen.getByRole("button", { name: "Toggle" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });
});
