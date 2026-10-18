"use client";

import { format as formatDate } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { Locale } from "react-day-picker";

import { controlHeight, fieldControl } from "../../lib/styles.js";
import { cn } from "../../lib/utils.js";
import { Calendar, type CalendarProps } from "../calendar/calendar.js";
import { Popover, PopoverContent, PopoverTrigger } from "../popover/popover.js";

export type DatePickerProps = {
  /** Selected date (controlled). */
  value?: Date;
  /** Initial date (uncontrolled). */
  defaultValue?: Date;
  onValueChange?: (date: Date | undefined) => void;
  placeholder?: ReactNode;
  /** `date-fns` format string for the trigger label. Defaults to the locale's long date (`PPP`). */
  format?: string;
  locale?: Locale;
  disabled?: boolean;
  /** Dates the user cannot pick, e.g. `{ before: new Date() }`. */
  disabledDays?: CalendarProps["disabled"];
  size?: keyof typeof controlHeight;
  id?: string;
  name?: string;
  className?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  "aria-label"?: string;
};

/**
 * A field that opens a calendar in a popover. Associate a `Label` through `id`. When `name` is
 * set, the selected date is submitted with the form as an ISO date string (`yyyy-MM-dd`).
 */
export function DatePicker({
  value,
  defaultValue,
  onValueChange,
  placeholder = "Pick a date",
  format = "PPP",
  locale,
  disabled,
  disabledDays,
  size = "md",
  id,
  name,
  className,
  ...aria
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState<Date | undefined>(defaultValue);
  const selected = value ?? internal;

  function select(date: Date | undefined) {
    if (value === undefined) setInternal(date);
    onValueChange?.(date);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <button
          type="button"
          id={id}
          data-slot="date-picker-trigger"
          data-empty={!selected || undefined}
          className={cn(
            fieldControl,
            controlHeight[size],
            "flex items-center gap-2 px-(--cds-field-padding-x) text-left data-empty:text-muted-foreground",
            "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
            className,
          )}
          {...aria}
        >
          <CalendarIcon aria-hidden="true" />
          <span className="truncate">
            {selected ? formatDate(selected, format, { locale }) : placeholder}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={select}
          defaultMonth={selected}
          disabled={disabledDays}
          locale={locale}
          autoFocus
        />
      </PopoverContent>
      {name ? (
        <input
          type="hidden"
          name={name}
          value={selected ? formatDate(selected, "yyyy-MM-dd") : ""}
        />
      ) : null}
    </Popover>
  );
}
