import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import { TooltipProvider } from "../tooltip/tooltip.js";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "./sidebar.js";

function Shell(props: {
  collapsible?: "offcanvas" | "icon";
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}) {
  return (
    <TooltipProvider>
      <SidebarProvider open={props.open} onOpenChange={props.onOpenChange}>
        <Sidebar collapsible={props.collapsible}>
          <SidebarContent>
            <nav aria-label="Docs">
              <SidebarGroup>
                <SidebarGroupLabel>Components</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive tooltip="Button">
                      <a href="#button">Button</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Card">
                      <a href="#card">Card</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </nav>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <SidebarTrigger />
          Content
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}

const sidebarRoot = () => document.querySelector("[data-slot=sidebar]");

afterEach(() => {
  document.cookie = "sidebar_state=; max-age=0; path=/";
});

describe("Sidebar", () => {
  it("renders navigation with the current page marked", async () => {
    render(<Shell />);
    expect(screen.getByRole("navigation", { name: "Docs" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Button" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("main")).toHaveTextContent("Content");
    await expectNoA11yViolations();
  });

  it("collapses from the trigger and persists the state in a cookie", async () => {
    render(<Shell collapsible="icon" />);
    const trigger = screen.getByRole("button", { name: "Toggle sidebar" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(sidebarRoot()).toHaveAttribute("data-state", "expanded");
    await userEvent.click(trigger);
    expect(sidebarRoot()).toHaveAttribute("data-state", "collapsed");
    expect(sidebarRoot()).toHaveAttribute("data-collapsible", "icon");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(document.cookie).toContain("sidebar_state=false");
  });

  it("toggles with ⌘B", async () => {
    render(<Shell />);
    await userEvent.keyboard("{Meta>}b{/Meta}");
    expect(sidebarRoot()).toHaveAttribute("data-state", "collapsed");
  });

  it("can be controlled", async () => {
    const onOpenChange = vi.fn();
    render(<Shell open={false} onOpenChange={onOpenChange} />);
    expect(sidebarRoot()).toHaveAttribute("data-state", "collapsed");
    await userEvent.click(screen.getByRole("button", { name: "Toggle sidebar" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("renders in a dialog on small screens", async () => {
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      ...original(query),
      matches: true,
    })) as typeof window.matchMedia;
    try {
      render(<Shell />);
      expect(screen.queryByRole("navigation", { name: "Docs" })).not.toBeInTheDocument();
      await act(async () => {
        await userEvent.click(screen.getByRole("button", { name: "Toggle sidebar" }));
      });
      expect(await screen.findByRole("dialog", { name: "Navigation" })).toBeInTheDocument();
      expect(screen.getByRole("navigation", { name: "Docs" })).toBeInTheDocument();
    } finally {
      window.matchMedia = original;
    }
  });
});
