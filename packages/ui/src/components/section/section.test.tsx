import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Section } from "./section.js";

describe("Section", () => {
  it("is a named region labelled by its heading", () => {
    render(
      <Section id="work">
        <h2 id="work-title">Selected work</h2>
      </Section>,
    );
    expect(screen.getByRole("region", { name: "Selected work" })).toHaveAttribute("id", "work");
  });

  it("accepts an explicit labelledBy and spacing", () => {
    render(
      <Section labelledBy="t" spacing="sm">
        <h2 id="t">About</h2>
      </Section>,
    );
    expect(screen.getByRole("region", { name: "About" })).toHaveClass(
      "py-(--cds-space-section-sm)",
    );
  });
});
