import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "./combobox.js";

const frameworks = ["Next.js", "Hydrogen", "Remix", "Astro"];

function Framework({ onValueChange }: { onValueChange?: (value: string | null) => void }) {
  return (
    <Combobox items={frameworks} onValueChange={onValueChange}>
      <ComboboxInput aria-label="Framework" placeholder="Search frameworks" />
      <ComboboxContent>
        <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
        <ComboboxList aria-label="Frameworks">
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

describe("Combobox", () => {
  it("renders an accessible combobox input", async () => {
    render(<Framework />);
    expect(screen.getByRole("combobox", { name: "Framework" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show options" })).toBeInTheDocument();
    await expectNoA11yViolations();
  });

  it("filters options as the user types and selects one", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Framework onValueChange={onValueChange} />);
    await user.type(screen.getByRole("combobox"), "hyd");
    const options = await screen.findAllByRole("option");
    expect(options.map((o) => o.textContent)).toEqual(["Hydrogen"]);
    await user.click(options[0] as HTMLElement);
    expect(onValueChange).toHaveBeenCalledWith("Hydrogen", expect.anything());
    expect(screen.getByRole("combobox")).toHaveValue("Hydrogen");
  });

  it("shows the empty state when nothing matches", async () => {
    const user = userEvent.setup();
    render(<Framework />);
    await user.type(screen.getByRole("combobox"), "zzz");
    expect(await screen.findByText("No frameworks found.")).toBeInTheDocument();
  });
});
