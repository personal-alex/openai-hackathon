import { expect, test } from "@playwright/test";
import { mockLiveClassifier } from "./classifier";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => { localStorage.clear(); sessionStorage.clear(); });
  await mockLiveClassifier(page);
});

test("explains a local classifier limit without presenting it as an unsupported event", async ({ page }) => {
  await page.route("**/api/ai/extract-event", async (route) => {
    await route.fulfill({ contentType: "application/json", status: 429, body: JSON.stringify({ kind: "clarification", reason: "rate_limited" }) });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Skip intro" }).click();
  await page.getByLabel("What happened?").fill("We’re having a baby");
  await page.locator(".conversation-composer").getByRole("button", { name: "Continue", exact: true }).click();
  const error = page.locator(".conversation-composer").getByRole("alert");
  await expect(error).toContainText("local live-classifier session has reached its request limit");
  await expect(error).not.toContainText("not yet sure");
});
