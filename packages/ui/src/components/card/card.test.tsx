import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card.js";

describe("Card", () => {
  it("renders a titled card with all slots", async () => {
    render(
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Hydrogen storefront</CardTitle>
          <CardDescription>Headless commerce rebuild.</CardDescription>
          <CardAction>
            <button type="button">Menu</button>
          </CardAction>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );
    expect(screen.getByRole("heading", { name: "Hydrogen storefront" })).toBeInTheDocument();
    expect(screen.getByText("Body").closest("[data-slot=card]")).toHaveAttribute(
      "data-variant",
      "glass",
    );
    await expectNoA11yViolations();
  });

  it("defaults to the surface variant", () => {
    render(<Card>Content</Card>);
    expect(screen.getByText("Content")).toHaveAttribute("data-variant", "surface");
    expect(screen.getByText("Content")).toHaveClass("surface");
  });
});
