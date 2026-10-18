import { withThemeByDataAttribute } from "@storybook/addon-themes";
import type { Preview, ReactRenderer } from "@storybook/react-vite";
import { themes } from "storybook/theming";

import { TooltipProvider } from "@cesuain/ui";

import { DocsPage } from "./docs-page.js";
import "./preview.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: {
      expanded: true,
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    a11y: {
      // Fail story tests on axe violations (run by `pnpm test:stories`).
      test: "error",
    },
    docs: { theme: themes.dark, codePanel: true, page: DocsPage },
    backgrounds: { disable: true },
    options: {
      storySort: {
        order: [
          "Introduction",
          "Foundations",
          [
            "Colors",
            "Typography",
            "Spacing",
            "Radius",
            "Shadows",
            "Motion",
            "Iconography",
            "Themes",
            "Tokens",
          ],
          "Components",
          ["Actions", "Forms", "Navigation", "Feedback", "Overlays", "Data Display", "Layout"],
          "Patterns",
        ],
      },
    },
  },
  decorators: [
    // Apps mount one TooltipProvider at the root; stories get the same context.
    (Story) => (
      <TooltipProvider delayDuration={200}>
        <Story />
      </TooltipProvider>
    ),
    withThemeByDataAttribute<ReactRenderer>({
      themes: { Dark: "dark", Light: "light" },
      defaultTheme: "Dark",
      attributeName: "data-theme",
    }),
  ],
};

export default preview;
