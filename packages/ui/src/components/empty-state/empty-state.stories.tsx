import type { Meta, StoryObj } from "@storybook/react-vite";
import { FolderOpen, SearchX } from "lucide-react";

import { Button } from "../button/button.js";
import { Link } from "../link/link.js";
import {
  EmptyState,
  EmptyStateContent,
  EmptyStateDescription,
  EmptyStateHeader,
  EmptyStateMedia,
  EmptyStateTitle,
} from "./empty-state.js";

const meta = {
  title: "Components/Feedback/Empty State",
  component: EmptyState,
  tags: ["autodocs"],
  decorators: [(Story) => <div className="w-[36rem]">{Story()}</div>],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstRun: Story = {
  name: "First run",
  render: () => (
    <EmptyState>
      <EmptyStateHeader>
        <EmptyStateMedia variant="icon">
          <FolderOpen />
        </EmptyStateMedia>
        <EmptyStateTitle>No projects yet</EmptyStateTitle>
        <EmptyStateDescription>
          Add a case study to show it on your portfolio.
        </EmptyStateDescription>
      </EmptyStateHeader>
      <EmptyStateContent>
        <Button variant="gradient">New project</Button>
        <Button variant="ghost">Import from GitHub</Button>
      </EmptyStateContent>
    </EmptyState>
  ),
};

export const NoResults: Story = {
  name: "No results",
  render: () => (
    <EmptyState className="border-none">
      <EmptyStateHeader>
        <EmptyStateMedia variant="icon">
          <SearchX />
        </EmptyStateMedia>
        <EmptyStateTitle>No components match “carousel”</EmptyStateTitle>
        <EmptyStateDescription>
          Try a different search, or <Link href="#">request a component</Link>.
        </EmptyStateDescription>
      </EmptyStateHeader>
    </EmptyState>
  ),
};
