import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  BookOpen,
  Boxes,
  ChevronRight,
  LayoutGrid,
  MoreHorizontal,
  Palette,
  Plus,
  Search,
  Settings,
  Type,
} from "lucide-react";
import { expect, userEvent, within } from "storybook/test";

import { Avatar, AvatarFallback } from "../avatar/avatar.js";
import { Badge } from "../badge/badge.js";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "../breadcrumb/breadcrumb.js";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../collapsible/collapsible.js";
import { Separator } from "../separator/separator.js";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  type SidebarProps,
} from "./sidebar.js";

const foundations = [
  { title: "Colors", icon: <Palette /> },
  { title: "Typography", icon: <Type /> },
  { title: "Layout", icon: <LayoutGrid /> },
];

const components = ["Button", "Card", "Dialog", "Tabs"];

function AppShell(props: Pick<SidebarProps, "variant" | "collapsible">) {
  return (
    <SidebarProvider className="min-h-[36rem]">
      <Sidebar {...props} label="Documentation">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" tooltip="Cesuain DS">
                <span className="grid size-8 shrink-0 place-items-center rounded-item bg-brand-gradient font-display text-heading-sm text-gradient-foreground">
                  C
                </span>
                <span className="grid text-left">
                  <span className="text-label-sm text-foreground">Cesuain DS</span>
                  <span className="text-caption text-muted-foreground">v1.0.0</span>
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="relative group-data-[collapsible=icon]:hidden">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <SidebarInput aria-label="Search docs" placeholder="Search…" className="pl-9" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <nav aria-label="Documentation">
            <SidebarGroup>
              <SidebarGroupLabel>Foundations</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {foundations.map((item, i) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={i === 0} tooltip={item.title}>
                        <a href={`#${item.title.toLowerCase()}`}>
                          {item.icon}
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Library</SidebarGroupLabel>
              <SidebarGroupAction title="Add component">
                <Plus /> <span className="sr-only">Add component</span>
              </SidebarGroupAction>
              <SidebarGroupContent>
                <SidebarMenu>
                  <Collapsible asChild defaultOpen className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip="Components">
                          <Boxes />
                          <span>Components</span>
                          <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {components.map((name) => (
                            <SidebarMenuSubItem key={name}>
                              <SidebarMenuSubButton href={`#${name.toLowerCase()}`}>
                                <span>{name}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Guides">
                      <a href="#guides">
                        <BookOpen />
                        <span>Guides</span>
                      </a>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>12</SidebarMenuBadge>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Settings">
                      <a href="#settings">
                        <Settings />
                        <span>Settings</span>
                      </a>
                    </SidebarMenuButton>
                    <SidebarMenuAction showOnHover aria-label="Settings options">
                      <MoreHorizontal />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </nav>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" tooltip="Account">
                <Avatar size="sm">
                  <AvatarFallback>CF</AvatarFallback>
                </Avatar>
                <span className="grid text-left">
                  <span className="text-label-sm text-foreground">Maintainer</span>
                  <span className="text-caption text-muted-foreground">Cesuain Design System</span>
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Colors</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Badge size="sm" variant="brand" className="ml-auto">
            ⌘B
          </Badge>
        </header>
        <div className="grid flex-1 grid-cols-3 gap-4 p-6">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="aspect-video rounded-card surface" />
          ))}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

const meta = {
  title: "Components/Navigation/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { variant: "sidebar", collapsible: "icon" },
  argTypes: {
    variant: { control: "inline-radio", options: ["sidebar", "floating", "inset"] },
    collapsible: { control: "inline-radio", options: ["offcanvas", "icon", "none"] },
  },
  render: (args) => <AppShell variant={args.variant} collapsible={args.collapsible} />,
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Toggle sidebar" });
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
  },
};
export const Floating: Story = { args: { variant: "floating" } };
export const Inset: Story = { args: { variant: "inset" } };
export const Offcanvas: Story = { args: { collapsible: "offcanvas" } };

export const Loading: Story = {
  render: () => (
    <SidebarProvider className="min-h-96">
      <Sidebar collapsible="none" className="border-r border-sidebar-border">
        <SidebarContent>
          <SidebarGroup aria-busy="true">
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarMenu>
              {["72%", "54%", "80%", "63%"].map((width) => (
                <SidebarMenuItem key={width}>
                  <SidebarMenuSkeleton showIcon width={width} />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  ),
};
