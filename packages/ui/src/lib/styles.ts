/**
 * Shared class recipes. Several components draw the same element (a text field, a floating
 * surface, a menu row); keeping the recipe here guarantees they stay visually identical.
 * Every value resolves to a design token through the Tailwind theme bridge.
 */

/** Text-entry control: Input, Textarea, Select trigger, Combobox input and Input Group. */
export const fieldControl = [
  "w-full min-w-0 rounded-field border border-input bg-surface-from text-body-md text-foreground",
  "placeholder:text-muted-foreground",
  "transition-[border-color,box-shadow,background-color] duration-(--cds-duration-base) ease-standard",
  "hover:border-foreground/50",
  "outline-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20",
  "aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/20",
  "disabled:cursor-not-allowed disabled:opacity-50",
].join(" ");

/** Heights shared by text-entry controls and buttons. */
export const controlHeight = {
  sm: "h-(--cds-control-height-sm) text-body-sm",
  md: "h-(--cds-control-height-md)",
  lg: "h-(--cds-control-height-lg)",
} as const;

/** Floating panels: popovers, menus, select and combobox lists, hover cards. */
export const floatingSurface = [
  "z-(--cds-z-index-popover) rounded-overlay border border-border bg-popover text-popover-foreground shadow-elevation-lg",
  "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
  "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
  "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
  "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
].join(" ");

/** Selectable row inside menus, listboxes and command palettes. */
export const menuItem = [
  "relative flex cursor-default items-center gap-2 rounded-item px-2.5 py-2 text-body-sm outline-none select-none",
  "focus:bg-accent focus:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground",
  "data-disabled:pointer-events-none data-disabled:opacity-50",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
].join(" ");

/** Small uppercase group heading inside menus. */
export const menuLabel = "px-2.5 pt-2 pb-1 font-eyebrow text-caption text-muted-foreground";

/** Full-screen scrim behind modal surfaces. */
export const overlayScrim =
  "fixed inset-0 z-(--cds-z-index-overlay) bg-overlay backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0";

/** Container of a dropdown, context or menubar menu. */
export const menuContent = `${floatingSurface} min-w-44 overflow-x-hidden overflow-y-auto p-(--cds-menu-padding)`;

/** Destructive row inside a menu ("Delete", "Sign out"). Apply with `data-variant="destructive"`. */
export const menuItemDestructive =
  "data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:[&_svg]:text-destructive!";

/** Checkbox or radio row: leaves room for the indicator on the left. */
export const menuIndicatorItem = "pl-8";

/** Wrapper for a checkbox/radio indicator inside a menu row. */
export const menuIndicator =
  "pointer-events-none absolute left-2.5 flex size-4 items-center justify-center";

/** Keyboard shortcut hint at the end of a menu row. */
export const menuShortcut =
  "ml-auto pl-4 font-mono text-caption tracking-wider text-muted-foreground";

/** Divider between menu groups. */
export const menuSeparator = "-mx-(--cds-menu-padding) my-(--cds-menu-padding) h-px bg-border";

/** Panel of a modal surface: dialog, alert dialog, sheet, drawer. */
export const overlayPanel =
  "border border-border bg-popover text-popover-foreground shadow-elevation-xl outline-none";

/** Title/description stack at the top of an overlay. */
export const overlayHeader = "flex flex-col gap-1.5";

/** Action row at the bottom of an overlay. Stacks on small screens, primary action last. */
export const overlayFooter = "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end";

export const overlayTitle = "text-heading-sm text-foreground";

export const overlayDescription =
  "text-body-sm text-muted-foreground [&_a]:text-brand [&_a]:underline-offset-4 [&_a:hover]:underline";
