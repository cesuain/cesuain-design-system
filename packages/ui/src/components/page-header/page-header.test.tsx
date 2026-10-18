import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderEyebrow,
  PageHeaderHighlight,
  PageHeaderTitle,
} from "./page-header.js";

describe("PageHeader", () => {
  it("renders the page h1 with a highlighted word", async () => {
    render(
      <PageHeader align="center">
        <PageHeaderEyebrow>Design system</PageHeaderEyebrow>
        <PageHeaderTitle>
          Build <PageHeaderHighlight>faster</PageHeaderHighlight>
        </PageHeaderTitle>
        <PageHeaderDescription>Tokens and components.</PageHeaderDescription>
        <PageHeaderActions>
          <a href="#start">Get started</a>
        </PageHeaderActions>
      </PageHeader>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Build faster" })).toBeInTheDocument();
    expect(screen.getByText("faster")).toHaveClass("text-gradient");
    expect(screen.getByRole("banner")).toHaveAttribute("data-align", "center");
    await expectNoA11yViolations();
  });
});
