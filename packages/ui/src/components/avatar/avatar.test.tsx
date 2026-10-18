import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "./avatar.js";

describe("Avatar", () => {
  it("shows the fallback until the image loads", async () => {
    render(
      <Avatar>
        <AvatarImage src="/missing.png" alt="Cesar Fonseca" />
        <AvatarFallback>CF</AvatarFallback>
      </Avatar>,
    );
    // jsdom never loads images, so Radix keeps rendering the fallback.
    expect(screen.getByText("CF")).toBeInTheDocument();
    await expectNoA11yViolations();
  });

  it("exposes its size and supports groups", () => {
    render(
      <AvatarGroup>
        <Avatar size="sm">
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <Avatar size="sm">
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
      </AvatarGroup>,
    );
    expect(screen.getByText("A").parentElement).toHaveAttribute("data-size", "sm");
  });
});
