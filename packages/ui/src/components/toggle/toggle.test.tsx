import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import { Toggle } from "./toggle.js";

describe("Toggle", () => {
  it("toggles aria-pressed when uncontrolled", async () => {
    render(<Toggle aria-label="Bold">B</Toggle>);
    const toggle = screen.getByRole("button", { name: "Bold" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(toggle).toHaveAttribute("data-state", "on");
    await expectNoA11yViolations();
  });

  it("supports controlled usage", async () => {
    const onPressedChange = vi.fn();
    function Controlled() {
      const [pressed, setPressed] = useState(true);
      return (
        <Toggle
          aria-label="Italic"
          pressed={pressed}
          onPressedChange={(next) => {
            onPressedChange(next);
            setPressed(next);
          }}
        >
          I
        </Toggle>
      );
    }
    render(<Controlled />);
    const toggle = screen.getByRole("button", { name: "Italic" });
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(toggle);
    expect(onPressedChange).toHaveBeenCalledWith(false);
    expect(toggle).toHaveAttribute("aria-pressed", "false");
  });

  it("can be toggled with the keyboard", async () => {
    const user = userEvent.setup();
    render(<Toggle aria-label="Underline">U</Toggle>);
    await user.tab();
    await user.keyboard(" ");
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("ignores interaction when disabled", async () => {
    render(
      <Toggle aria-label="Strike" disabled>
        S
      </Toggle>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  });
});
