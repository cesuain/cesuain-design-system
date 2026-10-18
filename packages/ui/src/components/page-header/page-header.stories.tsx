import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight } from "lucide-react";

import { Button } from "../button/button.js";
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderEyebrow,
  PageHeaderHighlight,
  PageHeaderTitle,
} from "./page-header.js";

const meta = {
  title: "Components/Layout/Page Header",
  component: PageHeader,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { align: "left" },
  argTypes: { align: { control: "inline-radio", options: ["left", "center"] } },
  render: (args) => (
    <PageHeader {...args}>
      <PageHeaderEyebrow>Cesuain Design System</PageHeaderEyebrow>
      <PageHeaderTitle>
        A unified foundation for <PageHeaderHighlight>product interfaces</PageHeaderHighlight>
      </PageHeaderTitle>
      <PageHeaderDescription>
        Design tokens, accessible React components and a matching Figma library, extracted from
        cesarfonseca.dev.
      </PageHeaderDescription>
      <PageHeaderActions>
        <Button variant="gradient" size="lg">
          Get started <ArrowRight />
        </Button>
        <Button variant="secondary" size="lg">
          Browse components
        </Button>
      </PageHeaderActions>
    </PageHeader>
  ),
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Left: Story = {};
export const Centered: Story = { args: { align: "center" } };
