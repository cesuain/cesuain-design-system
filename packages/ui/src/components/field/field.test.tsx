import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import { Input } from "../input/input.js";
import { Switch } from "../switch/switch.js";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "./field.js";

describe("Field", () => {
  it("wires label, description and error to the control", async () => {
    render(
      <Field invalid>
        <FieldLabel htmlFor="email" required>
          Email
        </FieldLabel>
        <Input id="email" aria-invalid aria-describedby="email-hint email-error" aria-required />
        <FieldDescription id="email-hint">We never share it.</FieldDescription>
        <FieldError id="email-error">Enter a valid email address.</FieldError>
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: /Email/ });
    expect(input).toHaveAccessibleDescription("We never share it. Enter a valid email address.");
    expect(input).toBeInvalid();
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid email address.");
    expect(screen.getByRole("group")).toHaveAttribute("data-invalid", "true");
    await expectNoA11yViolations();
  });

  it("renders a visual required marker hidden from assistive technology", () => {
    render(<FieldLabel required>Name</FieldLabel>);
    const marker = screen.getByText("*");
    expect(marker).toHaveAttribute("aria-hidden", "true");
  });

  it("collapses duplicate validation errors and lists several", () => {
    const { rerender } = render(
      <FieldError errors={[{ message: "Required" }, { message: "Required" }]} />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    rerender(
      <FieldError errors={[{ message: "Too short" }, { message: "Must contain a number" }]} />,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("renders nothing without errors", () => {
    const { container } = render(<FieldError errors={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("groups fields in a fieldset with a legend", async () => {
    render(
      <FieldSet>
        <FieldLegend>Notifications</FieldLegend>
        <FieldGroup>
          <Field orientation="horizontal">
            <Switch id="n-email" />
            <FieldContent>
              <FieldLabel htmlFor="n-email">Email</FieldLabel>
              <FieldDescription>Weekly digest.</FieldDescription>
            </FieldContent>
          </Field>
        </FieldGroup>
        <FieldSeparator>or</FieldSeparator>
      </FieldSet>,
    );
    expect(screen.getByRole("group", { name: "Notifications" })).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "Email" })).toBeInTheDocument();
    await expectNoA11yViolations();
  });
});
