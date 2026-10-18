import type { Meta, StoryObj } from "@storybook/react-vite";

import { Container } from "../container/container.js";
import { SectionHeading } from "../section-heading/section-heading.js";
import { Section } from "./section.js";

const meta = {
  title: "Components/Layout/Section",
  component: Section,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { spacing: "lg", id: "work" },
  argTypes: { spacing: { control: "inline-radio", options: ["none", "sm", "md", "lg"] } },
  render: (args) => (
    <Section {...args} className="border-y border-dashed border-brand/30">
      <Container>
        <SectionHeading
          titleId={`${args.id}-title`}
          eyebrow="Selected work"
          title="Things I've"
          highlight="built"
          description="Sections use the section spacing tokens for vertical rhythm."
        />
      </Container>
    </Section>
  ),
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Large: Story = {};
export const Medium: Story = { args: { spacing: "md" } };
export const Small: Story = { args: { spacing: "sm" } };
