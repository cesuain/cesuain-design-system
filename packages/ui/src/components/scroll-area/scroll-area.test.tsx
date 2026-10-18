import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ScrollArea } from "./scroll-area.js";

describe("ScrollArea", () => {
  it("renders a keyboard-focusable viewport around its content", () => {
    render(
      <ScrollArea className="h-20" aria-label="Changelog">
        <p>Entry</p>
      </ScrollArea>,
    );
    const viewport = screen.getByText("Entry").closest("[data-slot=scroll-area-viewport]");
    expect(viewport).toHaveAttribute("tabindex", "0");
  });
});
