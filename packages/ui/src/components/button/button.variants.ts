import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  [
    "group/button relative inline-flex shrink-0 items-center justify-center gap-2 rounded-control font-medium whitespace-nowrap focus-ring select-none",
    "transition-[color,background-color,border-color,box-shadow,opacity] duration-(--cds-duration-moderate) ease-standard",
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        glow: "bg-primary text-primary-foreground shadow-glow-brand hover:shadow-glow-brand-strong",
        gradient:
          "bg-brand-gradient text-gradient-foreground shadow-glow-purple hover:shadow-glow-brand-strong",
        secondary: "text-foreground surface hover:border-border-strong hover:bg-accent/50",
        outline: "border border-border-strong bg-transparent text-foreground hover:bg-accent/50",
        ghost:
          "text-muted-foreground hover:bg-accent/60 hover:text-foreground aria-expanded:bg-accent/60",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "h-auto rounded-none px-0 text-brand underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-(--cds-control-height-sm) px-(--cds-control-padding-x-sm) text-label-sm",
        md: "h-(--cds-control-height-md) px-(--cds-control-padding-x-md) text-label-md",
        lg: "h-(--cds-control-height-lg) px-(--cds-control-padding-x-lg) text-label-md",
        "icon-sm": "size-(--cds-control-height-sm)",
        icon: "size-10",
        "icon-lg": "size-(--cds-control-height-md) [&_svg:not([class*='size-'])]:size-5",
      },
    },
    compoundVariants: [{ variant: "link", className: "h-auto px-0" }],
    defaultVariants: { variant: "default", size: "md" },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
