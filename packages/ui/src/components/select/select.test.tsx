import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select.js";

function Framework(props: { onValueChange?: (v: string) => void; disabled?: boolean }) {
  return (
    <Select onValueChange={props.onValueChange} disabled={props.disabled}>
      <SelectTrigger aria-label="Framework">
        <SelectValue placeholder="Pick a framework" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>React</SelectLabel>
          <SelectItem value="next">Next.js</SelectItem>
          <SelectItem value="hydrogen">Hydrogen</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectItem value="astro" disabled>
          Astro
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

describe("Select", () => {
  it("renders a combobox trigger with a placeholder", async () => {
    render(<Framework />);
    const trigger = screen.getByRole("combobox", { name: "Framework" });
    expect(trigger).toHaveTextContent("Pick a framework");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expectNoA11yViolations();
  });

  it("opens with the keyboard and selects an option", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Framework onValueChange={onValueChange} />);
    screen.getByRole("combobox").focus();
    await user.keyboard("{Enter}");
    const listbox = await screen.findByRole("listbox");
    expect(listbox).toBeInTheDocument();
    await user.click(screen.getByRole("option", { name: "Hydrogen" }));
    expect(onValueChange).toHaveBeenCalledWith("hydrogen");
    expect(screen.getByRole("combobox")).toHaveTextContent("Hydrogen");
  });

  it("marks disabled options", async () => {
    const user = userEvent.setup();
    render(<Framework />);
    screen.getByRole("combobox").focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("option", { name: "Astro" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("does not open when disabled", async () => {
    render(<Framework disabled />);
    await userEvent.click(screen.getByRole("combobox"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
