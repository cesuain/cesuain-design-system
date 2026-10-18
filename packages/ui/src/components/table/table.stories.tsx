import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "../badge/badge.js";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table.js";

const rows = [
  { component: "Button", category: "Actions", status: "Stable", stories: 9 },
  { component: "Combobox", category: "Forms", status: "Stable", stories: 5 },
  { component: "Data Table", category: "Data display", status: "Beta", stories: 3 },
  { component: "Sidebar", category: "Navigation", status: "Beta", stories: 2 },
];

const meta = {
  title: "Components/Data Display/Table",
  component: Table,
  tags: ["autodocs"],
  decorators: [(Story) => <div className="w-[40rem]">{Story()}</div>],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Example component inventory</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead scope="col">Component</TableHead>
          <TableHead scope="col">Category</TableHead>
          <TableHead scope="col">Status</TableHead>
          <TableHead scope="col" className="text-right">
            Stories
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.component}>
            <TableCell className="font-medium text-foreground">{row.component}</TableCell>
            <TableCell className="text-muted-foreground">{row.category}</TableCell>
            <TableCell>
              <Badge size="sm" variant={row.status === "Stable" ? "success" : "warning"}>
                {row.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right tabular-nums">{row.stories}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right tabular-nums">
            {rows.reduce((sum, r) => sum + r.stories, 0)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};
