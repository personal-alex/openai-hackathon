import { expect, test } from "@playwright/test";

async function beginScenario(page: import("@playwright/test").Page, statement: string) {
  await page.goto("/");
  await expect(page.getByTestId("seeded-ai-boundary")).toBeVisible();
  await page.getByLabel("What happened?").fill(statement);
  await page.getByRole("button", { name: /continue/i }).click();
  await page.getByRole("button", { name: /continue to questions/i }).click();
}

test("guides the seeded job-loss scenario while keeping the compiler roadmap visible", async ({ page }) => {
  await beginScenario(page, "I lost my job");

  await expect(page.getByRole("heading", { name: "Let’s map what comes next." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Your next considerations" })).toBeVisible();
  await page.getByRole("button", { name: "Yes, use a planning date" }).click();

  await expect(page.getByRole("status")).toContainText("Roadmap updated");
  await expect(page.getByText("Shape a planning timeline")).toBeVisible();
  await expect(page.getByText("New", { exact: true })).toBeVisible();
  await page.locator(".task-details summary").first().click();
  await expect(page.getByText("Source provenance:").first()).toBeVisible();
});

test("retains confirmation and optional acknowledgement in the seeded expecting-child flow", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "I’m expecting a child" }).click();
  await page.getByRole("button", { name: /continue/i }).click();
  await expect(page.getByRole("heading", { name: "We heard: Expecting a child." })).toBeVisible();
  await page.getByRole("button", { name: /continue to questions/i }).click();
  await expect(page.getByRole("heading", { name: /Congratulations/ })).toBeVisible();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "I’m not sure yet" }).click();
  await expect(page.getByRole("button", { name: "Yes, add a checklist" })).toBeVisible();
});

test("works at a narrow mobile viewport with keyboard-reachable flow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Start with what changed." })).toBeVisible();
  await page.getByLabel("What happened?").press("Tab");
  await expect(page.getByRole("button", { name: /continue/i })).toBeFocused();
});
