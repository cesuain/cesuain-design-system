import type { Meta, StoryObj } from "@storybook/react-vite";
import { Code2, Eye, Palette } from "lucide-react";
import { expect, userEvent, within } from "storybook/test";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs.js";

const meta = {
  title: "Components/Navigation/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  args: { defaultValue: "overview" },
  render: (args) => (
    <Tabs {...args} className="w-[28rem]">
      <TabsList aria-label="Project">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="stack">Stack</TabsTrigger>
        <TabsTrigger value="results">Results</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-muted-foreground">
        A headless commerce storefront rebuilt on Shopify Hydrogen.
      </TabsContent>
      <TabsContent value="stack" className="text-muted-foreground">
        React, TypeScript, Hydrogen, Tailwind CSS.
      </TabsContent>
      <TabsContent value="results" className="text-muted-foreground">
        Faster pages and a component library shared across brands.
      </TabsContent>
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pill: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("tab", { name: "Stack" }));
    await expect(canvas.getByRole("tabpanel")).toHaveTextContent("React, TypeScript");
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("tab", { name: "Results" })).toHaveFocus();
    await expect(canvas.getByRole("tabpanel")).toHaveTextContent("Faster pages");
  },
};

export const Line: Story = {
  render: (args) => (
    <Tabs {...args} className="w-[28rem]">
      <TabsList aria-label="Component" variant="line">
        <TabsTrigger value="overview">
          <Eye /> Preview
        </TabsTrigger>
        <TabsTrigger value="code">
          <Code2 /> Code
        </TabsTrigger>
        <TabsTrigger value="tokens">
          <Palette /> Tokens
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-muted-foreground">
        Live preview of the component.
      </TabsContent>
      <TabsContent value="code" className="text-muted-foreground">
        Usage snippet.
      </TabsContent>
      <TabsContent value="tokens" className="text-muted-foreground">
        Tokens consumed by the component.
      </TabsContent>
    </Tabs>
  ),
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <Tabs {...args} className="w-[32rem]">
      <TabsList aria-label="Settings" variant="line">
        <TabsTrigger value="overview">Profile</TabsTrigger>
        <TabsTrigger value="stack">Appearance</TabsTrigger>
        <TabsTrigger value="results" disabled>
          Billing
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-muted-foreground">
        Name, avatar and bio.
      </TabsContent>
      <TabsContent value="stack" className="text-muted-foreground">
        Theme and density.
      </TabsContent>
    </Tabs>
  ),
};
