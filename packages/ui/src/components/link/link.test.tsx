import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import { Link } from "./link.js";

describe("Link", () => {
  it("renders an anchor", async () => {
    render(<Link href="/work">Selected work</Link>);
    expect(screen.getByRole("link", { name: "Selected work" })).toHaveAttribute("href", "/work");
    await expectNoA11yViolations();
  });

  it("opens external links safely and announces it", () => {
    render(
      <Link href="https://github.com" external>
        GitHub
      </Link>,
    );
    const link = screen.getByRole("link", { name: "GitHub, opens in a new tab" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("styles a child component with asChild", () => {
    render(
      <Link asChild variant="subtle">
        <a href="/cv">Résumé</a>
      </Link>,
    );
    expect(screen.getByRole("link", { name: "Résumé" })).toHaveClass("text-muted-foreground");
  });
});
