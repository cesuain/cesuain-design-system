import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import { Label } from "../label/label.js";
import { RadioGroup, RadioGroupItem } from "./radio-group.js";

function Plans({ onValueChange }: { onValueChange?: (value: string) => void }) {
  return (
    <RadioGroup aria-label="Plan" defaultValue="starter" onValueChange={onValueChange}>
      {["starter", "pro", "team"].map((plan) => (
        <div key={plan} className="flex items-center gap-2">
          <RadioGroupItem value={plan} id={`plan-${plan}`} />
          <Label htmlFor={`plan-${plan}`}>{plan}</Label>
        </div>
      ))}
    </RadioGroup>
  );
}

describe("RadioGroup", () => {
  it("renders a labelled radiogroup with the default selection", async () => {
    render(<Plans />);
    expect(screen.getByRole("radiogroup", { name: "Plan" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "starter" })).toBeChecked();
    await expectNoA11yViolations();
  });

  it("selects with click and arrow keys", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Plans onValueChange={onValueChange} />);
    await user.click(screen.getByRole("radio", { name: "pro" }));
    expect(onValueChange).toHaveBeenLastCalledWith("pro");
    expect(screen.getByRole("radio", { name: "pro" })).toBeChecked();
    // Hold the key: Radix selects on the deferred focus move only while an arrow key is down.
    await user.keyboard("{ArrowDown>}");
    await waitFor(() => expect(screen.getByRole("radio", { name: "team" })).toBeChecked());
    await user.keyboard("{/ArrowDown}");
    expect(screen.getByRole("radio", { name: "team" })).toHaveFocus();
  });

  it("skips disabled items", async () => {
    render(
      <RadioGroup aria-label="Size">
        <RadioGroupItem value="s" aria-label="Small" disabled />
        <RadioGroupItem value="m" aria-label="Medium" />
      </RadioGroup>,
    );
    await userEvent.click(screen.getByRole("radio", { name: "Small" }));
    expect(screen.getByRole("radio", { name: "Small" })).not.toBeChecked();
  });
});
