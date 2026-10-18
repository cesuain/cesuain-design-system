import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Grid } from "./grid.js";

describe("Grid", () => {
  it("collapses to one column and expands at breakpoints", () => {
    render(<Grid columns={4} data-testid="grid" />);
    expect(screen.getByTestId("grid")).toHaveClass(
      "grid",
      "grid-cols-1",
      "sm:grid-cols-2",
      "lg:grid-cols-4",
    );
  });

  it("renders a list with asChild", () => {
    render(
      <Grid asChild columns="auto">
        <ul>
          <li>Item</li>
        </ul>
      </Grid>,
    );
    expect(screen.getByRole("list")).toHaveAttribute("data-slot", "grid");
  });
});
