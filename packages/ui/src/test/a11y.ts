import axe, { type RunOptions } from "axe-core";
import { expect } from "vitest";

const options: RunOptions = {
  rules: {
    // jsdom has no layout or computed colors; contrast is enforced at the token level instead.
    "color-contrast": { enabled: false },
    // Components render in isolation, not inside page landmarks.
    region: { enabled: false },
  },
};

/** Runs axe-core against a rendered subtree and fails with readable violations. */
export async function expectNoA11yViolations(container: Element = document.body) {
  const results = await axe.run(container, options);
  const violations = results.violations.map(
    (v) =>
      `${v.id} (${v.impact}): ${v.help}\n    ${v.nodes.map((n) => n.target.join(" ")).join("\n    ")}`,
  );
  expect(violations, violations.join("\n")).toEqual([]);
}
