import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  paginationRange,
} from "./pagination.js";

const meta = {
  title: "Components/Navigation/Pagination",
  component: Pagination,
  tags: ["autodocs"],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

function PaginationDemo({ pageCount }: { pageCount: number }) {
  const [page, setPage] = useState(1);
  const go = (next: number) => (event: React.MouseEvent) => {
    event.preventDefault();
    setPage(Math.min(Math.max(1, next), pageCount));
  };
  return (
    <div className="grid gap-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={`#page-${page - 1}`}
              onClick={go(page - 1)}
              aria-disabled={page === 1}
            />
          </PaginationItem>
          {paginationRange(page, pageCount).map((entry, index) => (
            <PaginationItem key={entry === "ellipsis" ? `gap-${index}` : entry}>
              {entry === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href={`#page-${entry}`}
                  isActive={entry === page}
                  onClick={go(entry)}
                >
                  {entry}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href={`#page-${page + 1}`}
              onClick={go(page + 1)}
              aria-disabled={page === pageCount}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <p role="status" className="text-center text-body-sm text-muted-foreground">
        Page {page} of {pageCount}
      </p>
    </div>
  );
}

export const Default: Story = {
  render: () => <PaginationDemo pageCount={12} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("link", { name: "Go to next page" }));
    await expect(canvas.getByRole("link", { name: "2" })).toHaveAttribute("aria-current", "page");
    await userEvent.click(canvas.getByRole("link", { name: "12" }));
    await expect(canvas.getByRole("status")).toHaveTextContent("Page 12 of 12");
  },
};

export const FewPages: Story = { render: () => <PaginationDemo pageCount={4} /> };
