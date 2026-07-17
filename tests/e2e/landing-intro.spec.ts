import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => { await page.addInitScript(() => { localStorage.clear(); sessionStorage.clear(); }); });

test("offers an immediate accessible intro exit into the Action Route workspace", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("landing-intro")).toBeVisible();
  await page.getByRole("button", { name: "Skip intro" }).click();
  await expect(page.getByTestId("landing-intro")).toHaveCount(0);
  await expect(page.getByLabel("What happened?")).toBeFocused();
});

test("reduced motion renders the workspace without requiring the intro animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByTestId("landing-intro")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Tell us what changed." })).toBeVisible();
});

test("does not replay the intro after a local reset in the same browser session", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Skip intro" }).click();
  await page.getByLabel("What happened?").fill("I lost my job");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Yes, that’s right" }).click();
  await page.getByRole("button", { name: "Reset local demo" }).click();
  await expect(page.getByTestId("landing-intro")).toHaveCount(0);
  await expect(page.getByLabel("What happened?")).toBeFocused();
});
