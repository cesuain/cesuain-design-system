import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import { Badge } from "./badge.js";

describe("Badge", () => {
  it("renders a span with its variant", async () => {
    render(<Badge variant="success">Available</Badge>);
    expect(screen.getByText("Available").tagName).toBe("SPAN");
    expect(screen.getByText("Available")).toHaveAttribute("data-variant", "success");
    await expectNoA11yViolations();
  });

  it("renders a link with asChild", () => {
    render(
      <Badge asChild>
        <a href="/tags/react">React</a>
      </Badge>,
    );
    expect(screen.getByRole("link", { name: "React" })).toHaveAttribute("data-slot", "badge");
  });
});
