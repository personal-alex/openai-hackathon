import { expect, test } from "@playwright/test";

test("holds on the resolved first line before revealing the final statement", async ({ page }) => {
  await page.goto("/");
  const secondLine = page.getByTestId("landing-intro-second-line");

  await page.waitForTimeout(2_200);
  await expect(secondLine).not.toHaveClass(/is-visible/);

  await expect(secondLine).toHaveClass(/is-visible/, { timeout: 1_500 });
});
