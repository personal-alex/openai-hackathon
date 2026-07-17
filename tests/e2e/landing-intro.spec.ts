import { expect, test } from "@playwright/test";

test("holds on the resolved first line before revealing the final statement", async ({ page }) => {
  await page.goto("/");
  const secondLine = page.getByTestId("landing-intro-second-line");

  await page.waitForTimeout(2_200);
  await expect(secondLine).not.toHaveClass(/is-visible/);

  await expect(secondLine).toHaveClass(/is-visible/, { timeout: 1_500 });
});

test("does not intercept the entry continue action after the intro is skipped", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Skip intro" }).click();
  await page.getByLabel("What happened?").fill("I’m expecting a child");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByRole("heading", { name: "We heard: Expecting a child." })).toBeVisible();
});

test("supports Escape as an accessible intro exit", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("landing-intro")).toHaveCount(0);
  await expect(page.getByLabel("What happened?")).toBeFocused();
});
