import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => { await page.addInitScript(() => { localStorage.clear(); sessionStorage.clear(); }); });

test("shows the motto on a standard no-plan visit and Continue opens the workspace", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("landing-intro")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Life doesn’t come with instructions. Now it does." })).toBeVisible();
  await page.getByTestId("landing-intro").getByRole("button", { name: "Continue" }).click();
  await expect(page.getByTestId("landing-intro")).toHaveCount(0);
  await expect(page.getByLabel("What happened?")).toBeFocused();
});

test("Skip intro remains an immediate keyboard-accessible exit", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Skip intro" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("landing-intro")).toHaveCount(0);
  await expect(page.getByLabel("What happened?")).toBeFocused();
});

test("reduced motion presents the completed statement and an explicit Continue action", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByTestId("landing-intro")).toBeVisible();
  await expect(page.getByTestId("landing-intro-second-line")).toHaveClass(/is-visible/);
  await page.getByTestId("landing-intro").getByRole("button", { name: "Continue" }).click();
  await expect(page.getByLabel("What happened?")).toBeFocused();
});

test("does not replay the intro after a local reset in the same browser session", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Skip intro" }).click();
  await page.getByLabel("What happened?").fill("I lost my job");
  await page.locator(".conversation-composer").getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Yes, that’s right" }).click();
  await page.getByRole("button", { name: "Reset local demo" }).click();
  await expect(page.getByTestId("landing-intro")).toHaveCount(0);
  await expect(page.getByLabel("What happened?")).toBeFocused();
});

test("the explicit seeded demo query bypasses the intro deterministically", async ({ page }) => {
  await page.goto("/?demo=seeded");
  await expect(page.getByTestId("landing-intro")).toHaveCount(0);
  await expect(page.getByTestId("seeded-ai-boundary")).toBeVisible();
});
