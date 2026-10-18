"use client";

import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
  type Column,
  type ColumnDef,
  type RowData,
  type Table as TanstackTable,
} from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "../../lib/utils.js";
import { Button } from "../button/button.js";
import { Checkbox } from "../checkbox/checkbox.js";
import { Input } from "../input/input.js";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table/table.js";

/**
 * The TanStack Table v9 feature set every DataTable uses. Build column definitions against it
 * with `createDataTableColumnHelper<Row>()`.
 */
export const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
  filterFns: { includesString: filterFn_includesString },
});

export type DataTableFeatures = typeof dataTableFeatures;
// Columns in one table hold different value types; TanStack's own docs type the array with `any`.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataTableColumnDef<TData extends RowData> = ColumnDef<DataTableFeatures, TData, any>;

/** Typed column helper bound to `dataTableFeatures`. */
export function createDataTableColumnHelper<TData extends RowData>() {
  return createColumnHelper<DataTableFeatures, TData>();
}

/** A sortable column header. Use it as a column's `header`. */
export function DataTableColumnHeader<TData extends RowData>({
  column,
  title,
  className,
}: {
  column: Column<DataTableFeatures, TData, unknown>;
  title: string;
  className?: string;
}) {
  if (!column.getCanSort()) return <span className={className}>{title}</span>;
  const sorted = column.getIsSorted();
  const Icon = sorted === "asc" ? ArrowUpIcon : sorted === "desc" ? ArrowDownIcon : ArrowUpDownIcon;
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "-ml-3 h-8 px-3 font-eyebrow text-caption",
        sorted && "text-foreground",
        className,
      )}
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {title}
      <Icon aria-hidden="true" className={cn(!sorted && "opacity-50")} />
    </Button>
  );
}

/** A checkbox column that selects rows on the current page. Put it first in `columns`. */
export function dataTableSelectionColumn<TData extends RowData>(): DataTableColumnDef<TData> {
  return {
    id: "select",
    enableSorting: false,
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all rows on this page"
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(value === true)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label={`Select row ${row.index + 1}`}
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(value === true)}
      />
    ),
  };
}

export type DataTableProps<TData extends RowData> = {
  columns: DataTableColumnDef<TData>[];
  data: TData[];
  /** Accessible name of the table, rendered as a visually hidden caption unless `showCaption`. */
  caption: string;
  showCaption?: boolean;
  /** Column id to filter with the search field. Omit to hide the search field. */
  filterColumn?: string;
  filterPlaceholder?: string;
  /** Rows per page. */
  pageSize?: number;
  /** Message shown when no rows match. */
  emptyMessage?: ReactNode;
  /** Content rendered next to the search field, e.g. a "New" button. */
  toolbar?: (table: TanstackTable<DataTableFeatures, TData>) => ReactNode;
  getRowId?: (row: TData, index: number) => string;
  className?: string;
};

/**
 * A `Table` with sorting, filtering, pagination and optional row selection, powered by
 * TanStack Table v9. For read-only lists without interaction, use `Table` directly.
 */
export function DataTable<TData extends RowData>({
  columns,
  data,
  caption,
  showCaption = false,
  filterColumn,
  filterPlaceholder = "Filter…",
  pageSize = 10,
  emptyMessage = "No results.",
  toolbar,
  getRowId,
  className,
}: DataTableProps<TData>) {
  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
    getRowId,
    initialState: { pagination: { pageIndex: 0, pageSize } },
  });

  const filter = filterColumn ? table.getColumn(filterColumn) : undefined;
  const rows = table.getRowModel().rows;
  const total = table.getFilteredRowModel().rows.length;
  const selected = table.getFilteredSelectedRowModel().rows.length;
  const hasSelection = columns.some((column) => column.id === "select");
  const { pageIndex } = table.state.pagination;
  const pageCount = Math.max(1, table.getPageCount());

  return (
    <div data-slot="data-table" className={cn("grid gap-4", className)}>
      {filter || toolbar ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          {filter ? (
            <Input
              aria-label={filterPlaceholder.replace(/…$/, "")}
              placeholder={filterPlaceholder}
              value={(filter.getFilterValue() as string | undefined) ?? ""}
              onChange={(event) => filter.setFilterValue(event.target.value)}
              inputSize="sm"
              className="max-w-xs"
            />
          ) : (
            <span />
          )}
          {toolbar?.(table)}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-card border border-border">
        <Table>
          <TableCaption className={cn(!showCaption && "sr-only")}>{caption}</TableCaption>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id} className="hover:bg-transparent">
                {group.headers.map((header) => {
                  const sorted = header.column.getIsSorted();
                  return (
                    <TableHead
                      key={header.id}
                      scope="col"
                      aria-sort={
                        sorted === "asc"
                          ? "ascending"
                          : sorted === "desc"
                            ? "descending"
                            : undefined
                      }
                    >
                      {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-body-sm text-muted-foreground">
        <p role="status" aria-live="polite">
          {hasSelection
            ? `${selected} of ${total} row${total === 1 ? "" : "s"} selected.`
            : `${total} row${total === 1 ? "" : "s"}.`}
        </p>
        <div className="flex items-center gap-2">
          <span className="tabular-nums">
            Page {pageIndex + 1} of {pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
