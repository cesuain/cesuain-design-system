import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./command.js";

function Items({ onSelect = () => {} }: { onSelect?: (value: string) => void }) {
  return (
    <>
      <CommandInput placeholder="Search…" aria-label="Search commands" />
      <CommandList>
        <CommandEmpty>Nothing found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={onSelect}>Work</CommandItem>
          <CommandItem onSelect={onSelect}>About</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Links">
          <CommandItem onSelect={onSelect}>GitHub</CommandItem>
        </CommandGroup>
      </CommandList>
    </>
  );
}

describe("Command", () => {
  it("filters items as the user types", async () => {
    const user = userEvent.setup();
    render(
      <Command label="Commands">
        <Items />
      </Command>,
    );
    await user.type(screen.getByRole("combobox"), "git");
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["GitHub"]);
    await user.clear(screen.getByRole("combobox"));
    await user.type(screen.getByRole("combobox"), "zzz");
    expect(screen.getByText("Nothing found.")).toBeInTheDocument();
  });

  it("runs the highlighted item on Enter", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Command label="Commands">
        <Items onSelect={onSelect} />
      </Command>,
    );
    await user.click(screen.getByRole("combobox"));
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onSelect).toHaveBeenCalledWith("About");
  });

  it("renders inside a labelled dialog", async () => {
    render(
      <CommandDialog open title="Command palette">
        <Items />
      </CommandDialog>,
    );
    expect(await screen.findByRole("dialog", { name: "Command palette" })).toBeInTheDocument();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await expectNoA11yViolations();
  });
});
