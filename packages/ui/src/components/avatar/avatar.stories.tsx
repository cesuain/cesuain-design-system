import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "./avatar.js";

// An inline SVG keeps the story deterministic and offline.
const portrait = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0ea5e9"/><stop offset="1" stop-color="#a855f7"/></linearGradient></defs><rect width="80" height="80" fill="url(#g)"/><circle cx="40" cy="32" r="14" fill="#0a0a0c" opacity=".55"/><rect x="16" y="52" width="48" height="30" rx="24" fill="#0a0a0c" opacity=".55"/></svg>`,
)}`;

const meta = {
  title: "Components/Data Display/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  args: { size: "md", ring: "none" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg", "xl"] },
    ring: { control: "inline-radio", options: ["none", "brand"] },
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src={portrait} alt="Example person" />
      <AvatarFallback>EP</AvatarFallback>
    </Avatar>
  ),
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const BrandRing: Story = { args: { ring: "brand", size: "lg" } };
export const Fallback: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>CF</AvatarFallback>
    </Avatar>
  ),
};
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-3">
      {(["sm", "md", "lg", "xl"] as const).map((size) => (
        <Avatar key={size} size={size}>
          <AvatarImage src={portrait} alt="" />
          <AvatarFallback>EP</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};
export const Group: Story = {
  render: () => (
    <AvatarGroup>
      {["AL", "GH", "MH", "+4"].map((initials) => (
        <Avatar key={initials}>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  ),
};
