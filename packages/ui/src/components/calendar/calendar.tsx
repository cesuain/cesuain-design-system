"use client";

import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useRef, type ComponentProps } from "react";
import { DayPicker, getDefaultClassNames, type DayButton, type Locale } from "react-day-picker";

import { cn } from "../../lib/utils.js";
import { Button } from "../button/button.js";
import { buttonVariants, type ButtonVariantProps } from "../button/button.variants.js";

export type CalendarProps = ComponentProps<typeof DayPicker> & {
  /** Variant of the previous/next month buttons. */
  buttonVariant?: ButtonVariantProps["variant"];
};

/**
 * Month grid for picking a date or range, built on react-day-picker. Fully keyboard operable
 * (arrows, PageUp/PageDown, Home/End). Pass `locale` from `date-fns/locale` to localise.
 */
/**
 * Accessible name for a day button: "Thursday, May 14, 2026", with "Today" and "selected" when
 * they apply. react-day-picker's default ("May 14th") does not contain the visible "14" as a
 * whole word, which fails WCAG 2.5.3 Label in Name for speech-input users.
 */
function dayLabel(locale: Partial<Locale> | undefined) {
  return (date: Date, modifiers?: { today?: boolean; selected?: boolean }) => {
    const label = date.toLocaleDateString(locale?.code, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return `${modifiers?.today ? "Today, " : ""}${label}${modifiers?.selected ? ", selected" : ""}`;
  };
}

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  labels,
  ...props
}: CalendarProps) {
  const defaults = getDefaultClassNames();
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar p-3 [--cell-radius:var(--cds-radius-item)] [--cell-size:--spacing(9)]",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      captionLayout={captionLayout}
      locale={locale}
      labels={{ labelDayButton: dayLabel(locale), ...labels }}
      formatters={{
        formatMonthDropdown: (date) => date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaults.root),
        months: cn("relative flex flex-col gap-4 md:flex-row", defaults.months),
        month: cn("flex w-full flex-col gap-4", defaults.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaults.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
          defaults.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
          defaults.button_next,
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaults.month_caption,
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-label-sm",
          defaults.dropdowns,
        ),
        dropdown_root: cn(
          "relative rounded-(--cell-radius) border border-input has-focus:border-ring has-focus:ring-4 has-focus:ring-ring/20",
          defaults.dropdown_root,
        ),
        dropdown: cn("absolute inset-0 bg-popover opacity-0", defaults.dropdown),
        caption_label: cn(
          "text-label-md select-none",
          captionLayout !== "label" &&
            "flex h-8 items-center gap-1 rounded-(--cell-radius) pr-1 pl-2 text-label-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
          defaults.caption_label,
        ),
        month_grid: cn("w-full border-collapse", defaults.month_grid),
        weekdays: cn("flex", defaults.weekdays),
        weekday: cn(
          "flex-1 font-eyebrow text-caption text-muted-foreground select-none",
          defaults.weekday,
        ),
        week: cn("mt-1.5 flex w-full", defaults.week),
        week_number_header: cn("w-(--cell-size) select-none", defaults.week_number_header),
        week_number: cn("text-caption text-muted-foreground select-none", defaults.week_number),
        day: cn(
          "group/day relative aspect-square size-full p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)"
            : "[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)",
          defaults.day,
        ),
        range_start: cn(
          "relative isolate z-0 rounded-l-(--cell-radius) bg-accent after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-accent",
          defaults.range_start,
        ),
        range_middle: cn("rounded-none", defaults.range_middle),
        range_end: cn(
          "relative isolate z-0 rounded-r-(--cell-radius) bg-accent after:absolute after:inset-y-0 after:left-0 after:w-4 after:bg-accent",
          defaults.range_end,
        ),
        today: cn(
          "rounded-(--cell-radius) text-brand data-[selected=true]:rounded-none [&_button]:font-semibold",
          defaults.today,
        ),
        outside: cn(
          "text-muted-foreground/60 aria-selected:text-muted-foreground",
          defaults.outside,
        ),
        disabled: cn("text-muted-foreground opacity-40", defaults.disabled),
        hidden: cn("invisible", defaults.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className: rootClassName, rootRef, ...rootProps }) => (
          <div data-slot="calendar" ref={rootRef} className={rootClassName} {...rootProps} />
        ),
        Chevron: ({ className: chevronClassName, orientation, ...chevronProps }) => {
          const Icon =
            orientation === "left"
              ? ChevronLeftIcon
              : orientation === "right"
                ? ChevronRightIcon
                : ChevronDownIcon;
          return <Icon className={cn("size-4", chevronClassName)} {...chevronProps} />;
        },
        DayButton: (dayProps) => <CalendarDayButton locale={locale} {...dayProps} />,
        WeekNumber: ({ children, ...weekProps }) => (
          <td {...weekProps}>
            <div className="flex size-(--cell-size) items-center justify-center text-center">
              {children}
            </div>
          </td>
        ),
        ...components,
      }}
      {...props}
    />
  );
}

export function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaults = getDefaultClassNames();
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 rounded-(--cell-radius) border-0 text-body-sm leading-none font-normal text-foreground",
        "hover:bg-accent hover:text-accent-foreground",
        "group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10",
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[selected-single=true]:shadow-glow-brand",
        "data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground",
        "data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground",
        "data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground",
        "[&>span]:text-caption [&>span]:opacity-70",
        defaults.day,
        className,
      )}
      {...props}
    />
  );
}
