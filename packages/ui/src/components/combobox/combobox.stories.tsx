import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, within } from "storybook/test";

import { Label } from "../label/label.js";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "./combobox.js";

const technologies = [
  "React",
  "Next.js",
  "Shopify Hydrogen",
  "TypeScript",
  "Tailwind CSS",
  "GraphQL",
  "Node.js",
];

const meta = {
  title: "Components/Forms/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="cb-tech">Primary technology</Label>
      <Combobox items={technologies}>
        <ComboboxInput id="cb-tech" placeholder="Search technologies…" />
        <ComboboxContent>
          <ComboboxEmpty>No technology found.</ComboboxEmpty>
          <ComboboxList aria-label="Technologies">
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("combobox", { name: "Primary technology" });
    await userEvent.type(input, "type");
    await userEvent.click(await screen.findByRole("option", { name: "TypeScript" }));
    await expect(input).toHaveValue("TypeScript");
  },
};

export const WithClear: Story = {
  render: () => (
    <Combobox items={technologies} defaultValue="React">
      <ComboboxInput aria-label="Technology" showClear />
      <ComboboxContent>
        <ComboboxList aria-label="Technologies">
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
};

const grouped = [
  { value: "Frontend", items: ["React", "Next.js", "Tailwind CSS"] },
  { value: "Commerce", items: ["Shopify Hydrogen", "Liquid"] },
];

export const Grouped: Story = {
  render: () => (
    <Combobox items={grouped}>
      <ComboboxInput aria-label="Skill" placeholder="Search skills…" />
      <ComboboxContent>
        <ComboboxEmpty>No skill found.</ComboboxEmpty>
        <ComboboxList aria-label="Skills">
          {(group: (typeof grouped)[number]) => (
            <ComboboxGroup key={group.value} items={group.items}>
              <ComboboxLabel>{group.value}</ComboboxLabel>
              {group.items.map((item) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              ))}
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
};

function MultipleDemo() {
  const anchor = useComboboxAnchor();
  return (
    <Combobox items={technologies} multiple defaultValue={["React", "TypeScript"]}>
      <ComboboxChips ref={anchor}>
        <ComboboxValue>
          {(values: string[]) => (
            <>
              {values.map((value) => (
                <ComboboxChip key={value}>{value}</ComboboxChip>
              ))}
              <ComboboxChipsInput
                aria-label="Technologies"
                placeholder={values.length ? "" : "Add…"}
              />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No technology found.</ComboboxEmpty>
        <ComboboxList aria-label="Technologies">
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

export const Multiple: Story = { render: () => <MultipleDemo /> };

export const Disabled: Story = {
  render: () => (
    <Combobox items={technologies} disabled>
      <ComboboxInput aria-label="Technology" placeholder="Unavailable" disabled />
    </Combobox>
  ),
};
