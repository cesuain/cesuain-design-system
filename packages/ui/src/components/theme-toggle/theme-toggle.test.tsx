import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ThemeToggle } from "./theme-toggle.js";

afterEach(() => {
  delete document.documentElement.dataset.theme;
  document.documentElement.className = "";
  localStorage.clear();
});

describe("ThemeToggle", () => {
  it("names the action and toggles the document theme", async () => {
    render(<ThemeToggle />);
    await userEvent.click(screen.getByRole("button", { name: "Switch to light theme" }));
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem("theme")).toBe("light");
    expect(await screen.findByRole("button", { name: "Switch to dark theme" })).toBeInTheDocument();
  });

  it("works as a controlled component", async () => {
    const onThemeChange = vi.fn();
    render(<ThemeToggle theme="light" onThemeChange={onThemeChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Switch to dark theme" }));
    expect(onThemeChange).toHaveBeenCalledWith("dark");
    expect(document.documentElement.dataset.theme).toBeUndefined();
  });
});
