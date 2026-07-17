import { expect, test } from "@playwright/test";

async function beginScenario(page: import("@playwright/test").Page, statement: string) {
  await page.goto("/");
  await expect(page.getByTestId("seeded-ai-boundary")).toBeVisible();
  await page.getByLabel("What happened?").fill(statement);
  await page.getByRole("button", { name: /continue/i }).click();
  await page.getByRole("button", { name: /continue to questions/i }).click();
}

async function beginExpectingChild(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "I’m expecting a child" }).click();
  await page.getByRole("button", { name: /continue/i }).click();
  await page.getByRole("button", { name: /continue to questions/i }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
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
  await expect(page.getByText("Synthetic UI demonstration only — not policy content.").first()).toBeVisible();
});

test("guides the approved expecting-child routine path with catalog-derived source details", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "I’m expecting a child" }).click();
  await page.getByRole("button", { name: /continue/i }).click();
  await expect(page.getByRole("heading", { name: "We heard: Expecting a child." })).toBeVisible();
  await page.getByRole("button", { name: /continue to questions/i }).click();
  await expect(page.getByRole("heading", { name: /Congratulations/ })).toBeVisible();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Yes, the child has been born" }).click();
  await page.getByRole("button", { name: "Yes, in Israel" }).click();
  await page.getByRole("button", { name: "Yes, in an Israeli hospital" }).click();
  await page.getByRole("button", { name: "Yes, routine birth path" }).click();
  await page.getByRole("button", { name: "Yes", exact: true }).click();
  await expect(page.getByText("Register the newborn — Population and Immigration Authority")).toBeVisible();
  await expect(page.getByText("Get a birth certificate")).toBeVisible();
  await page.locator(".task-details summary").first().click();
  await expect(page.getByRole("link", { name: /Open official source/i }).first()).toHaveAttribute("href", "https://www.gov.il/BlobFolder/policy/birth_registry_in_israel_procedure/he/2.2.0001.pdf");
});

test("replaces the routine roadmap with the bounded birth-abroad route", async ({ page }) => {
  await beginExpectingChild(page);
  await page.getByRole("button", { name: "Yes, the child has been born" }).click();
  await page.getByRole("button", { name: "No, outside Israel" }).click();
  await expect(page.getByText("Verify the official route for registering a child born outside Israel")).toBeVisible();
  await expect(page.getByText("Register the newborn — Population and Immigration Authority")).not.toBeVisible();
  await page.locator(".task-details summary").first().click();
  await expect(page.getByText(/separate official process/i)).toBeVisible();
  await page.getByRole("button", { name: "Reset local demo" }).click();
  await expect(page.getByRole("heading", { name: "Start with what changed." })).toBeVisible();
});

test("covers non-hospital and conditional-name seeded paths", async ({ page }) => {
  await beginExpectingChild(page);
  await page.getByRole("button", { name: "Yes, the child has been born" }).click();
  await page.getByRole("button", { name: "Yes, in Israel" }).click();
  await page.getByRole("button", { name: "No, another setting" }).click();
  await expect(page.getByText("Verify the official registration and newborn-name route for a non-hospital birth")).toBeVisible();

  await page.getByRole("button", { name: "Reset local demo" }).click();
  await beginExpectingChild(page);
  await page.getByRole("button", { name: "Yes, the child has been born" }).click();
  await page.getByRole("button", { name: "Yes, in Israel" }).click();
  await page.getByRole("button", { name: "Yes, in an Israeli hospital" }).click();
  await page.getByRole("button", { name: "Yes, routine birth path" }).click();
  await page.getByRole("button", { name: "No", exact: true }).click();
  await expect(page.getByText("Register the child’s first name")).toBeVisible();
});

test("works at a narrow mobile viewport with keyboard-reachable flow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Start with what changed." })).toBeVisible();
  await page.getByLabel("What happened?").press("Tab");
  await expect(page.getByRole("button", { name: /continue/i })).toBeFocused();
});
