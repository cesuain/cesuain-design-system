import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group.js";

function Alignment(props: { onValueChange?: (value: string) => void }) {
  return (
    <ToggleGroup
      type="single"
      aria-label="Alignment"
      defaultValue="left"
      onValueChange={props.onValueChange}
    >
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
    </ToggleGroup>
  );
}

describe("ToggleGroup", () => {
  it("selects a single item at a time", async () => {
    const onValueChange = vi.fn();
    render(<Alignment onValueChange={onValueChange} />);
    expect(screen.getByRole("radio", { name: "Left" })).toHaveAttribute("aria-checked", "true");
    await userEvent.click(screen.getByRole("radio", { name: "Center" }));
    expect(onValueChange).toHaveBeenCalledWith("center");
    expect(screen.getByRole("radio", { name: "Center" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Left" })).toHaveAttribute("aria-checked", "false");
    await expectNoA11yViolations();
  });

  it("moves focus with arrow keys", async () => {
    const user = userEvent.setup();
    render(<Alignment />);
    await user.tab();
    expect(screen.getByRole("radio", { name: "Left" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Center" })).toHaveFocus();
  });

  it("allows several items in multiple mode", async () => {
    render(
      <ToggleGroup type="multiple" aria-label="Formatting">
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Bold" }));
    await userEvent.click(screen.getByRole("button", { name: "Italic" }));
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Italic" })).toHaveAttribute("aria-pressed", "true");
  });

  it("marks the attached style", () => {
    render(
      <ToggleGroup type="single" aria-label="View" attached>
        <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(screen.getByRole("radiogroup", { name: "View" })).toHaveAttribute(
      "data-attached",
      "true",
    );
  });
});
