import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "./popover.js";

describe("Popover", () => {
  it("toggles a dialog panel from its trigger", async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger>Dimensions</PopoverTrigger>
        <PopoverContent aria-label="Dimensions">
          <PopoverHeader>
            <PopoverTitle>Dimensions</PopoverTitle>
            <PopoverDescription>Set the layer size.</PopoverDescription>
          </PopoverHeader>
          <input aria-label="Width" />
        </PopoverContent>
      </Popover>,
    );
    const trigger = screen.getByRole("button", { name: "Dimensions" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(await screen.findByRole("dialog", { name: "Dimensions" })).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expectNoA11yViolations();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
