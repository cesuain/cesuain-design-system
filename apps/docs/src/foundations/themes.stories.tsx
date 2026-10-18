import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Switch,
} from "@cesuain/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Code, DocPage, DocSection, ThemeScope } from "./doc-blocks.js";
import { type ThemeName, themes } from "./tokens.js";

const meta = {
  title: "Foundations/Themes",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Sample({ theme }: { theme: ThemeName }) {
  const id = `theme-${theme}`;
  return (
    <ThemeScope theme={theme} className="grid gap-5 border border-border">
      <p className="font-eyebrow text-eyebrow text-brand">{theme} theme</p>
      <Card>
        <CardHeader>
          <CardTitle>Design tokens</CardTitle>
          <CardDescription>One source, two themes, every platform.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-wrap gap-2">
            <Badge>Tokens</Badge>
            <Badge variant="brand">Brand</Badge>
            <Badge variant="success">Passing</Badge>
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${id}-email`}>Email</Label>
            <Input id={`${id}-email`} type="email" placeholder="you@example.com" />
          </div>
          <div className="flex items-center gap-3">
            <Switch id={`${id}-updates`} defaultChecked />
            <Label htmlFor={`${id}-updates`}>Release notes</Label>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button>Primary</Button>
            <Button variant="outline">Outline</Button>
          </div>
        </CardContent>
      </Card>
      <Alert variant="info">
        <AlertTitle>Themes share every token name</AlertTitle>
        <AlertDescription>Only the values change.</AlertDescription>
      </Alert>
    </ThemeScope>
  );
}

export const Comparison: Story = {
  name: "Themes",
  render: () => (
    <DocPage
      eyebrow="Foundations"
      title="Themes"
      lead={
        <p>
          Dark is the default, matching the original site. The light theme redefines the same
          semantic variables under <Code>[data-theme=&quot;light&quot;]</Code> (or{" "}
          <Code>.light</Code>), so components never branch on the theme. Themes can be scoped to any
          subtree, as below. In Figma they are the two modes of the <Code>Semantic</Code> variable
          collection.
        </p>
      }
    >
      <DocSection title="Side by side">
        <div className="grid gap-6 lg:grid-cols-2">
          {themes.map((theme) => (
            <Sample key={theme} theme={theme} />
          ))}
        </div>
      </DocSection>
      <DocSection title="Switching themes">
        <pre
          tabIndex={0}
          className="overflow-x-auto rounded-card border border-border bg-muted/40 p-5 font-mono text-code focus-ring"
        >
          {`import { ThemeToggle, setDocumentTheme } from "@cesuain/ui";

// A ready-made control. It remembers the choice in localStorage ("theme" key).
<ThemeToggle />

// Or switch programmatically. Sets data-theme on <html>.
setDocumentTheme("light");`}
        </pre>
      </DocSection>
    </DocPage>
  ),
};
