import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import { Timeline, TimelineItem } from "./timeline.js";

describe("Timeline", () => {
  it("renders an ordered list with the current step marked", async () => {
    render(
      <Timeline aria-label="Experience">
        <TimelineItem period="2024 — Present" current index={1}>
          Role A
        </TimelineItem>
        <TimelineItem period="2021 — 2024" index={2}>
          Role B
        </TimelineItem>
      </Timeline>,
    );
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveAttribute("aria-current", "step");
    expect(items[1]).not.toHaveAttribute("aria-current");
    expect(document.querySelector("[data-index='01']")).toHaveAttribute("aria-hidden", "true");
    await expectNoA11yViolations();
  });
});
