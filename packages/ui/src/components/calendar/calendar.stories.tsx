import type { Meta, StoryObj } from "@storybook/react-vite";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { Calendar } from "./calendar.js";

const meta = {
  title: "Components/Data Display/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  decorators: [
    (Story) => <div className="rounded-overlay border border-border bg-popover">{Story()}</div>,
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const month = new Date(2026, 4, 1);

function SingleDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 4, 14));
  return <Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={month} />;
}

function RangeDemo() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2026, 4, 11),
    to: new Date(2026, 4, 16),
  });
  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={setRange}
      defaultMonth={month}
      numberOfMonths={2}
    />
  );
}

export const Single: Story = { render: () => <SingleDemo /> };
export const Range: Story = { render: () => <RangeDemo /> };
export const DropdownCaption: Story = {
  name: "Month and year dropdowns",
  render: () => (
    <Calendar
      mode="single"
      captionLayout="dropdown"
      defaultMonth={month}
      startMonth={new Date(2020, 0)}
      endMonth={new Date(2030, 11)}
    />
  ),
};
export const DisabledPast: Story = {
  name: "Disabled days",
  render: () => (
    <Calendar mode="single" defaultMonth={month} disabled={{ before: new Date(2026, 4, 10) }} />
  ),
};
export const Localised: Story = {
  name: "Localised (pt-BR)",
  render: () => <Calendar mode="single" defaultMonth={month} locale={ptBR} />,
};
