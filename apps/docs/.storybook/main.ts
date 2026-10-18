import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

const uiSource = fileURLToPath(new URL("../../../packages/ui/src/index.ts", import.meta.url));
const uiManifest = JSON.parse(
  readFileSync(new URL("../../../packages/ui/package.json", import.meta.url), "utf8"),
) as { dependencies: Record<string, string> };
// CSS-only and workspace packages are not JavaScript modules Vite can pre-bundle.
const uiRuntimeDependencies = Object.keys(uiManifest.dependencies).filter(
  (dep) => !dep.startsWith("@cesuain/") && dep !== "tw-animate-css",
);

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(ts|tsx)",
    "../../../packages/ui/src/**/*.stories.@(ts|tsx)",
  ],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
    "@storybook/addon-vitest",
  ],
  framework: { name: "@storybook/react-vite", options: {} },
  core: { disableTelemetry: true },
  typescript: { reactDocgen: "react-docgen-typescript" },
  async viteFinal(viteConfig) {
    viteConfig.plugins = [...(viteConfig.plugins ?? []), tailwindcss()];
    // Documentation pages import the design system from source so they never need a prior build.
    viteConfig.resolve ??= {};
    viteConfig.resolve.alias = [
      ...(Array.isArray(viteConfig.resolve.alias) ? viteConfig.resolve.alias : []),
      { find: /^@cesuain\/ui$/, replacement: uiSource },
    ];
    // Pre-bundle every runtime dependency of the UI package up front. Without this, Vite discovers
    // them lazily while stories load and reloads the browser test runner mid-run.
    viteConfig.optimizeDeps ??= {};
    viteConfig.optimizeDeps.include = [
      ...(viteConfig.optimizeDeps.include ?? []),
      ...uiRuntimeDependencies.map((dep) => `@cesuain/ui > ${dep}`),
    ];
    return viteConfig;
  },
};

export default config;
