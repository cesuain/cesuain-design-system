import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Stack } from "./stack.js";

describe("Stack", () => {
  it("lays out children with token gaps", () => {
    render(
      <Stack direction="row" gap="lg" align="center" data-testid="stack">
        <span>A</span>
        <span>B</span>
      </Stack>,
    );
    expect(screen.getByTestId("stack")).toHaveClass(
      "flex",
      "flex-row",
      "gap-(--cds-space-stack-lg)",
      "items-center",
    );
  });

  it("defaults to a column with medium gap", () => {
    render(<Stack data-testid="stack" />);
    expect(screen.getByTestId("stack")).toHaveClass("flex-col", "gap-(--cds-space-stack-md)");
  });
});
