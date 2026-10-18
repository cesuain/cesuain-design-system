# ADR 0005: Code is the source of truth; Figma is updated one way

- **Status:** Accepted
- **Date:** 2026-10-18

## Context

The Figma library must match code: variables, styles and a component set per component. The Figma MCP server can create and edit nodes through the Plugin API, but there is no automatic two-way synchronization, and the team's file is on the Starter plan.

## Decision

- Tokens flow **code → Figma** only. `pnpm tokens:build` emits `json/figma-variables.json`, which an agent with the Figma MCP server applies to the file.
- Components are built in Figma to mirror the code API: variant properties equal the cva variants. The links between them are recorded in `docs/figma/component-map.json`, using node IDs returned by the Figma API.
- READMEs, the component index and Storybook Docs pages read their Figma links from that map, and `pnpm docs:check` keeps it complete.
- Plan constraints are handled explicitly:
  - three pages (boards group components);
  - one mode per collection (separate **Theme** and **Theme (Light)** collections).

## Consequences

- Design edits made in Figma must be ported to code by hand, then pushed back to Figma.
- Nothing claims to synchronize automatically.
- `docs:check` cannot detect a node deleted in Figma; that needs a Figma-connected audit.
- Upgrading the Figma plan would allow one Theme collection with two modes. `figma-variables.json` already describes it that way.
