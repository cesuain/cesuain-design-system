import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronsUpDown } from "lucide-react";
import { expect, userEvent, within } from "storybook/test";

import { Badge } from "../badge/badge.js";
import { IconButton } from "../icon-button/icon-button.js";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible.js";

const meta = {
  title: "Components/Data Display/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Collapsible className="grid w-80 gap-2">
      <div className="flex items-center justify-between gap-4">
        <h4 className="text-label-md">Tech stack (6)</h4>
        <CollapsibleTrigger asChild>
          <IconButton label="Toggle tech stack" icon={<ChevronsUpDown />} size="sm" />
        </CollapsibleTrigger>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge size="sm">React</Badge>
        <Badge size="sm">TypeScript</Badge>
      </div>
      <CollapsibleContent>
        <div className="flex flex-wrap gap-2 pt-1">
          <Badge size="sm">Hydrogen</Badge>
          <Badge size="sm">Tailwind CSS</Badge>
          <Badge size="sm">GraphQL</Badge>
          <Badge size="sm">Node.js</Badge>
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Toggle tech stack" }));
    await expect(canvas.getByText("GraphQL")).toBeVisible();
  },
};
