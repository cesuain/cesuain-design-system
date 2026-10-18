"use client";

import { Slider as SliderPrimitive } from "radix-ui";
import { useMemo, type ComponentProps } from "react";

import { cn } from "../../lib/utils.js";

export type SliderProps = ComponentProps<typeof SliderPrimitive.Root> & {
  /**
   * Accessible names for each thumb, e.g. `["Minimum price", "Maximum price"]` for a range.
   * Defaults to the slider's own `aria-label`.
   */
  thumbLabels?: string[];
};

/** Select a value (or range) along a track. Arrow, Page and Home/End keys adjust the value. */
export function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  thumbLabels,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: SliderProps) {
  const values = useMemo(
    () => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min]),
    [value, defaultValue, min],
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-disabled:opacity-50",
        "data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative grow overflow-hidden rounded-full bg-muted data-horizontal:h-1.5 data-horizontal:w-full data-vertical:h-full data-vertical:w-1.5"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute bg-brand data-horizontal:h-full data-vertical:w-full"
        />
      </SliderPrimitive.Track>
      {values.map((_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          aria-label={thumbLabels?.[index] ?? ariaLabel}
          aria-labelledby={thumbLabels?.[index] ? undefined : ariaLabelledBy}
          className={cn(
            "block size-[18px] shrink-0 rounded-full border-2 border-brand bg-background shadow-elevation-sm focus-ring",
            "transition-[box-shadow,transform] duration-(--cds-duration-fast) ease-standard hover:scale-110",
            "data-disabled:pointer-events-none",
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}
