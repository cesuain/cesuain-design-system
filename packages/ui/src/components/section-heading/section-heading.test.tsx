import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import { SectionHeading } from "./section-heading.js";

describe("SectionHeading", () => {
  it("renders an h2 including the highlighted word", async () => {
    render(
      <SectionHeading
        titleId="work-title"
        eyebrow="Work"
        title="Selected"
        highlight="projects"
        description="Recent work."
      />,
    );
    const heading = screen.getByRole("heading", { level: 2, name: "Selected projects" });
    expect(heading).toHaveAttribute("id", "work-title");
    expect(screen.getByText("projects")).toHaveClass("text-gradient");
    await expectNoA11yViolations();
  });

  it("supports h3 and centered alignment", () => {
    render(<SectionHeading as="h3" title="Education" align="center" />);
    expect(screen.getByRole("heading", { level: 3 }).parentElement).toHaveAttribute(
      "data-align",
      "center",
    );
  });

  it("scales the title with the size prop", () => {
    render(<SectionHeading title="Work" size="2xl" />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveClass("text-display-2xl", "text-foreground");
    expect(heading).not.toHaveClass("text-display-lg");
    expect(heading.parentElement).toHaveAttribute("data-size", "2xl");
  });
});
