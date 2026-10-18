/**
 * Building blocks for the foundation pages. They render with the design system's own tokens
 * and components, so each page doubles as a visual test of the foundations it documents.
 */
import { Badge, cn } from "@cesuain/ui";
import type { ComponentProps, ReactNode } from "react";

import { type Token, type ThemeName, themes, valueFor } from "./tokens.js";

export function DocPage({
  eyebrow,
  title,
  children,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto grid w-full max-w-page-lg gap-12 px-6 py-12 text-foreground md:px-10">
      <header className="grid max-w-prose gap-3">
        <p className="font-eyebrow text-eyebrow text-brand">{eyebrow}</p>
        <h1 className="font-display text-display-md uppercase">{title}</h1>
        <div className="text-body-lg text-muted-foreground">{lead}</div>
      </header>
      {children}
    </main>
  );
}

export function DocSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("grid gap-5", className)}>
      <div className="grid max-w-prose gap-1.5">
        <h2 className="text-heading-lg">{title}</h2>
        {description ? <p className="text-body-md text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

/** A `--css-variable` or token path rendered as inline code. */
export function Code({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <code
      className={cn(
        "rounded-xs bg-muted px-1.5 py-0.5 font-mono text-code whitespace-nowrap text-foreground",
        className,
      )}
    >
      {children}
    </code>
  );
}

export type Column<T> = {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
};

/** An accessible reference table with a visible caption and column headers. */
export function DocTable<T>({
  caption,
  columns,
  rows,
  rowKey,
}: {
  caption: string;
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
}) {
  return (
    // Focusable so keyboard users can scroll wide tables (axe: scrollable-region-focusable).
    <div
      role="region"
      aria-label={caption}
      tabIndex={0}
      className="overflow-x-auto rounded-card border border-border focus-ring"
    >
      <table className="w-full min-w-[40rem] border-collapse text-left text-body-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-muted/40">
          <tr>
            {columns.map((column) => (
              <th
                key={column.header}
                scope="col"
                className="px-4 py-3 font-eyebrow text-caption font-normal text-muted-foreground"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-t border-border align-middle">
              {columns.map((column) => (
                <td key={column.header} className={cn("px-4 py-3", column.className)}>
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Columns shared by every token table: name, CSS variable, value per theme, Figma variable. */
export function tokenColumns(options: { themed?: boolean; preview?: Column<Token> } = {}) {
  const columns: Column<Token>[] = [];
  if (options.preview) columns.push(options.preview);
  columns.push(
    {
      header: "Token",
      cell: (token) => (
        <div className="grid gap-1">
          <Code>{token.name}</Code>
          {token.description ? (
            <span className="text-caption text-muted-foreground">{token.description}</span>
          ) : null}
        </div>
      ),
    },
    { header: "CSS variable", cell: (token) => <Code>{token.cssVar}</Code> },
  );
  if (options.themed) {
    for (const theme of themes) {
      columns.push({
        header: theme === "dark" ? "Dark" : "Light",
        cell: (token) => <TokenValueCell token={token} theme={theme} />,
      });
    }
  } else {
    columns.push({ header: "Value", cell: (token) => <TokenValueCell token={token} /> });
  }
  columns.push({
    header: "Figma",
    cell: (token) => <span className="font-mono text-caption">{token.figma}</span>,
  });
  return columns;
}

function TokenValueCell({ token, theme }: { token: Token; theme?: ThemeName }) {
  const value = valueFor(token, theme);
  return (
    <div className="grid gap-0.5">
      <span className="font-mono text-caption text-foreground">{value.resolved}</span>
      {value.alias ? (
        <span className="font-mono text-caption text-muted-foreground">→ {value.alias}</span>
      ) : null}
    </div>
  );
}

/** A color chip painted with the live CSS variable, so it follows the active theme. */
export function Swatch({
  cssVar,
  className,
  ...props
}: { cssVar: string } & ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block size-10 shrink-0 rounded-md border border-border-strong shadow-elevation-sm",
        className,
      )}
      style={{ background: `var(${cssVar})` }}
      {...props}
    />
  );
}

export function PassBadge({ pass }: { pass: boolean }) {
  return pass ? <Badge variant="success">Pass</Badge> : <Badge variant="destructive">Fail</Badge>;
}

/** Forces a token theme on a subtree, independent of the toolbar theme. */
export function ThemeScope({
  theme,
  className,
  children,
}: {
  theme: ThemeName;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      data-theme={theme}
      className={cn("rounded-card bg-background p-6 text-foreground", className)}
    >
      {children}
    </div>
  );
}
