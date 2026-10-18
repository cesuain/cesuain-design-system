import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import { Input } from "./input.js";

describe("Input", () => {
  it("renders a labelled text field", async () => {
    render(<Input aria-label="Name" placeholder="Ada Lovelace" />);
    const input = screen.getByRole("textbox", { name: "Name" });
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("data-size", "md");
    await expectNoA11yViolations();
  });

  it("accepts typing when uncontrolled", async () => {
    render(<Input aria-label="Name" />);
    await userEvent.type(screen.getByRole("textbox"), "Cesuain");
    expect(screen.getByRole("textbox")).toHaveValue("Cesuain");
  });

  it("supports controlled usage", async () => {
    const onChange = vi.fn();
    function Controlled() {
      const [value, setValue] = useState("");
      return (
        <Input
          aria-label="Handle"
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            setValue(event.target.value.toLowerCase());
          }}
        />
      );
    }
    render(<Controlled />);
    await userEvent.type(screen.getByRole("textbox"), "AB");
    expect(onChange).toHaveBeenLastCalledWith("aB");
    expect(screen.getByRole("textbox")).toHaveValue("ab");
  });

  it("exposes invalid and disabled states", async () => {
    render(<Input aria-label="Email" aria-invalid disabled />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInvalid();
    expect(input).toBeDisabled();
    await userEvent.type(input, "x");
    expect(input).toHaveValue("");
  });

  it("applies the requested size", () => {
    render(<Input aria-label="Search" inputSize="sm" />);
    expect(screen.getByRole("textbox")).toHaveClass("h-(--cds-control-height-sm)");
  });
});
