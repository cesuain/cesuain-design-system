import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs.js";

function Example({ variant }: { variant?: "pill" | "line" }) {
  return (
    <Tabs defaultValue="code">
      <TabsList aria-label="Example" variant={variant}>
        <TabsTrigger value="code">Code</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="tokens" disabled>
          Tokens
        </TabsTrigger>
      </TabsList>
      <TabsContent value="code">Source code</TabsContent>
      <TabsContent value="preview">Rendered preview</TabsContent>
      <TabsContent value="tokens">Token list</TabsContent>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("links tabs to their panels", async () => {
    render(<Example />);
    const tab = screen.getByRole("tab", { name: "Code" });
    expect(tab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel", { name: "Code" })).toHaveTextContent("Source code");
    await expectNoA11yViolations();
  });

  it("switches panels on click", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("tab", { name: "Preview" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Rendered preview");
  });

  it("moves with arrow keys and skips disabled tabs", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("tab", { name: "Code" }));
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Preview" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Code" })).toHaveFocus();
  });

  it("exposes the visual variant", () => {
    render(<Example variant="line" />);
    expect(screen.getByRole("tablist")).toHaveAttribute("data-variant", "line");
  });
});
