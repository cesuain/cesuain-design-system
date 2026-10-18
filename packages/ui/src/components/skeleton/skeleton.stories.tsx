import type { Meta, StoryObj } from "@storybook/react-vite";

import { Skeleton } from "./skeleton.js";

const meta = {
  title: "Components/Feedback/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  args: { className: "h-4 w-48" },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ProjectCard: Story = {
  name: "Project card",
  render: () => (
    <div aria-busy="true" className="grid w-80 gap-4 rounded-card p-(--cds-card-padding) surface">
      <span className="sr-only" role="status">
        Loading project
      </span>
      <Skeleton className="aspect-video w-full rounded-item" />
      <Skeleton className="h-5 w-3/4" />
      <div className="grid gap-2">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-5/6" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  ),
};

export const Profile: Story = {
  render: () => (
    <div aria-busy="true" className="flex items-center gap-3">
      <span className="sr-only" role="status">
        Loading profile
      </span>
      <Skeleton className="size-12 rounded-full" />
      <div className="grid gap-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  ),
};
