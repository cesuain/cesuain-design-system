import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";

import { Progress } from "./progress.js";

const meta = {
  title: "Components/Feedback/Progress",
  component: Progress,
  tags: ["autodocs"],
  args: { value: 64, size: "md", tone: "default", "aria-label": "Profile completeness" },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    tone: { control: "inline-radio", options: ["default", "brand", "success"] },
  },
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Brand: Story = { args: { tone: "brand", size: "lg" } };
export const Success: Story = { args: { tone: "success", value: 100 } };
export const Indeterminate: Story = { args: { value: null, "aria-label": "Loading projects" } };

function LabelledDemo() {
  const [value, setValue] = useState(12);
  useEffect(() => {
    const id = setInterval(() => setValue((v) => (v >= 100 ? 12 : v + 11)), 900);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="grid gap-2">
      <div className="flex justify-between text-label-sm">
        <span id="export-label">Exporting tokens</span>
        <span className="text-muted-foreground tabular-nums">{Math.min(value, 100)}%</span>
      </div>
      <Progress aria-labelledby="export-label" value={Math.min(value, 100)} tone="brand" />
    </div>
  );
}

export const WithLabel: Story = { render: () => <LabelledDemo /> };
