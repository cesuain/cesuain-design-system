import { Badge, Button, Card, CardDescription, CardHeader, CardTitle, Link } from "@cesuain/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowUpRight } from "lucide-react";

import uiManifest from "../../../../packages/ui/package.json";
import componentMap from "../../../../docs/figma/component-map.json";
import { Code, DocSection } from "../foundations/doc-blocks.js";
import { contrastChecks, tokens } from "../foundations/tokens.js";

const meta = {
  title: "Introduction",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const principles = [
  {
    title: "Tokens first",
    body: "Every color, size and curve is a DTCG token. CSS, TypeScript, Figma variables and these docs are generated from the same source.",
  },
  {
    title: "Accessible by default",
    body: "Built on Radix primitives, checked with axe in every story, and contrast-tested in both themes before tokens ship.",
  },
  {
    title: "Composable, not configurable",
    body: "shadcn/ui-style components you compose from small parts, with cva variants for the decisions that recur.",
  },
  {
    title: "Quiet, then bold",
    body: "Dark layered surfaces and soft borders carry the interface; the sky-to-violet gradient and display type are reserved for emphasis.",
  },
];

const repositoryUrl = "https://github.com/cesuain/cesuain-design-system";

const packages = [
  [
    "@cesuain/tokens",
    "DTCG sources and generated CSS variables, Tailwind theme, JSON and TypeScript. On npm.",
  ],
  ["@cesuain/ui", "React components, styles and hooks. On npm."],
  [
    "@cesuain/docs",
    "This Storybook: foundations, component docs, interaction and accessibility tests.",
  ],
];

const figmaBoards = [
  ...Object.entries(componentMap.foundations)
    .filter(([name]) => name !== "Cover")
    .map(([name, board]) => [`Foundations · ${name}`, board] as const),
  ...Object.entries(componentMap.boards).map(
    ([name, board]) => [`Components · ${name}`, board] as const,
  ),
];

const passing = contrastChecks.filter((check) => check.pass).length;

export const Overview: Story = {
  name: "Introduction",
  render: () => (
    <main className="mx-auto grid w-full max-w-page-lg gap-14 px-6 py-14 text-foreground md:px-10">
      <header className="grid gap-5">
        <p className="font-eyebrow text-eyebrow text-brand">Cesuain</p>
        <h1 className="font-display text-display-xl uppercase">
          Design <span className="text-gradient">System</span>
        </h1>
        <p className="max-w-prose text-body-lg text-muted-foreground">
          A production-ready foundation for product interfaces: design tokens, accessible React
          components and the matching Figma library. Designed and built by Cesar Fonseca, and the
          system behind{" "}
          <Link href="https://cesarfonseca.dev" external>
            cesarfonseca.dev
          </Link>
          .
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="gradient">
            <a href={repositoryUrl} target="_blank" rel="noopener noreferrer">
              View on GitHub <ArrowUpRight />
              <span className="sr-only">, opens in a new tab</span>
            </a>
          </Button>
          <Button asChild variant="secondary">
            <a
              href="https://www.npmjs.com/package/@cesuain/ui"
              target="_blank"
              rel="noopener noreferrer"
            >
              @cesuain/ui on npm <ArrowUpRight />
              <span className="sr-only">, opens in a new tab</span>
            </a>
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="gradient">v{uiManifest.version} · Stable</Badge>
          <Badge variant="brand">{tokens.length} tokens</Badge>
          <Badge>{Object.keys(componentMap.components).length} components</Badge>
          <Badge>2 themes</Badge>
          <Badge variant="success">
            {passing}/{contrastChecks.length} contrast checks passing
          </Badge>
        </div>
      </header>

      <DocSection title="Principles">
        <ul className="grid gap-4 md:grid-cols-2">
          {principles.map((principle) => (
            <li key={principle.title}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{principle.title}</CardTitle>
                  <CardDescription>{principle.body}</CardDescription>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection
        title="In production"
        description="The system is the UI layer of cesarfonseca.dev. The site imports @cesuain/ui and its stylesheet for buttons, badges, form fields, section layout and headings, stat and feature cards, the theme toggle, the language switch and the ⌘K command palette."
      >
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-body-md">
          <li>
            <Link href="https://cesarfonseca.dev" external>
              cesarfonseca.dev
            </Link>
          </li>
          <li>
            <Link href={repositoryUrl} external>
              Source on GitHub
            </Link>
          </li>
          <li>
            <Link href={`${repositoryUrl}/blob/main/CHANGELOG.md`} external>
              Changelog
            </Link>
          </li>
        </ul>
      </DocSection>

      <DocSection title="Packages">
        <dl className="grid gap-4">
          {packages.map(([name, description]) => (
            <div key={name} className="grid gap-1 md:grid-cols-[12rem_1fr]">
              <dt>
                <Code>{name}</Code>
              </dt>
              <dd className="text-body-md text-muted-foreground">{description}</dd>
            </div>
          ))}
        </dl>
      </DocSection>

      <DocSection title="Getting started">
        <pre
          tabIndex={0}
          className="overflow-x-auto rounded-card border border-border bg-muted/40 p-5 font-mono text-code focus-ring"
        >
          {`pnpm add @cesuain/ui

/* app/globals.css: replaces @import "tailwindcss" */
@import "@cesuain/ui/styles.css";

// app/page.tsx
import { Button } from "@cesuain/ui";

export default function Page() {
  return <Button>Get started</Button>;
}`}
        </pre>
      </DocSection>

      <DocSection
        title="Figma library"
        description="Variables, text and effect styles, and a native component set for every component, named and grouped like these docs. Each component's Docs page links to its set."
      >
        <p className="text-body-md">
          <Link href={componentMap.fileUrl} external>
            Open the Cesuain Design System file in Figma
          </Link>
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-body-sm">
          {figmaBoards.map(([name, board]) => (
            <li key={name}>
              <Link href={board.figmaUrl} variant="subtle" external>
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection title="How to read these docs">
        <ul className="grid list-disc gap-2 pl-5 text-body-md text-muted-foreground">
          <li>
            <strong className="text-foreground">Foundations</strong> render straight from the token
            JSON: colors, contrast, typography, spacing, radius, shadows, motion, layout,
            iconography and themes.
          </li>
          <li>
            <strong className="text-foreground">Components</strong> are grouped like the Figma
            library: Actions, Forms, Navigation, Feedback, Overlays, Data Display and Layout. Each
            has a Docs page with its props, plus stories for variants, sizes and states.
          </li>
          <li>
            <strong className="text-foreground">Patterns</strong> are higher-level compositions,
            such as the section heading, stat card and timeline, used across cesarfonseca.dev.
          </li>
          <li>
            Use the toolbar to switch between the dark and light themes. The Accessibility panel
            shows the axe results for the current story.
          </li>
        </ul>
      </DocSection>
    </main>
  ),
};
