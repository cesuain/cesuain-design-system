import type { Meta, StoryObj } from "@storybook/react-vite";
import { Blocks, Palette, ShoppingBag } from "lucide-react";
import type { ReactNode } from "react";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./navigation-menu.js";

const meta = {
  title: "Components/Navigation/Navigation Menu",
  component: NavigationMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: {
      config: {
        rules: [
          // Radix renders an aria-hidden, focusable "focus proxy" span next to an open trigger so
          // Tab can move into the panel; it immediately forwards focus, so it is not a keyboard
          // trap. This one rule is disabled for this component's stories only; the unit tests
          // still run the full axe rule set against the closed menu.
          { id: "aria-hidden-focus", enabled: false },
        ],
      },
    },
  },
  decorators: [(Story) => <div className="flex min-h-80 justify-center">{Story()}</div>],
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

function Entry({
  href,
  icon,
  title,
  children,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <li>
      <NavigationMenuLink href={href}>
        <span className="flex items-center gap-2 text-label-sm text-foreground">
          {icon}
          {title}
        </span>
        <span className="text-body-xs text-muted-foreground">{children}</span>
      </NavigationMenuLink>
    </li>
  );
}

function Example(props: { viewport?: boolean }) {
  return (
    <NavigationMenu aria-label="Main" viewport={props.viewport}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Work</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[26rem] gap-1">
              <Entry href="#" icon={<ShoppingBag />} title="Commerce">
                Headless storefronts on Shopify Hydrogen.
              </Entry>
              <Entry href="#" icon={<Blocks />} title="Design systems">
                Tokens, components and documentation.
              </Entry>
              <Entry href="#" icon={<Palette />} title="Interfaces">
                Product UI and motion.
              </Entry>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()} active>
            About
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
            Contact
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export const Default: Story = {
  render: () => <Example />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Work" }));
    await waitFor(() => expect(screen.getByRole("link", { name: /Commerce/ })).toBeVisible());
  },
};

export const WithoutViewport: Story = { render: () => <Example viewport={false} /> };
