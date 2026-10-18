import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Surface } from "./surface.js";

describe("Surface", () => {
  it("maps variants to token-based classes", () => {
    render(
      <Surface variant="glass" radius="overlay" padding="lg" elevation="md" data-testid="s">
        Content
      </Surface>,
    );
    expect(screen.getByTestId("s")).toHaveClass(
      "glass",
      "rounded-overlay",
      "p-(--cds-space-inset-lg)",
      "shadow-elevation-md",
    );
  });

  it("can render semantic elements", () => {
    render(
      <Surface asChild>
        <aside aria-label="Note">Note</aside>
      </Surface>,
    );
    expect(screen.getByRole("complementary", { name: "Note" })).toHaveClass("surface");
  });
});
