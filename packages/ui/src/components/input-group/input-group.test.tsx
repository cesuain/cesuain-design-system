import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Search } from "lucide-react";
import { describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "./input-group.js";

describe("InputGroup", () => {
  it("renders an input with add-ons inside one group", async () => {
    render(
      <InputGroup>
        <InputGroupInput aria-label="Search components" placeholder="Search…" />
        <InputGroupAddon>
          <Search aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupText>⌘K</InputGroupText>
        </InputGroupAddon>
      </InputGroup>,
    );
    expect(screen.getByRole("textbox", { name: "Search components" })).toBeInTheDocument();
    expect(screen.getByText("⌘K")).toBeInTheDocument();
    await expectNoA11yViolations();
  });

  it("focuses the control when an add-on is clicked", async () => {
    render(
      <InputGroup>
        <InputGroupInput aria-label="Amount" />
        <InputGroupAddon>
          <InputGroupText>$</InputGroupText>
        </InputGroupAddon>
      </InputGroup>,
    );
    await userEvent.click(screen.getByText("$"));
    expect(screen.getByRole("textbox", { name: "Amount" })).toHaveFocus();
  });

  it("renders non-submitting buttons that do not steal focus routing", async () => {
    const onClick = vi.fn();
    const onSubmit = vi.fn((event: Event) => event.preventDefault());
    render(
      <form aria-label="Copy" onSubmit={(e) => onSubmit(e.nativeEvent)}>
        <InputGroup>
          <InputGroupInput aria-label="Link" defaultValue="https://cesarfonseca.dev" readOnly />
          <InputGroupAddon align="inline-end">
            <InputGroupButton onClick={onClick}>Copy</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>,
    );
    const button = screen.getByRole("button", { name: "Copy" });
    expect(button).toHaveAttribute("type", "button");
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("supports a textarea control", () => {
    render(
      <InputGroup>
        <InputGroupTextarea aria-label="Prompt" />
        <InputGroupAddon align="block-end">
          <InputGroupText>0 / 280</InputGroupText>
        </InputGroupAddon>
      </InputGroup>,
    );
    expect(screen.getByRole("textbox", { name: "Prompt" }).tagName).toBe("TEXTAREA");
  });
});
