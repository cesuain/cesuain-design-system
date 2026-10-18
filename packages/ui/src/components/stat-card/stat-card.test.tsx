import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatCard } from "./stat-card.js";

describe("StatCard", () => {
  it("reads value before label", () => {
    render(<StatCard value="40%" label="Faster page loads" description="After the rebuild." />);
    const card = screen.getByText("40%").closest("[data-slot=stat-card]");
    expect(card?.textContent).toBe("40%Faster page loadsAfter the rebuild.");
  });

  it("uses the larger display size when size is lg", () => {
    render(<StatCard value="7+" label="Years" size="lg" />);
    const value = screen.getByText("7+").parentElement;
    expect(value).toHaveClass("text-display-lg");
    expect(value).not.toHaveClass("text-display-md");
  });
});
