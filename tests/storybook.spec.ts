import { readFileSync } from "node:fs";

import { expect, test } from "@playwright/test";

interface IndexEntry {
  id: string;
  title: string;
  type: "docs" | "story";
}

const componentMap = JSON.parse(
  readFileSync(new URL("../docs/figma/component-map.json", import.meta.url), "utf8"),
) as {
  fileUrl: string;
  components: Record<string, { name: string; storybook: string; figmaUrl: string }>;
};

const story = (id: string, globals = "") =>
  `/iframe.html?id=${id}&viewMode=story${globals ? `&globals=${globals}` : ""}`;

test("the built Storybook indexes a Docs page for every component", async ({ request }) => {
  const index = (await (await request.get("/index.json")).json()) as {
    entries: Record<string, IndexEntry>;
  };
  const docsTitles = new Set(
    Object.values(index.entries)
      .filter((entry) => entry.type === "docs")
      .map((entry) => entry.title),
  );
  const missing = Object.values(componentMap.components)
    .map((component) => component.storybook)
    .filter((title) => !docsTitles.has(title));
  expect(missing).toEqual([]);
});

test("component Docs pages link to their Figma component set", async ({ page }) => {
  const button = componentMap.components.button!;
  await page.goto("/iframe.html?id=components-actions-button--docs&viewMode=docs");
  const link = page.getByRole("link", { name: /Figma: Button component set/ });
  await expect(link).toHaveAttribute("href", button.figmaUrl);
});

test("the Introduction page links to the Figma file", async ({ page }) => {
  await page.goto(story("introduction--overview"));
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Design");
  await expect(
    page.getByRole("link", { name: /Open the Cesuain Design System file in Figma/ }),
  ).toHaveAttribute("href", componentMap.fileUrl);
});

test("theme switching changes the semantic colors", async ({ page }) => {
  const background = () =>
    page.evaluate(() => getComputedStyle(document.body).getPropertyValue("--background").trim());

  await page.goto(story("components-actions-button--default"));
  await expect(page.getByRole("button", { name: "Get started" })).toBeVisible();
  const dark = await background();

  await page.goto(story("components-actions-button--default", "theme:Light"));
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  const light = await background();

  expect(dark).not.toBe("");
  expect(light).not.toBe(dark);
});

test("a dialog traps focus and restores it on Escape", async ({ page }) => {
  // The Small story has no play function, so the dialog starts closed.
  await page.goto(story("components-overlays-dialog--small"));
  const trigger = page.getByRole("button", { name: "Start a project" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});
