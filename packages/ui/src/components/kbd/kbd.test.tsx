import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Kbd, KbdGroup } from "./kbd.js";

describe("Kbd", () => {
  it("renders semantic kbd elements", () => {
    render(
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>,
    );
    expect(screen.getByText("K").tagName).toBe("KBD");
    expect(screen.getByText("K").parentElement?.tagName).toBe("KBD");
  });
});
