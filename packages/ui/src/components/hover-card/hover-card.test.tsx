import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card.js";

describe("HoverCard", () => {
  it("previews content when the trigger receives focus", async () => {
    const user = userEvent.setup();
    render(
      <HoverCard openDelay={0}>
        <HoverCardTrigger href="https://github.com">@cesuain</HoverCardTrigger>
        <HoverCardContent>Design systems and commerce front ends.</HoverCardContent>
      </HoverCard>,
    );
    expect(screen.getByRole("link", { name: "@cesuain" })).toBeInTheDocument();
    await user.tab();
    expect(await screen.findByText("Design systems and commerce front ends.")).toBeInTheDocument();
  });
});
