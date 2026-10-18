import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion.js";

const faq = [
  {
    q: "Which frameworks does it support?",
    a: "Any React 19 app: Next.js, Vite, React Router or Hydrogen.",
  },
  {
    q: "Can I use only the tokens?",
    a: "Yes. @cesuain/tokens ships CSS variables, JSON and TypeScript with no React dependency.",
  },
  {
    q: "Is there a Figma library?",
    a: "Yes. Variables and components mirror the token names used in code.",
  },
];

// Accordion's props are a union keyed on `type`, which Storybook cannot express as args, so the
// meta is untyped and each story passes props directly. Autodocs still reads the prop table.
const meta = {
  title: "Components/Data Display/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  decorators: [(Story) => <div className="w-[32rem]">{Story()}</div>],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Single: Story = {
  render: () => (
    <Accordion type="single" collapsible>
      {faq.map((item, i) => (
        <AccordionItem key={item.q} value={`item-${i}`}>
          <AccordionTrigger>{item.q}</AccordionTrigger>
          <AccordionContent>{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: faq[1]!.q });
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
  },
};

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" defaultValue={["item-0", "item-2"]}>
      {faq.map((item, i) => (
        <AccordionItem key={item.q} value={`item-${i}`}>
          <AccordionTrigger>{item.q}</AccordionTrigger>
          <AccordionContent>{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};
