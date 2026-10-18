import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Container } from "./container.js";

describe("Container", () => {
  it("applies the max width for its size", () => {
    render(<Container size="md">Content</Container>);
    expect(screen.getByText("Content")).toHaveClass("max-w-(--cds-size-container-md)", "mx-auto");
  });

  it("renders as a landmark with asChild", () => {
    render(
      <Container asChild>
        <main>Page</main>
      </Container>,
    );
    expect(screen.getByRole("main")).toHaveAttribute("data-slot", "container");
  });
});
