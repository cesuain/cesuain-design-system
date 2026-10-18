import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer.js";

describe("Drawer", () => {
  it("opens a labelled dialog and closes from the footer", async () => {
    const user = userEvent.setup();
    render(
      <Drawer>
        <DrawerTrigger>Share</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Share project</DrawerTitle>
            <DrawerDescription>Send a link to this case study.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose>Done</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>,
    );
    await user.click(screen.getByRole("button", { name: "Share" }));
    const drawer = await screen.findByRole("dialog", { name: "Share project" });
    expect(drawer).toHaveAccessibleDescription("Send a link to this case study.");
    await expectNoA11yViolations();
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(screen.getByRole("button", { name: "Share" })).toHaveAttribute("aria-expanded", "false");
  });
});
