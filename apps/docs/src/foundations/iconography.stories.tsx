import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ArrowUpRightIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CircleCheckIcon,
  InfoIcon,
  type LucideIcon,
  MoonIcon,
  MoreHorizontalIcon,
  OctagonXIcon,
  PanelLeftIcon,
  SearchIcon,
  SunIcon,
  TriangleAlertIcon,
} from "lucide-react";

import { Code, DocPage, DocSection, DocTable, tokenColumns } from "./doc-blocks.js";
import { tokensUnder, type Token } from "./tokens.js";

const meta = {
  title: "Foundations/Iconography",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Icons the components themselves render. Product code may use any Lucide icon. */
const systemIcons: [string, LucideIcon, string][] = [
  ["ArrowUpRight", ArrowUpRightIcon, "External links, card affordances"],
  ["Calendar", CalendarIcon, "Date picker trigger"],
  ["Check", CheckIcon, "Checkbox, selected menu and select items"],
  ["ChevronDown", ChevronDownIcon, "Select, accordion, navigation menu"],
  ["ChevronRight", ChevronRightIcon, "Breadcrumb, submenus, pagination"],
  ["CircleCheck", CircleCheckIcon, "Success toast"],
  ["Info", InfoIcon, "Info toast and alert"],
  ["MoreHorizontal", MoreHorizontalIcon, "Truncated breadcrumb and pagination"],
  ["Moon / Sun", MoonIcon, "Theme toggle"],
  ["OctagonX", OctagonXIcon, "Error toast"],
  ["PanelLeft", PanelLeftIcon, "Sidebar trigger"],
  ["Search", SearchIcon, "Command input"],
  ["TriangleAlert", TriangleAlertIcon, "Warning toast"],
];

const sizePreview = {
  header: "Preview",
  className: "w-20",
  cell: (token: Token) => (
    <SunIcon
      aria-hidden="true"
      style={{ width: `var(${token.cssVar})`, height: `var(${token.cssVar})` }}
    />
  ),
};

export const Icons: Story = {
  name: "Iconography",
  render: () => (
    <DocPage
      eyebrow="Foundations"
      title="Iconography"
      lead={
        <p>
          Icons come from <strong className="text-foreground">Lucide</strong>: a 24px grid, 2px
          stroke, rounded joins. They inherit <Code>currentColor</Code>, so an icon always matches
          its text. Decorative icons get <Code>aria-hidden</Code>; an icon that is the only content
          of a control needs an accessible name on the control (see <Code>IconButton</Code>).
        </p>
      }
    >
      <DocSection
        title="System icons"
        description="Rendered by components at the default size, 16px."
      >
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-3">
          {systemIcons.map(([name, Icon, usage]) => (
            <li key={name} className="grid gap-2 rounded-card border border-border p-4">
              <Icon aria-hidden="true" className="size-5 text-brand" />
              <span className="font-mono text-caption text-foreground">{name}</span>
              <span className="text-caption text-muted-foreground">{usage}</span>
            </li>
          ))}
        </ul>
      </DocSection>
      <DocSection
        title="Sizes"
        description="Buttons and menu items size their icons automatically; pass a size-* class only when breaking from the default."
      >
        <DocTable
          caption="Icon size tokens"
          rows={tokensUnder("size.icon")}
          rowKey={(token) => token.name}
          columns={tokenColumns({ preview: sizePreview })}
        />
      </DocSection>
    </DocPage>
  ),
};
