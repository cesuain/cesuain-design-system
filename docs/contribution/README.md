# Contribution guide

Detailed workflows for changing tokens, components, documentation and the Figma library. Start with [CONTRIBUTING.md](../../CONTRIBUTING.md) for setup and pull request rules.

## Change a token

1. Edit the source under `packages/tokens/src`. Choose the layer deliberately:
   - `primitives/`: raw values, never referenced by components;
   - `semantic/` and `themes/{dark,light}`: intent, aliasing primitives per theme;
   - `components/`: decisions shared by several components (control heights, overlay widths).
2. For a new foreground/background combination, add a pair to `src/meta/contrast.json` with its WCAG minimum (4.5 for text; 3 for large text, icons and focus indicators).
3. Run `pnpm tokens:build`. It validates, checks contrast in both themes and regenerates every output. Commit the generated files with the source change.
4. Update the Figma variables from `json/figma-variables.json` (see [Figma sync](../figma/README.md#synchronization-code--figma-one-way)).

Naming rules (`packages/tokens/scripts/lib/naming.ts`):

- semantic colors keep shadcn/ui CSS names (`color.card.default` → `--card`);
- everything else is `--cds-<path>`;
- Figma names are the path with `/`.

## Add a component

1. Create `packages/ui/src/components/<name>/` with:
   - `<name>.tsx`: implementation. Use semantic tokens only, `data-slot` attributes and `cn()`. Variants go in `cva`, in `<name>.variants.ts` when shared.
   - `<name>.test.tsx`: render, variants, interaction and keyboard, accessible names, disabled and error states, plus `expectNoA11yViolations()`.
   - `<name>.stories.tsx`: meta `title: "Components/<Category>/<Name>"` with `tags: ["autodocs"]`, a story per meaningful variant and state, and `play` functions for interactions.
   - `index.ts`: the public exports.
2. Export it from `packages/ui/src/index.ts`.
3. Build its component set in Figma. Mirror the variant props, bind variables and styles, and put the Storybook title and source path in the description.
4. Add `docs/figma/component-map.json → components.<name>` with the node ID **returned by the Figma API**, plus the summary and Figma properties. Never write an ID or URL you have not received from Figma.
5. Run `pnpm docs:generate` to write the README and update `docs/component-index.md`.
6. Run `pnpm docs:check`. It fails if any of the files, the barrel export, the map entry or the README is missing or stale.

## Update a component from shadcn/ui

Components are owned source, not a dependency, so upgrades are deliberate diffs:

1. Compare the upstream component in the [shadcn/ui repository](https://github.com/shadcn-ui/ui) with ours.
2. Port behavioural and accessibility fixes. Keep our token names, `cva` variants, `data-slot` values and shared recipes (`lib/styles.ts`).
3. Run the component's unit and story tests, then `pnpm run ci`.

## Documentation

- Component READMEs and `docs/component-index.md` are generated. Edit the generator (`scripts/lib/component-docs.ts`) or the map, not the output.
- Token docs in `docs/foundations/generated/` come from `pnpm tokens:build`.
- Foundation pages in Storybook (`apps/docs/src/foundations`) render from `@cesuain/tokens/json/docs.json`, so they update with the tokens.

## Releases

Versioning follows SemVer for `@cesuain/tokens` and `@cesuain/ui`, released together with the same version:

- **patch**: fixes with no API or visual-intent change;
- **minor**: new components, variants, props or tokens;
- **major**: removed or renamed exports, props or tokens, or changed token semantics.

Steps:

1. Update `CHANGELOG.md`.
2. Bump `version` in both package manifests and the root.
3. Update the version on the Figma cover.
4. Run `pnpm run ci`.
5. Tag `vX.Y.Z`.
6. Publish both packages: `pnpm --filter @cesuain/tokens --filter @cesuain/ui publish --access public`.
7. Update the `@cesuain/ui` version in cesarfonseca.dev and check that the site builds.
