import {
  Controls,
  Description,
  Primary,
  Stories,
  Subtitle,
  Title,
  useOf,
} from "@storybook/addon-docs/blocks";

import componentMap from "../../../docs/figma/component-map.json";

const byStorybookTitle = new Map(
  Object.entries(componentMap.components).map(([dir, entry]) => [
    entry.storybook,
    { dir, ...entry },
  ]),
);

/** Links a component's Docs page to its Figma component set and source folder. */
function DesignReference() {
  const { preparedMeta } = useOf("meta", ["meta"]);
  const entry = byStorybookTitle.get(preparedMeta.title);
  if (!entry) return null;
  return (
    <p
      className="sb-unstyled"
      style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem 1.5rem", fontSize: 14 }}
    >
      <a
        href={entry.figmaUrl}
        target="_blank"
        rel="noreferrer"
        style={{ color: "inherit", textDecoration: "underline" }}
      >
        Figma: {entry.name} component set<span style={visuallyHidden}>, opens in a new tab</span>
      </a>
      <span>
        Source: <code>packages/ui/src/components/{entry.dir}</code>
      </span>
    </p>
  );
}

const visuallyHidden = {
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
} as const;

/** Storybook's default autodocs layout plus the design reference under the title. */
export function DocsPage() {
  return (
    <>
      <Title />
      <Subtitle />
      <DesignReference />
      <Description />
      <Primary />
      <Controls />
      <Stories />
    </>
  );
}
