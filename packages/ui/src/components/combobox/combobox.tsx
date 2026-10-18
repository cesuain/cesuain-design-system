"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import { useRef, type ComponentPropsWithRef } from "react";

import { floatingSurface, menuItem, menuLabel } from "../../lib/styles.js";
import { cn } from "../../lib/utils.js";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../input-group/input-group.js";

/**
 * Searchable select built on Base UI's Combobox, following shadcn/ui's current recipe.
 * Pass `items` and render them through `ComboboxList`'s render function; filtering,
 * keyboard navigation and ARIA (`role="combobox"`, `aria-activedescendant`) are handled for you.
 */
export const Combobox = ComboboxPrimitive.Root;

export function ComboboxValue(props: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />;
}

export function ComboboxTrigger({
  className,
  children,
  ...props
}: ComboboxPrimitive.Trigger.Props) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn("[&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    >
      {children}
      <ChevronDownIcon className="pointer-events-none text-muted-foreground" />
    </ComboboxPrimitive.Trigger>
  );
}

export function ComboboxClear({ className, ...props }: ComboboxPrimitive.Clear.Props) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      aria-label="Clear selection"
      render={<InputGroupButton variant="ghost" size="icon-sm" />}
      className={className}
      {...props}
    >
      <XIcon className="pointer-events-none" />
    </ComboboxPrimitive.Clear>
  );
}

export type ComboboxInputProps = ComboboxPrimitive.Input.Props & {
  /** Show the chevron button that opens the list. */
  showTrigger?: boolean;
  /** Show a button that clears the current value. */
  showClear?: boolean;
};

export function ComboboxInput({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  ...props
}: ComboboxInputProps) {
  return (
    <InputGroup className={cn("w-full", className)}>
      <ComboboxPrimitive.Input render={<InputGroupInput disabled={disabled} />} {...props} />
      <InputGroupAddon align="inline-end">
        {showTrigger ? (
          <InputGroupButton
            size="icon-sm"
            variant="ghost"
            asChild
            className="group-has-data-[slot=combobox-clear]/input-group:hidden"
            disabled={disabled}
          >
            <ComboboxTrigger aria-label="Show options" />
          </InputGroupButton>
        ) : null}
        {showClear ? <ComboboxClear disabled={disabled} /> : null}
      </InputGroupAddon>
      {children}
    </InputGroup>
  );
}

export type ComboboxContentProps = ComboboxPrimitive.Popup.Props &
  Pick<
    ComboboxPrimitive.Positioner.Props,
    "side" | "align" | "sideOffset" | "alignOffset" | "anchor"
  >;

export function ComboboxContent({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  anchor,
  ...props
}: ComboboxContentProps) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="isolate z-(--cds-z-index-popover)"
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          className={cn(
            floatingSurface,
            "group/combobox-content relative max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) overflow-hidden",
            className,
          )}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

/** The listbox of options. Give it an `aria-label` (usually the field's label) so it has a name. */
export function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn(
        "no-scrollbar max-h-72 scroll-py-1.5 overflow-y-auto overscroll-contain p-(--cds-menu-padding) data-empty:p-0",
        className,
      )}
      {...props}
    />
  );
}

export function ComboboxItem({ className, children, ...props }: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(menuItem, "w-full pr-9", className)}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute right-3 flex size-4 items-center justify-center" />
        }
      >
        <CheckIcon className="text-brand" />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  );
}

export function ComboboxGroup(props: ComboboxPrimitive.Group.Props) {
  return <ComboboxPrimitive.Group data-slot="combobox-group" {...props} />;
}

export function ComboboxLabel({ className, ...props }: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-label"
      className={cn(menuLabel, className)}
      {...props}
    />
  );
}

export function ComboboxCollection(props: ComboboxPrimitive.Collection.Props) {
  return <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />;
}

export function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        "hidden w-full justify-center py-6 text-center text-body-sm text-muted-foreground group-data-empty/combobox-content:flex",
        className,
      )}
      {...props}
    />
  );
}

export function ComboboxSeparator({ className, ...props }: ComboboxPrimitive.Separator.Props) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className={cn("-mx-1.5 my-1.5 h-px bg-border", className)}
      {...props}
    />
  );
}

/** Container for multi-select chips plus the chips input. */
export function ComboboxChips({
  className,
  ...props
}: ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> & ComboboxPrimitive.Chips.Props) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      className={cn(
        "flex min-h-(--cds-control-height-md) flex-wrap items-center gap-1.5 rounded-field border border-input bg-surface-from px-3 py-1.5 text-body-md",
        "transition-[border-color,box-shadow] duration-(--cds-duration-base) ease-standard",
        "focus-within:border-ring focus-within:ring-4 focus-within:ring-ring/20 has-aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export type ComboboxChipProps = ComboboxPrimitive.Chip.Props & { showRemove?: boolean };

export function ComboboxChip({
  className,
  children,
  showRemove = true,
  ...props
}: ComboboxChipProps) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        "flex h-7 w-fit items-center justify-center gap-1 rounded-control border border-border bg-muted pl-3 text-label-xs whitespace-nowrap text-foreground",
        showRemove ? "pr-1" : "pr-3",
        className,
      )}
      {...props}
    >
      {children}
      {showRemove ? (
        <ComboboxPrimitive.ChipRemove
          aria-label="Remove"
          data-slot="combobox-chip-remove"
          className="grid size-5 place-items-center rounded-full text-muted-foreground focus-ring transition-colors hover:bg-accent hover:text-foreground"
        >
          <XIcon className="pointer-events-none size-3" />
        </ComboboxPrimitive.ChipRemove>
      ) : null}
    </ComboboxPrimitive.Chip>
  );
}

export function ComboboxChipsInput({ className, ...props }: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chip-input"
      className={cn(
        "min-w-16 flex-1 bg-transparent outline-none placeholder:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

/** Ref for anchoring the popup to the chips container in multi-select mode. */
export function useComboboxAnchor() {
  return useRef<HTMLDivElement | null>(null);
}
