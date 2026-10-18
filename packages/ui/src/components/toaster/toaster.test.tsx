import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { toast, Toaster } from "./toaster.js";

describe("Toaster", () => {
  it("renders toasts in a labelled live region", async () => {
    render(<Toaster />);
    act(() => {
      toast.success("Tokens exported", { description: "12 files written." });
    });
    expect(await screen.findByText("Tokens exported")).toBeInTheDocument();
    expect(screen.getByText("12 files written.")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /Notifications/ })).toBeInTheDocument();
  });

  it("renders action buttons", async () => {
    render(<Toaster />);
    act(() => {
      toast("Token deleted", { action: { label: "Undo", onClick: () => {} } });
    });
    expect(await screen.findByRole("button", { name: "Undo" })).toBeInTheDocument();
  });
});
