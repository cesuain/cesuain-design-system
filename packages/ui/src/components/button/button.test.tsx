import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import { Button } from "./button.js";

describe("Button", () => {
  it("renders a native button with default variant and size", async () => {
    render(<Button>Get started</Button>);
    const button = screen.getByRole("button", { name: "Get started" });
    expect(button.tagName).toBe("BUTTON");
    expect(button).toHaveAttribute("data-variant", "default");
    expect(button).toHaveAttribute("data-size", "md");
    expect(button).toHaveClass("bg-primary", "rounded-control");
    await expectNoA11yViolations();
  });

  it("calls onClick when activated with mouse or keyboard", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>Save</Button>);
    await user.click(screen.getByRole("button"));
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it("applies every variant", () => {
    const variants = [
      "default",
      "glow",
      "gradient",
      "secondary",
      "outline",
      "ghost",
      "destructive",
      "link",
    ] as const;
    for (const variant of variants) {
      render(<Button variant={variant}>{variant}</Button>);
      expect(screen.getByRole("button", { name: variant })).toHaveAttribute(
        "data-variant",
        variant,
      );
    }
  });

  it("does not fire when disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("shows a spinner, sets aria-busy and blocks clicks while loading", async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Sending
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Sending" });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toBeDisabled();
    expect(button.querySelector("[data-slot=spinner]")).toBeInTheDocument();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders its child element with asChild", () => {
    render(
      <Button asChild variant="outline">
        <a href="/docs">Read the docs</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Read the docs" });
    expect(link).toHaveAttribute("href", "/docs");
    expect(link).toHaveAttribute("data-slot", "button");
    expect(link).not.toHaveAttribute("disabled");
  });

  it("marks a disabled asChild link with aria-disabled", () => {
    render(
      <Button asChild disabled>
        <a href="/docs">Docs</a>
      </Button>,
    );
    expect(screen.getByRole("link")).toHaveAttribute("aria-disabled", "true");
  });

  it("merges custom class names, letting overrides win", () => {
    render(<Button className="rounded-none px-2">Square</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("rounded-none", "px-2");
    expect(button).not.toHaveClass("rounded-control");
  });
});
