import { expect, test } from "@playwright/test";

async function openExpectingChildGuidedFlow(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Skip intro" }).click();
  await page.getByLabel("What happened?").fill("I’m expecting a child");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: /continue to questions/i }).click();
}

test("keeps the allowlisted question rationale one keyboard-accessible action away", async ({ page }) => {
  await openExpectingChildGuidedFlow(page);

  const rationale = page.getByText("Why are we asking this?");
  await rationale.focus();
  await rationale.press("Enter");
  await expect(page.locator(".why-ask")).toHaveAttribute("open", "");
});

test("renders generic roadmap groups, task inspection, source metadata, local status, and change summary", async ({ page }) => {
  await openExpectingChildGuidedFlow(page);
  await page.getByRole("button", { name: "Yes, the child has been born" }).click();
  await expect(page.locator(".roadmap-change-summary")).toContainText("Your plan changed");
  await page.getByRole("button", { name: "Yes, in Israel" }).click();
  await page.getByRole("button", { name: "Yes, in an Israeli hospital" }).click();
  await page.getByRole("button", { name: "Yes, routine birth path" }).click();
  await page.getByRole("button", { name: "Yes", exact: true }).click();

  await expect(page.locator(".timing-group").first()).toBeVisible();
  const taskCard = page.locator(".roadmap-panel .task-card").first();
  const taskToggle = taskCard.locator(".task-card-toggle");
  await taskToggle.click();
  const details = taskCard.locator(".task-details-content");
  await expect(details.getByRole("heading", { name: "What to do" })).toBeVisible();
  await expect(details.getByRole("heading", { name: "Why this is on the plan" })).toBeVisible();
  await expect(details.getByRole("heading", { name: "What may change it" })).toBeVisible();
  await expect(details.getByRole("link", { name: /Open source \(external\)/i }).first()).toHaveAttribute("target", "_blank");
  await details.getByRole("button", { name: /Local status: not started/i }).click();
  await expect(details.getByRole("button", { name: /Local status: reviewed/i })).toBeVisible();
});
