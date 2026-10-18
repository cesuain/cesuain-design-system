import { Button } from "@cesuain/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

import { Code, DocPage, DocSection, DocTable, tokenColumns } from "./doc-blocks.js";
import { tokensUnder } from "./tokens.js";

const meta = {
  title: "Foundations/Motion",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const durations = tokensUnder("duration");
const easings = tokensUnder("easing");

function MotionPlayground() {
  const [moved, setMoved] = useState(false);
  return (
    <div className="grid gap-4">
      <Button variant="outline" className="w-fit" onClick={() => setMoved((value) => !value)}>
        {moved ? "Reset" : "Play"} transitions
      </Button>
      <ul className="grid gap-3">
        {easings.map((easing) => (
          <li key={easing.name} className="grid gap-1.5">
            <span className="font-mono text-caption text-muted-foreground">
              {easing.name} · duration.moderate
            </span>
            <div className="relative h-8 rounded-full bg-muted">
              <span
                aria-hidden="true"
                className="absolute top-1 left-1 size-6 rounded-full bg-brand transition-[left] duration-(--cds-duration-moderate)"
                style={{
                  transitionTimingFunction: `var(${easing.cssVar})`,
                  left: moved ? "calc(100% - 1.75rem)" : "0.25rem",
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const Tokens: Story = {
  name: "Motion",
  render: () => (
    <DocPage
      eyebrow="Foundations"
      title="Motion"
      lead={
        <p>
          Motion confirms cause and effect; it never decorates. Interface feedback uses{" "}
          <Code>duration.fast</Code> to <Code>duration.moderate</Code> with the{" "}
          <Code>ease-standard</Code> curve. Every component honours{" "}
          <Code>prefers-reduced-motion</Code>: the base stylesheet shortens all animations and
          transitions to near zero, keeping state changes instant but intact.
        </p>
      }
    >
      <DocSection
        title="Easing playground"
        description="Compare the curves at the same duration. With reduced motion enabled the dots jump straight to their end position."
      >
        <MotionPlayground />
      </DocSection>
      <DocSection title="Durations">
        <DocTable
          caption="Duration tokens"
          rows={durations}
          rowKey={(token) => token.name}
          columns={tokenColumns()}
        />
      </DocSection>
      <DocSection title="Easing curves">
        <DocTable
          caption="Easing tokens"
          rows={easings}
          rowKey={(token) => token.name}
          columns={tokenColumns()}
        />
      </DocSection>
    </DocPage>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Play transitions" }));
    await expect(canvas.getByRole("button", { name: "Reset transitions" })).toBeVisible();
  },
};
