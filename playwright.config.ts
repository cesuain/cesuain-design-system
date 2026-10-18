import { defineConfig, devices } from "@playwright/test";

const port = 6007;

/**
 * Browser smoke tests against the static Storybook build. Build it first with
 * `pnpm storybook:build`; `pnpm test:e2e` serves it and runs tests/*.spec.ts.
 */
export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: { baseURL: `http://localhost:${port}`, trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `node tests/serve-static.ts ${port}`,
    url: `http://localhost:${port}/index.json`,
    reuseExistingServer: !process.env.CI,
  },
});
