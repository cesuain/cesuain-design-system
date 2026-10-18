import type { Meta, StoryObj } from "@storybook/react-vite";

import { SegmentedControl, SegmentedControlItem } from "./segmented-control.js";

const meta = {
  title: "Components/Navigation/Segmented Control",
  component: SegmentedControl,
  tags: ["autodocs"],
  args: { "aria-label": "Language", size: "sm" },
  argTypes: { size: { control: "inline-radio", options: ["sm", "md"] } },
  render: (args) => (
    <SegmentedControl {...args}>
      <SegmentedControlItem href="#en" hrefLang="en" active>
        EN
      </SegmentedControlItem>
      <SegmentedControlItem href="#pt" hrefLang="pt-BR" title="Português (Brasil)">
        PT
      </SegmentedControlItem>
      <SegmentedControlItem href="#es" hrefLang="es" title="Español">
        ES
      </SegmentedControlItem>
    </SegmentedControl>
  ),
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {};
export const Medium: Story = {
  args: { size: "md", "aria-label": "Résumé variant" },
  render: (args) => (
    <SegmentedControl {...args}>
      <SegmentedControlItem href="#frontend" active>
        Frontend
      </SegmentedControlItem>
      <SegmentedControlItem href="#fullstack">Full stack</SegmentedControlItem>
      <SegmentedControlItem href="#shopify">Shopify</SegmentedControlItem>
    </SegmentedControl>
  ),
};
