import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
import {
  createDataTableColumnHelper,
  DataTable,
  DataTableColumnHeader,
  dataTableSelectionColumn,
  type DataTableColumnDef,
} from "./data-table.js";

type Token = { name: string; layer: string; uses: number };

const data: Token[] = [
  { name: "color.brand", layer: "semantic", uses: 42 },
  { name: "space.4", layer: "primitive", uses: 120 },
  { name: "radius.card", layer: "semantic", uses: 18 },
  { name: "control.height.md", layer: "component", uses: 9 },
];

const helper = createDataTableColumnHelper<Token>();
const columns: DataTableColumnDef<Token>[] = [
  dataTableSelectionColumn<Token>(),
  helper.accessor("name", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    sortFn: "alphanumeric",
    filterFn: "includesString",
  }),
  helper.accessor("layer", { header: "Layer" }),
  helper.accessor("uses", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Uses" />,
    sortFn: "basic",
  }),
];

const bodyNames = () =>
  within(screen.getAllByRole("rowgroup")[1] as HTMLElement)
    .getAllByRole("row")
    .map((row) => within(row).getAllByRole("cell")[1]?.textContent);

describe("DataTable", () => {
  it("renders a captioned table with every row", async () => {
    render(
      <DataTable
        caption="Tokens"
        columns={columns}
        data={data}
        filterColumn="name"
        filterPlaceholder="Filter tokens…"
      />,
    );
    expect(screen.getByRole("table", { name: "Tokens" })).toBeInTheDocument();
    expect(bodyNames()).toEqual(["color.brand", "space.4", "radius.card", "control.height.md"]);
    expect(screen.getByRole("status")).toHaveTextContent("0 of 4 rows selected.");
    await expectNoA11yViolations();
  });

  it("sorts by a column and exposes aria-sort", async () => {
    const user = userEvent.setup();
    render(<DataTable caption="Tokens" columns={columns} data={data} />);
    await user.click(screen.getByRole("button", { name: "Uses" }));
    expect(screen.getByRole("columnheader", { name: "Uses" })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );
    expect(bodyNames()).toEqual(["control.height.md", "radius.card", "color.brand", "space.4"]);
    await user.click(screen.getByRole("button", { name: "Uses" }));
    expect(screen.getByRole("columnheader", { name: "Uses" })).toHaveAttribute(
      "aria-sort",
      "descending",
    );
  });

  it("filters rows from the search field", async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        caption="Tokens"
        columns={columns}
        data={data}
        filterColumn="name"
        filterPlaceholder="Filter tokens…"
      />,
    );
    await user.type(screen.getByRole("textbox", { name: "Filter tokens" }), "radius");
    expect(bodyNames()).toEqual(["radius.card"]);
    await user.clear(screen.getByRole("textbox", { name: "Filter tokens" }));
    await user.type(screen.getByRole("textbox", { name: "Filter tokens" }), "nothing");
    expect(screen.getByText("No results.")).toBeInTheDocument();
  });

  it("paginates", async () => {
    const user = userEvent.setup();
    render(<DataTable caption="Tokens" columns={columns} data={data} pageSize={2} />);
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    expect(bodyNames()).toEqual(["radius.card", "control.height.md"]);
  });

  it("selects rows", async () => {
    const user = userEvent.setup();
    render(<DataTable caption="Tokens" columns={columns} data={data} />);
    await user.click(screen.getByRole("checkbox", { name: "Select row 2" }));
    expect(screen.getByRole("status")).toHaveTextContent("1 of 4 rows selected.");
    await user.click(screen.getByRole("checkbox", { name: "Select all rows on this page" }));
    expect(screen.getByRole("status")).toHaveTextContent("4 of 4 rows selected.");
  });
});
