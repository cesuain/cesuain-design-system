import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";

import { Button } from "../button/button.js";
import { toast, Toaster } from "./toaster.js";

const meta = {
  title: "Components/Feedback/Toast",
  component: Toaster,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { position: "bottom-right", closeButton: false },
  argTypes: {
    position: {
      control: "select",
      options: [
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ],
    },
  },
  render: (args) => (
    <>
      <Toaster {...args} />
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => toast("Draft saved")}>
          Default
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast.success("Message sent", { description: "Thanks for reaching out." })}
        >
          Success
        </Button>
        <Button variant="secondary" onClick={() => toast.info("New version available")}>
          Info
        </Button>
        <Button variant="secondary" onClick={() => toast.warning("You are offline")}>
          Warning
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast.error("Could not send", { description: "Check your connection and try again." })
          }
        >
          Error
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast("Project archived", {
              action: { label: "Undo", onClick: () => toast("Restored") },
            })
          }
        >
          With action
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
              loading: "Exporting tokens…",
              success: "Export complete",
              error: "Export failed",
            })
          }
        >
          Promise
        </Button>
      </div>
    </>
  ),
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Success" }));
    await waitFor(() => expect(screen.getByText("Message sent")).toBeVisible());
  },
};

export const WithCloseButton: Story = { args: { closeButton: true, position: "top-center" } };
