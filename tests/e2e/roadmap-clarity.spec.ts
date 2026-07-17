import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => { await page.addInitScript(() => { localStorage.clear(); sessionStorage.clear(); }); });

test("renders one validated question in conversation and keeps rationale one action away", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Skip intro" }).click();
  await page.getByLabel("What happened?").fill("I lost my job");
  await page.locator(".conversation-composer").getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Yes, that’s right" }).click();
  const rationale = page.getByText("Why are we asking this?");
  await rationale.focus();
  await rationale.press("Enter");
  await expect(page.locator(".why-ask")).toHaveAttribute("open", "");
});

test("restores a valid local planning session without replaying the intro", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("life-navigator.seeded-plan.v1", JSON.stringify({ version: 1, scenarioId: "job_loss", statement: "I lost my job", context: { facts: {} }, progress: { progressStatusByTaskId: {} }, state: "planning" })));
  await page.goto("/");
  await expect(page.getByTestId("landing-intro")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Your route" })).toBeVisible();
});
