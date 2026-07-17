import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => { localStorage.clear(); sessionStorage.clear(); });
});

async function enterWorkspace(page: import("@playwright/test").Page, statement: string) {
  await page.goto("/");
  await page.getByRole("button", { name: "Skip intro" }).click();
  await page.getByLabel("What happened?").fill(statement);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByText("Is that right?")).toBeVisible();
  await page.getByRole("button", { name: "Yes, that’s right" }).click();
}

test("moves event understanding into the conversation and keeps a sparse route visible", async ({ page }) => {
  await enterWorkspace(page, "I lost my job");
  await expect(page.getByRole("heading", { name: "Your route" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Has your employment already ended/i })).toBeVisible();
  await page.getByRole("button", { name: "My employment has ended" }).click();
  await expect(page.getByText("Your plan changed.")).toBeVisible();
  await expect(page.getByRole("button", { name: /Open details for/i }).first()).toBeVisible();
});

test("opens route detail with reviewed source metadata and returns focus on Escape", async ({ page }) => {
  await enterWorkspace(page, "I lost my job");
  await page.getByRole("button", { name: "My employment has ended" }).click();
  const routeItem = page.getByRole("button", { name: /Open details for/i }).first();
  await routeItem.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByText("Planning support, not an eligibility determination.")).toBeVisible();
  const source = page.getByRole("dialog").getByRole("link", { name: /Open source/i }).first();
  await expect(source).toHaveAttribute("target", "_blank");
  await expect(page.getByRole("dialog").getByText(/reviewed \d{4}-\d{2}-\d{2}/).first()).toBeVisible();
  await page.getByRole("button", { name: /Local status: not started/i }).click();
  await expect(page.getByRole("button", { name: /Local status: reviewed/i })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(routeItem).toBeFocused();
});

test("keeps the approved expecting-child route generic and supports its after-birth transition", async ({ page }) => {
  await enterWorkspace(page, "I’m expecting a child");
  await page.getByRole("button", { name: "Not yet" }).click();
  await expect(page.getByRole("button", { name: /Open details for/i }).first()).toBeVisible();
  await page.getByRole("button", { name: /The child has now been born/i }).click();
  await expect(page.getByRole("button", { name: "Yes, in Israel" })).toBeVisible();
});

test("keeps conversation first on mobile with a route jump for the single-column layout", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Skip intro" }).click();
  await expect(page.getByRole("heading", { name: "Tell us what changed." })).toBeVisible();
  await page.getByRole("link", { name: "View your route" }).click();
  await expect(page.getByRole("heading", { name: "Your plan will take shape here." })).toBeInViewport();
});
