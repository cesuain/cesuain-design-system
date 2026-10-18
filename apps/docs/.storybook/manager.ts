import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

addons.setConfig({
  theme: create({
    base: "dark",
    brandTitle: "Cesuain Design System",
    brandUrl: "https://github.com/cesuain/cesuain-design-system",
    brandTarget: "_blank",
    colorPrimary: "#38bdf8",
    colorSecondary: "#38bdf8",
    appBg: "#08080a",
    appContentBg: "#050505",
    appPreviewBg: "#050505",
    appBorderColor: "rgba(255, 255, 255, 0.08)",
    appBorderRadius: 12,
    textColor: "#fafafa",
    textMutedColor: "#a1a1aa",
    barBg: "#0b0b0d",
    barTextColor: "#a1a1aa",
    barSelectedColor: "#38bdf8",
    inputBg: "#0b0b0d",
    inputBorder: "rgba(255, 255, 255, 0.38)",
    inputTextColor: "#fafafa",
    inputBorderRadius: 12,
    fontBase: '"Poppins", ui-sans-serif, system-ui, sans-serif',
    fontCode: '"JetBrains Mono", ui-monospace, monospace',
  }),
});
