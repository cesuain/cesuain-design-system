import { fileURLToPath } from "node:url";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

/**
 * Runs every story as a browser test in Chromium: render smoke test, play-function
 * interactions and axe accessibility checks (a11y.test = "error" in preview.tsx).
 */
export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({ configDir: fileURLToPath(new URL(".storybook", import.meta.url)) }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            // Reduced motion makes enter/exit animations finish instantly, so assertions and axe
            // see the settled UI. It also exercises the prefers-reduced-motion styles in base.css.
            provider: playwright({ contextOptions: { reducedMotion: "reduce" } }),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
