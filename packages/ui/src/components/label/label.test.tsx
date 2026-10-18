import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import { Checkbox } from "../checkbox/checkbox.js";
import { Input } from "../input/input.js";
import { Label } from "./label.js";

describe("Label", () => {
  it("names the associated control", async () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <Input id="email" />
      </>,
    );
    expect(screen.getByRole("textbox", { name: "Email" })).toBeInTheDocument();
    await expectNoA11yViolations();
  });

  it("toggles an associated checkbox when clicked", async () => {
    render(
      <div className="flex items-center gap-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms</Label>
      </div>,
    );
    await userEvent.click(screen.getByText("Accept terms"));
    expect(screen.getByRole("checkbox", { name: "Accept terms" })).toBeChecked();
  });
});
