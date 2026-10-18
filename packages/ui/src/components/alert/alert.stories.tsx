import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircleAlert, CircleCheck, Info, Sparkles, TriangleAlert, X } from "lucide-react";

import { IconButton } from "../icon-button/icon-button.js";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "./alert.js";

const meta = {
  title: "Components/Feedback/Alert",
  component: Alert,
  tags: ["autodocs"],
  args: { variant: "default" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "info", "success", "warning", "destructive"],
    },
  },
  decorators: [(Story) => <div className="w-[32rem]">{Story()}</div>],
  render: (args) => (
    <Alert {...args}>
      <Sparkles aria-hidden="true" />
      <AlertTitle>New in 1.0</AlertTitle>
      <AlertDescription>
        Tokens now export to Figma variables with light and dark modes.
      </AlertDescription>
    </Alert>
  ),
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: Story = {
  name: "All variants",
  render: () => (
    <div className="grid gap-3">
      <Alert variant="info">
        <Info aria-hidden="true" />
        <AlertTitle>Scheduled maintenance</AlertTitle>
        <AlertDescription>
          The docs site may be unavailable on Sunday for a few minutes.
        </AlertDescription>
      </Alert>
      <Alert variant="success">
        <CircleCheck aria-hidden="true" />
        <AlertTitle>Message sent</AlertTitle>
        <AlertDescription>Thanks for reaching out.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <TriangleAlert aria-hidden="true" />
        <AlertTitle>Deprecated token</AlertTitle>
        <AlertDescription>
          <code>--cds-color-glass</code> will be removed in 2.0. Use <code>--glass-from</code>.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <CircleAlert aria-hidden="true" />
        <AlertTitle>Build failed</AlertTitle>
        <AlertDescription>
          <p>Two contrast pairs fall below their minimum.</p>
          <a href="#">View the report</a>
        </AlertDescription>
      </Alert>
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Alert variant="info" role="note">
      <Info aria-hidden="true" />
      <AlertTitle>Theme follows your system</AlertTitle>
      <AlertDescription>Switch it at any time from the header.</AlertDescription>
      <AlertAction>
        <IconButton label="Dismiss" icon={<X />} size="sm" />
      </AlertAction>
    </Alert>
  ),
};

export const TitleOnly: Story = {
  render: () => (
    <Alert variant="success">
      <CircleCheck aria-hidden="true" />
      <AlertTitle>Saved</AlertTitle>
    </Alert>
  ),
};
