import type { Meta, StoryObj } from "@storybook/react-vite";

import { ContentWrapper } from "./content-wrapper.js";

const meta = {
  title: "Components/Layout/Content Wrapper",
  component: ContentWrapper,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof ContentWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CaseStudy: Story = {
  name: "Case study",
  render: () => (
    <ContentWrapper asChild>
      <article>
        <p>
          This example shows how long-form content reads inside the wrapper:{" "}
          <strong>headings</strong>, paragraphs, <a href="#">links</a>, lists, quotes and{" "}
          <code>inline code</code> all use design tokens.
        </p>
        <h2>The problem</h2>
        <p>
          Every brand shipped its own buttons, colors and spacing, so the same fix had to be made
          three times.
        </p>
        <ul>
          <li>Three diverging component libraries</li>
          <li>No shared tokens between design and code</li>
          <li>Inconsistent focus and contrast handling</li>
        </ul>
        <h3>The approach</h3>
        <ol>
          <li>Extract primitives from the existing site</li>
          <li>Map them to semantic tokens per theme</li>
          <li>Rebuild components on Radix primitives</li>
        </ol>
        <blockquote>
          A design system is a product whose users are designers and engineers.
        </blockquote>
        <pre>
          <code>{`import { Button } from "@cesuain/ui";`}</code>
        </pre>
      </article>
    </ContentWrapper>
  ),
};
