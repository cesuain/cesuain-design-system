import { render, screen } from "@testing-library/react";
import { CircleCheck } from "lucide-react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "./alert.js";

describe("Alert", () => {
  it("announces errors and warnings assertively", async () => {
    render(
      <Alert variant="destructive">
        <AlertTitle>Build failed</AlertTitle>
        <AlertDescription>2 contrast pairs are below 4.5:1.</AlertDescription>
      </Alert>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Build failed");
    await expectNoA11yViolations();
  });

  it("announces other variants politely", () => {
    render(
      <Alert variant="success">
        <CircleCheck aria-hidden="true" />
        <AlertTitle>Tokens published</AlertTitle>
      </Alert>,
    );
    expect(screen.getByRole("status")).toHaveAttribute("data-variant", "success");
  });

  it("lets callers override the role and add actions", () => {
    render(
      <Alert role="note">
        <AlertTitle>Heads up</AlertTitle>
        <AlertAction>
          <button type="button">Dismiss</button>
        </AlertAction>
      </Alert>,
    );
    expect(screen.getByRole("note")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
  });
});
