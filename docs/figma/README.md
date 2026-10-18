# Figma library

**File:** [Cesuain Design System](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb) (`WujcogDvZk4Ds73gHwmvDb`)

The file is the design counterpart of `@cesuain/tokens` and `@cesuain/ui`. It was built through the Figma MCP server (Plugin API). Every node ID below and in [`component-map.json`](./component-map.json) was returned by the Figma API; none were typed by hand.

## Organization

The file has three pages. The Figma Starter plan allows only three pages per file, so related content is grouped into large boards rather than one page per component.

| Page                      | Contents                                                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 00 — Cover                | [Cover](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=5-138): name, version (1.0.0), status (Stable), maintainer. |
| 01 — Foundations & Tokens | One board per foundation, rendered from the variables and styles.                                                               |
| 02 — Components           | One board per category; each holds a native component set per component.                                                        |

### Foundation boards

| Board             | Node                                                                           |
| ----------------- | ------------------------------------------------------------------------------ |
| Colors            | [`6:2`](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=6-2)       |
| Typography        | [`9:2`](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=9-2)       |
| Spacing           | [`10:2`](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=10-2)     |
| Radius            | [`10:266`](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=10-266) |
| Shadows           | [`10:339`](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=10-339) |
| Layout            | [`12:2`](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=12-2)     |
| Motion            | [`12:160`](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=12-160) |
| Iconography       | [`12:226`](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=12-226) |
| Themes & Contrast | [`12:364`](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=12-364) |

### Component boards

| Board        | Node                                                                           | Component sets                                                                                                              |
| ------------ | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Actions      | [`14:2`](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=14-2)     | Button, Icon Button, Button Group, Toggle, Toggle Group                                                                     |
| Forms        | [`15:179`](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=15-179) | Label, Input, Textarea, Input Group, Checkbox, Radio Group, Switch, Slider, Menu Item, Select, Combobox, Field, Date Picker |
| Navigation   | [`18:292`](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=18-292) | Tabs, Segmented Control, Link, Breadcrumb, Pagination, Navigation Menu, Menubar, Sidebar                                    |
| Feedback     | [`20:367`](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=20-367) | Alert, Alert Dialog, Toast, Progress, Skeleton, Spinner, Empty State                                                        |
| Overlays     | [`23:412`](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=23-412) | Dialog, Sheet, Drawer, Popover, Tooltip, Dropdown Menu, Context Menu, Hover Card                                            |
| Data Display | [`24:507`](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=24-507) | Card, Badge, Avatar, Separator, Kbd, Accordion, Collapsible, Table, Data Table, Calendar, Command, Scroll Area              |
| Layout       | [`26:581`](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=26-581) | Container, Stack, Grid, Section, Page Header, Surface, Content Wrapper                                                      |
| Patterns     | [`27:593`](https://www.figma.com/design/WujcogDvZk4Ds73gHwmvDb?node-id=27-593) | Section Heading, Stat Card, Feature Card, Timeline, Theme Toggle                                                            |

The per-component node for every one of the 64 components is in [`component-map.json`](./component-map.json), the [component index](../component-index.md) and each component's README. **Menu Item** (`16:262`) is a shared Figma primitive with no package export of its own. It mirrors the `menuItem` recipe in `packages/ui/src/lib/styles.ts` and is reused by the Select, Combobox, Dropdown Menu, Context Menu, Menubar and Command sets.

## Conventions

- **Names match code.** Component sets use the Storybook name (`Navigation Menu`); variant properties mirror the React props (`Variant=Outline, Size=md`); `State` documents interaction states (Hover, Focus, Disabled, Open) that are CSS states in code, not props.
- **Descriptions.** Each component set's description states the code API, the Storybook title and the source folder (`Code: packages/ui/src/components/<name>`).
- **Bindings.** Fills, strokes, radii, paddings, gaps and fixed widths are bound to variables; text uses the shared text styles; elevation uses the effect styles. Deliberate exceptions are pixel geometry of icons and illustrative content (sample data, guides on the Layout board).
- **Icons** are local components (`Icon/<LucideName>`, 24px grid, 2px stroke) swapped through an `Icon` instance-swap property.
- **Focus** is shown as a `ring/default` outline, matching the `focus-ring` utility (`outline: var(--cds-focus-width) solid var(--ring)`). Form fields add the 20% ring halo they use in code. **Disabled** is 50% opacity, matching `disabled:opacity-50`.

## Variables and styles

| Collection    | Modes          | Contents                                                                                                                                         |
| ------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Primitives    | Value          | Raw palette, spacing, radius, size and font scales. Colors have no scopes, so they stay out of pickers; dimensions are scoped to their property. |
| Theme         | Dark (default) | Semantic colors aliased to primitives for the dark theme.                                                                                        |
| Theme (Light) | Light          | The same semantic colors for the light theme.                                                                                                    |
| Semantic      | Value          | Component and layout dimensions (control heights, paddings, radii, gaps).                                                                        |

Counts: 164 primitives, 53 theme colors per theme, 41 semantic dimensions. All variables carry WEB code syntax (`var(--card)`, `var(--cds-radius-card)`) and explicit scopes; none use `ALL_SCOPES`. Text styles (`text/*`, 18) and effect styles (`dark/elevation/*`, `light/elevation/*`, `shadow/glow/*`, 11) match the Tailwind utilities `text-*` and `shadow-*`. The full token ↔ CSS ↔ Tailwind ↔ Figma mapping is generated in [`docs/foundations/generated/mapping.md`](../foundations/generated/mapping.md).

## Synchronization (code → Figma, one way)

Code is the source of truth. **Nothing synchronizes automatically.** Edits made in Figma do not flow back to code, and code changes do not reach Figma until someone runs the steps below.

1. Change tokens in `packages/tokens/src` and run `pnpm tokens:build`. This regenerates `packages/tokens/json/figma-variables.json`: collections and variables (with aliases, scopes, descriptions and the CSS variable used as WEB code syntax), text styles and effect styles. The JSON describes **Theme** as one collection with Dark and Light modes; on the Starter plan it is applied as two collections (see Plan constraints).
2. With the Figma MCP server connected, ask an agent to apply `figma-variables.json` to the file. It updates existing variables and styles by name and creates missing ones, and must not delete anything it cannot match.
3. When a component's API changes, update its component set: variants mirror the cva variants in `*.variants.ts` or the component file.
4. Run `pnpm docs:generate` if node IDs or component names changed, then update `component-map.json` from the IDs the Figma API returned.
5. Spot-check the affected boards with screenshots.

`pnpm docs:check` verifies that every component directory has an entry in `component-map.json` with a well-formed node ID and the right Storybook title. It cannot verify that the node still exists in Figma, which needs Figma access.

## Plan constraints

- **Starter plan:** three pages per file, and one mode per variable collection. The light theme therefore lives in a separate **Theme (Light)** collection instead of a second mode of **Theme**. To preview a component in light mode, rebind or swap the collection. A paid plan allows merging them into one two-mode collection.
- **Motion tokens** (durations, easings) are not exported as Figma variables, because Figma variables have no duration or easing type. They are documented on the Motion board.
- **Composite typography and shadows** are styles, not variables, as Figma requires.
- **Gradient stops** are bound to the `gradient/*` variables. Paint opacity on bound colors is set explicitly; Figma resets it when a variable is first bound.
- **No file thumbnail.** Setting the file thumbnail is not supported by the MCP Plugin API, so the cover is not set as the thumbnail.
- **Code links.** Component descriptions and this index link Figma to code; Code Connect is not used.
- **States as variants.** Interaction states are documented as variants rather than prototype flows.
