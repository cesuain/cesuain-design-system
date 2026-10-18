import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion.js";

function Example() {
  return (
    <Accordion type="single" collapsible defaultValue="a">
      <AccordionItem value="a">
        <AccordionTrigger>What is a token?</AccordionTrigger>
        <AccordionContent>A named design decision.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes, it follows the WAI-ARIA pattern.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe("Accordion", () => {
  it("renders headings with expandable buttons", async () => {
    render(<Example />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(2);
    expect(screen.getByRole("button", { name: "What is a token?" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("region", { name: "What is a token?" })).toHaveTextContent(
      "A named design decision.",
    );
    await expectNoA11yViolations();
  });

  it("opens one item at a time in single mode", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Is it accessible?" }));
    expect(screen.getByRole("button", { name: "Is it accessible?" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("button", { name: "What is a token?" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});
