import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import { SegmentedControl, SegmentedControlItem } from "./segmented-control.js";

describe("SegmentedControl", () => {
  it("renders a labelled navigation of links with the active one marked", async () => {
    render(
      <SegmentedControl aria-label="Language">
        <SegmentedControlItem href="/en" active hrefLang="en">
          EN
        </SegmentedControlItem>
        <SegmentedControlItem href="/pt-br" hrefLang="pt-BR" title="Português (Brasil)">
          PT
        </SegmentedControlItem>
      </SegmentedControl>,
    );
    expect(screen.getByRole("navigation", { name: "Language" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "PT" })).not.toHaveAttribute("aria-current");
    await expectNoA11yViolations();
  });

  it("exposes its size for styling", () => {
    render(
      <SegmentedControl aria-label="View" size="md">
        <SegmentedControlItem href="#">Grid</SegmentedControlItem>
      </SegmentedControl>,
    );
    expect(screen.getByRole("navigation")).toHaveAttribute("data-size", "md");
  });
});
