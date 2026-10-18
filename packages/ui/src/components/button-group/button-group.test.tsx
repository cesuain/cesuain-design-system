import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import { Button } from "../button/button.js";
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "./button-group.js";

describe("ButtonGroup", () => {
  it("renders a labelled group of buttons", async () => {
    render(
      <ButtonGroup aria-label="Text alignment">
        <Button variant="outline">Left</Button>
        <Button variant="outline">Center</Button>
        <Button variant="outline">Right</Button>
      </ButtonGroup>,
    );
    const group = screen.getByRole("group", { name: "Text alignment" });
    expect(group).toHaveAttribute("data-orientation", "horizontal");
    expect(screen.getAllByRole("button")).toHaveLength(3);
    await expectNoA11yViolations();
  });

  it("supports vertical orientation", () => {
    render(
      <ButtonGroup aria-label="Actions" orientation="vertical">
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole("group")).toHaveClass("flex-col");
  });

  it("renders text and separators", () => {
    render(
      <ButtonGroup aria-label="Page size">
        <ButtonGroupText>Rows</ButtonGroupText>
        <ButtonGroupSeparator />
        <Button variant="outline">25</Button>
      </ButtonGroup>,
    );
    expect(screen.getByText("Rows")).toHaveAttribute("data-slot", "button-group-text");
    expect(document.querySelector("[data-slot=button-group-separator]")).toBeInTheDocument();
  });
});
