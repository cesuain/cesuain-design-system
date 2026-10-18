import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoreHorizontal, Plus } from "lucide-react";
import { expect, userEvent, within } from "storybook/test";

import { Badge } from "../badge/badge.js";
import { Button } from "../button/button.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu/dropdown-menu.js";
import { IconButton } from "../icon-button/icon-button.js";
import {
  createDataTableColumnHelper,
  DataTable,
  DataTableColumnHeader,
  dataTableSelectionColumn,
  type DataTableColumnDef,
} from "./data-table.js";

type Project = {
  id: string;
  name: string;
  client: string;
  status: "Live" | "In progress" | "Archived";
  year: number;
};

const projects: Project[] = [
  { id: "1", name: "Storefront rebuild", client: "Retail A", status: "Live", year: 2025 },
  { id: "2", name: "Design system", client: "Internal", status: "In progress", year: 2026 },
  { id: "3", name: "Checkout extension", client: "Retail B", status: "Live", year: 2024 },
  { id: "4", name: "Loyalty portal", client: "Retail C", status: "Archived", year: 2023 },
  { id: "5", name: "Marketing site", client: "Studio D", status: "Live", year: 2025 },
  { id: "6", name: "Analytics dashboard", client: "Retail A", status: "In progress", year: 2026 },
  { id: "7", name: "Headless CMS", client: "Studio D", status: "Archived", year: 2022 },
];

const statusVariant = { Live: "success", "In progress": "brand", Archived: "default" } as const;

const helper = createDataTableColumnHelper<Project>();
const columns: DataTableColumnDef<Project>[] = [
  dataTableSelectionColumn<Project>(),
  helper.accessor("name", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Project" />,
    cell: (info) => <span className="font-medium text-foreground">{info.getValue()}</span>,
    sortFn: "alphanumeric",
    filterFn: "includesString",
  }),
  helper.accessor("client", {
    header: "Client",
    cell: (info) => <span className="text-muted-foreground">{info.getValue()}</span>,
  }),
  helper.accessor("status", {
    header: "Status",
    cell: ({ row }) => (
      <Badge size="sm" variant={statusVariant[row.original.status]}>
        {row.original.status}
      </Badge>
    ),
  }),
  helper.accessor("year", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Year" />,
    sortFn: "basic",
  }),
  helper.display({
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton
            label={`Actions for ${row.original.name}`}
            icon={<MoreHorizontal />}
            size="sm"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Open</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Archive</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }),
];

const meta = {
  title: "Components/Data Display/Data Table",
  component: DataTable,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
// DataTable is generic over its row type, so stories pass typed props directly instead of args.
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <DataTable
      caption="Projects"
      columns={columns}
      data={projects}
      getRowId={(row) => row.id}
      filterColumn="name"
      filterPlaceholder="Filter projects…"
      pageSize={5}
      toolbar={() => (
        <Button size="sm">
          <Plus /> New project
        </Button>
      )}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Year" }));
    await expect(canvas.getByRole("columnheader", { name: "Year" })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );
    await userEvent.type(canvas.getByRole("textbox", { name: "Filter projects" }), "design");
    await expect(canvas.getAllByRole("row")).toHaveLength(2);
  },
};

export const Empty: Story = {
  render: () => (
    <DataTable caption="Projects" columns={columns} data={[]} emptyMessage="No projects yet." />
  ),
};
