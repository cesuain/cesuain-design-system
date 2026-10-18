import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import { ContentWrapper } from "./content-wrapper.js";

describe("ContentWrapper", () => {
  it("wraps rich content without changing its semantics", async () => {
    render(
      <ContentWrapper asChild>
        <article>
          <h2>Heading</h2>
          <p>
            Text with <a href="#x">a link</a>.
          </p>
        </article>
      </ContentWrapper>,
    );
    expect(screen.getByRole("article")).toHaveAttribute("data-slot", "content-wrapper");
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    await expectNoA11yViolations();
  });
});
