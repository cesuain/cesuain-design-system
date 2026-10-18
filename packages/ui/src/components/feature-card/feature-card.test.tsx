import { render, screen } from "@testing-library/react";
import { Zap } from "lucide-react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import { FeatureCard } from "./feature-card.js";

describe("FeatureCard", () => {
  it("renders an article with a heading and decorative icon", async () => {
    render(
      <FeatureCard
        icon={<Zap />}
        title="Performance"
        description="Fast by default."
        accent="purple"
      />,
    );
    expect(screen.getByRole("article")).toHaveAttribute("data-accent", "purple");
    expect(screen.getByRole("heading", { level: 3, name: "Performance" })).toBeInTheDocument();
    await expectNoA11yViolations();
  });

  it("steps up the title for the lg size", () => {
    render(<FeatureCard icon={<Zap />} title="Systems" description="Shared." featured size="lg" />);
    expect(screen.getByRole("heading", { name: "Systems" })).toHaveClass("text-display-lg");
    expect(screen.getByRole("article")).toHaveAttribute("data-size", "lg");
  });
});
