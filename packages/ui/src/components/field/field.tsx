"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { useMemo, type ComponentProps, type ReactNode } from "react";

import { cn } from "../../lib/utils.js";
import { Label, type LabelProps } from "../label/label.js";
import { Separator } from "../separator/separator.js";

/** Groups related fields under a legend (`<fieldset>`). */
export function FieldSet({ className, ...props }: ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn("flex min-w-0 flex-col gap-5 has-[>[data-slot=radio-group]]:gap-3", className)}
      {...props}
    />
  );
}

export type FieldLegendProps = ComponentProps<"legend"> & { variant?: "legend" | "label" };

export function FieldLegend({ className, variant = "legend", ...props }: FieldLegendProps) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "mb-1 data-[variant=label]:text-label-md data-[variant=legend]:text-heading-sm",
        className,
      )}
      {...props}
    />
  );
}

/** Vertical stack of fields with consistent spacing. */
export function FieldGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "group/field-group @container/field-group flex w-full flex-col gap-6",
        className,
      )}
      {...props}
    />
  );
}

export const fieldVariants = cva("group/field flex w-full gap-2", {
  variants: {
    orientation: {
      vertical: "flex-col *:w-full [&>.sr-only]:w-auto",
      horizontal:
        "flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio],[role=switch]]:mt-0.5",
      responsive:
        "flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto",
    },
  },
  defaultVariants: { orientation: "vertical" },
});

export type FieldProps = ComponentProps<"div"> &
  VariantProps<typeof fieldVariants> & {
    /** Marks the field as invalid for styling. Also set `aria-invalid` on the control itself. */
    invalid?: boolean;
    disabled?: boolean;
  };

/** Wraps one control with its label, description and error message. */
export function Field({
  className,
  orientation = "vertical",
  invalid,
  disabled,
  ...props
}: FieldProps) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      className={cn(fieldVariants({ orientation }), "data-disabled:opacity-60", className)}
      {...props}
    />
  );
}

/** Column for a label and description placed next to a checkbox, radio or switch. */
export function FieldContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn("flex flex-1 flex-col gap-1", className)}
      {...props}
    />
  );
}

export type FieldLabelProps = LabelProps & {
  /** Appends a visual required marker. Also set `required` or `aria-required` on the control. */
  required?: boolean;
};

export function FieldLabel({ className, required, children, ...props }: FieldLabelProps) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "w-fit gap-1 leading-snug group-data-[invalid=true]/field:text-destructive",
        className,
      )}
      {...props}
    >
      {children}
      {required ? (
        <span aria-hidden="true" className="text-brand">
          *
        </span>
      ) : null}
    </Label>
  );
}

/** Helper text. Reference its `id` from the control's `aria-describedby`. */
export function FieldDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "text-body-sm text-muted-foreground [&>a]:text-brand [&>a]:underline [&>a]:underline-offset-4",
        className,
      )}
      {...props}
    />
  );
}

export type FieldErrorProps = ComponentProps<"div"> & {
  /** Validation errors, e.g. from React Hook Form or Zod. Duplicate messages are collapsed. */
  errors?: Array<{ message?: string } | undefined>;
};

/**
 * Validation message. Rendered with `role="alert"` so it is announced when it appears.
 * Reference its `id` from the control's `aria-describedby` and set `aria-invalid` on the control.
 */
export function FieldError({ className, children, errors, ...props }: FieldErrorProps) {
  const content = useMemo<ReactNode>(() => {
    if (children) return children;
    const messages = [
      ...new Set((errors ?? []).map((e) => e?.message).filter(Boolean)),
    ] as string[];
    if (messages.length === 0) return null;
    if (messages.length === 1) return messages[0];
    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    );
  }, [children, errors]);

  if (!content) return null;

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn("text-body-sm text-destructive", className)}
      {...props}
    >
      {content}
    </div>
  );
}

/** Divider between groups of fields, optionally with a label ("or continue with"). */
export function FieldSeparator({ children, className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="field-separator"
      data-content={Boolean(children) || undefined}
      className={cn("relative h-5 text-body-sm", className)}
      {...props}
    >
      <Separator className="absolute inset-x-0 top-1/2" />
      {children ? (
        <span className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground">
          {children}
        </span>
      ) : null}
    </div>
  );
}
