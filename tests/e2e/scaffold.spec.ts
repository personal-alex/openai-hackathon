import { expect, test } from "@playwright/test";

test("switches between deterministic seeded scenarios", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Expecting a child" })).toBeVisible();
  await page.getByRole("button", { name: "Job loss" }).click();
  await expect(page.getByRole("heading", { name: "Job loss" })).toBeVisible();
});
