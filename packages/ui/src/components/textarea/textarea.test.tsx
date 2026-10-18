import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import { Textarea } from "./textarea.js";

describe("Textarea", () => {
  it("renders a labelled multi-line field that accepts newlines", async () => {
    render(<Textarea aria-label="Message" />);
    const textarea = screen.getByRole("textbox", { name: "Message" });
    await userEvent.type(textarea, "Line one{enter}Line two");
    expect(textarea).toHaveValue("Line one\nLine two");
    await expectNoA11yViolations();
  });

  it("switches to content sizing with autoResize", () => {
    render(<Textarea aria-label="Notes" autoResize />);
    expect(screen.getByRole("textbox")).toHaveClass("field-sizing-content", "resize-none");
  });

  it("respects disabled and invalid states", () => {
    render(<Textarea aria-label="Bio" disabled aria-invalid />);
    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByRole("textbox")).toBeInvalid();
  });
});
