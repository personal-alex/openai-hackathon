import { expect, test } from "@playwright/test";
import { mockLiveClassifier } from "./classifier";

test.beforeEach(async ({ page }) => { await page.addInitScript(() => { localStorage.clear(); sessionStorage.clear(); }); await mockLiveClassifier(page); });

test("shows the motto on a standard no-plan visit and opens the workspace automatically", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("landing-intro")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Life doesn’t come with instructions. Now it does." })).toBeVisible();
  await expect(page.getByTestId("landing-intro")).toHaveCount(0, { timeout: 7000 });
  await expect(page.getByLabel("What happened?")).toBeFocused();
});

test("Skip intro remains an immediate keyboard-accessible exit", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Skip intro" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("landing-intro")).toHaveCount(0);
  await expect(page.getByLabel("What happened?")).toBeFocused();
});

test("reduced motion presents the completed statement and keeps Skip intro available", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByTestId("landing-intro")).toBeVisible();
  await expect(page.getByTestId("landing-intro-second-line")).toHaveClass(/is-visible/);
  await page.getByTestId("landing-intro").getByRole("button", { name: "Skip intro" }).click();
  await expect(page.getByLabel("What happened?")).toBeFocused();
});

test("confirms a local reset and returns to the clean first-visit state", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Skip intro" }).click();
  await page.getByLabel("What happened?").fill("I lost my job");
  await page.locator(".conversation-composer").getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Yes, that’s right" }).click();
  await page.getByRole("button", { name: "Reset demo" }).click();
  await expect(page.getByRole("dialog", { name: "Start this demo again?" })).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("saved route, answers, and local progress");
  await page.getByRole("dialog").getByRole("button", { name: "Reset demo" }).click();
  await expect(page.getByTestId("landing-intro")).toBeVisible();
  await page.getByRole("button", { name: "Skip intro" }).click();
  await expect(page.getByLabel("What happened?")).toBeFocused();
});

test("replays the intro on a new no-plan page load", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Skip intro" }).click();
  await expect(page.getByTestId("landing-intro")).toHaveCount(0);
  await page.reload();
  await expect(page.getByTestId("landing-intro")).toBeVisible();
});

test("the explicit seeded demo query bypasses the intro deterministically", async ({ page }) => {
  await page.goto("/?demo=seeded");
  await expect(page.getByTestId("landing-intro")).toHaveCount(0);
  await expect(page.getByTestId("seeded-ai-boundary")).toBeVisible();
});
