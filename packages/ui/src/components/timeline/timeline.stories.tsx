import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "../badge/badge.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card/card.js";
import { Timeline, TimelineItem } from "./timeline.js";

const roles = [
  {
    period: "2024 — Present",
    title: "Senior Frontend Engineer",
    org: "Example Commerce Co.",
    stack: ["Hydrogen", "React"],
    current: true,
  },
  {
    period: "2021 — 2024",
    title: "Frontend Engineer",
    org: "Example Agency",
    stack: ["Next.js", "TypeScript"],
  },
  {
    period: "2018 — 2021",
    title: "Web Developer",
    org: "Example Studio",
    stack: ["Shopify", "Sass"],
  },
];

const meta = {
  title: "Patterns/Timeline",
  component: Timeline,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Experience: Story = {
  render: () => (
    <Timeline aria-label="Experience">
      {roles.map((role, i) => (
        <TimelineItem key={role.period} period={role.period} current={role.current} index={i + 1}>
          <Card>
            <CardHeader>
              <CardTitle>{role.title}</CardTitle>
              <CardDescription>{role.org}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {role.stack.map((tech) => (
                <Badge key={tech} size="sm">
                  {tech}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </TimelineItem>
      ))}
    </Timeline>
  ),
};
