import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import {
  EmptyState,
  EmptyStateContent,
  EmptyStateDescription,
  EmptyStateHeader,
  EmptyStateMedia,
  EmptyStateTitle,
} from "./empty-state.js";

describe("EmptyState", () => {
  it("renders a heading, description and actions with decorative media hidden", async () => {
    render(
      <EmptyState>
        <EmptyStateHeader>
          <EmptyStateMedia variant="icon">★</EmptyStateMedia>
          <EmptyStateTitle>No projects yet</EmptyStateTitle>
          <EmptyStateDescription>Create your first project to see it here.</EmptyStateDescription>
        </EmptyStateHeader>
        <EmptyStateContent>
          <button type="button">New project</button>
        </EmptyStateContent>
      </EmptyState>,
    );
    expect(screen.getByRole("heading", { level: 3, name: "No projects yet" })).toBeInTheDocument();
    expect(screen.getByText("★")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("button", { name: "New project" })).toBeInTheDocument();
    await expectNoA11yViolations();
  });
});
