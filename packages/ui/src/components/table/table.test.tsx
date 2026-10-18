import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../../test/a11y.js";
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

describe("Table", () => {
  it("renders a captioned, semantic table", async () => {
    render(
      <Table>
        <TableCaption>Token counts by layer</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Layer</TableHead>
            <TableHead scope="col">Tokens</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Primitive</TableCell>
            <TableCell>120</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>120</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );
    const table = screen.getByRole("table", { name: "Token counts by layer" });
    expect(within(table).getAllByRole("columnheader")).toHaveLength(2);
    expect(within(table).getAllByRole("row")).toHaveLength(3);
    await expectNoA11yViolations();
  });
});
