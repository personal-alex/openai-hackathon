import { expect, test } from "@playwright/test";

async function openLanding(page: import("@playwright/test").Page) {
  await page.goto("/");
  await expect(page.getByTestId("landing-intro")).toBeVisible();
  await page.getByRole("button", { name: "Skip intro" }).click();
  await expect(page.getByTestId("landing-intro")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Tell us what changed." })).toBeVisible();
}

async function beginScenario(page: import("@playwright/test").Page, statement: string) {
  await openLanding(page);
  await expect(page.getByTestId("seeded-ai-boundary")).toBeVisible();
  await page.getByLabel("What happened?").fill(statement);
  await page.getByRole("button", { name: /continue/i }).click();
  await page.getByRole("button", { name: /continue to questions/i }).click();
}

async function beginExpectingChild(page: import("@playwright/test").Page) {
  await openLanding(page);
  await page.getByLabel("What happened?").fill("I’m expecting a child");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByRole("heading", { name: "We heard: Expecting a child." })).toBeVisible();
  await page.getByRole("button", { name: /continue to questions/i }).click();
}

test("presents a first-load intro and immediately reaches the keyboard-ready landing page when skipped", async ({ page }) => {
  await openLanding(page);
  await expect(page.getByLabel("What happened?")).toBeFocused();
});

test("moves directly to the landing page when reduced motion is requested", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Tell us what changed." })).toBeVisible();
  await expect(page.getByTestId("landing-intro")).toHaveCount(0);
});

test("guides the seeded job-loss scenario while keeping the compiler roadmap visible", async ({ page }) => {
  await beginScenario(page, "I lost my job");

  await expect(page.getByRole("heading", { name: "Let’s map what comes next." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Your next considerations" })).toBeVisible();
  await page.getByRole("button", { name: "Yes, use a planning date" }).click();

  await expect(page.getByRole("status")).toContainText("Roadmap updated");
  await expect(page.getByText("Shape a planning timeline")).toBeVisible();
  await expect(page.getByText("New", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /Toggle details for/i }).first().click();
  await expect(page.getByText("Synthetic UI demonstration only — not policy content.").first()).toBeVisible();
});

test("guides the approved expecting-child routine path with catalog-derived source details", async ({ page }) => {
  await beginExpectingChild(page);
  await expect(page.getByText(/Congratulations\. Tell us a little about where you are/i)).toBeVisible();
  await page.getByRole("button", { name: "Yes, the child has been born" }).click();
  await page.getByRole("button", { name: "Yes, in Israel" }).click();
  await page.getByRole("button", { name: "Yes, in an Israeli hospital" }).click();
  await page.getByRole("button", { name: "Yes, routine birth path" }).click();
  await page.getByRole("button", { name: "Yes", exact: true }).click();
  await expect(page.getByText("Register the newborn — Population and Immigration Authority")).toBeVisible();
  await expect(page.getByText("Get a birth certificate")).toBeVisible();
  const toggle = page.getByRole("button", { name: /Toggle details for Register the newborn/i });
  await toggle.click();
  await expect(page.getByRole("link", { name: /Open source \(external\)/i }).first()).toHaveAttribute("href", "https://www.gov.il/BlobFolder/policy/birth_registry_in_israel_procedure/he/2.2.0001.pdf");
  await page.locator("#task-details-ec_register_newborn_population_registry").getByRole("button", { name: /Local status: not started/i }).click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
});

test("replaces the routine roadmap with the bounded birth-abroad route", async ({ page }) => {
  await beginExpectingChild(page);
  await page.getByRole("button", { name: "Yes, the child has been born" }).click();
  await page.getByRole("button", { name: "No, outside Israel" }).click();
  await expect(page.getByText("Verify the official route for registering a child born outside Israel")).toBeVisible();
  await expect(page.getByText("Register the newborn — Population and Immigration Authority")).not.toBeVisible();
  await page.getByRole("button", { name: /Toggle details for Verify the official route/i }).click();
  await expect(page.locator("#task-details-ec_verify_birth_abroad_registration").getByText(/separate official process/i)).toBeVisible();
  await page.getByRole("button", { name: "Reset local demo" }).click();
  await expect(page.getByRole("heading", { name: "Tell us what changed." })).toBeVisible();
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

test("offers an after-birth preview and upgrades it only after explicit birth confirmation", async ({ page }) => {
  await beginExpectingChild(page);
  await page.getByRole("button", { name: "Not yet" }).click();
  await expect(page.getByText("Preview · After birth")).toBeVisible();
  await expect(page.getByText(/planning previews, not current required actions/i)).toBeVisible();
  const toggle = page.getByRole("button", { name: /Toggle details for Register the newborn/i });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await toggle.press("Space");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  const sourceLink = page.getByRole("link", { name: /Open source \(external\)/i }).first();
  await sourceLink.evaluate((element) => element.addEventListener("click", (event) => event.preventDefault(), { once: true }));
  await sourceLink.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("button", { name: /The child has now been born/i }).click();
  await expect(page.getByRole("status")).toContainText("Roadmap updated");
  await expect(page.getByText("Preview · After birth")).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Yes, in Israel" })).toBeVisible();
});

test("works at a narrow mobile viewport with keyboard-reachable flow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openLanding(page);
  await page.getByLabel("What happened?").press("Tab");
  await expect(page.getByRole("button", { name: /continue/i })).toBeFocused();
});
