import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarDays } from "lucide-react";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";

import { Link } from "../link/link.js";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card.js";

const meta = {
  title: "Components/Overlays/Hover Card",
  component: HoverCard,
  tags: ["autodocs"],
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <p className="text-body-md text-muted-foreground">
      Built and maintained by{" "}
      <HoverCard openDelay={150}>
        <HoverCardTrigger asChild>
          <Link href="#">@cesuain</Link>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="flex gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-gradient font-display text-heading-sm text-gradient-foreground">
              C
            </span>
            <div className="grid gap-1">
              <p className="text-label-md text-foreground">Cesar Fonseca</p>
              <p className="text-body-sm text-muted-foreground">
                Design systems and commerce front ends.
              </p>
              <p className="flex items-center gap-1.5 text-caption text-muted-foreground">
                <CalendarDays className="size-3.5" aria-hidden="true" /> Example profile preview
              </p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
      .
    </p>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.hover(within(canvasElement).getByRole("link", { name: "@cesuain" }));
    await waitFor(() => expect(screen.getByText("Cesar Fonseca")).toBeVisible());
  },
};
