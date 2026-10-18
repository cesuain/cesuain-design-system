import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { ThemeToggle, type Theme } from "./theme-toggle.js";

const meta = {
  title: "Patterns/Theme Toggle",
  component: ThemeToggle,
  tags: ["autodocs"],
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledDemo() {
  const [theme, setTheme] = useState<Theme>("dark");
  return (
    <div className="flex items-center gap-3">
      <ThemeToggle theme={theme} onThemeChange={setTheme} variant="secondary" />
      <span className="font-mono text-body-sm text-muted-foreground">theme: {theme}</span>
    </div>
  );
}

/** Controlled so the story does not fight Storybook's own theme switcher in the toolbar. */
export const Controlled: Story = { render: () => <ControlledDemo /> };

export const Localised: Story = {
  render: () => (
    <ThemeToggle
      theme="dark"
      onThemeChange={() => {}}
      labels={{ toLight: "Mudar para tema claro", toDark: "Mudar para tema escuro" }}
    />
  ),
};
