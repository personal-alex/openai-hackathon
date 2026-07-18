import { expect, test } from "@playwright/test";
import { mockLiveClassifier } from "./classifier";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => { localStorage.clear(); sessionStorage.clear(); });
  await mockLiveClassifier(page);
});

async function enterWorkspace(page: import("@playwright/test").Page, statement: string) {
  await page.goto("/");
  await page.getByRole("button", { name: "Skip intro" }).click();
  await page.getByLabel("What happened?").fill(statement);
  await page.locator(".conversation-composer").getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByText("Is that right?")).toBeVisible();
  await page.getByRole("button", { name: "Yes, that’s right" }).click();
}

test("moves event understanding into the conversation and keeps a sparse route visible", async ({ page }) => {
  await enterWorkspace(page, "I lost my job");
  await expect(page.getByRole("heading", { name: "Your route" })).toBeVisible();
  const question = page.getByRole("heading", { name: /Has your employment already ended/i });
  await expect(question).toBeVisible();
  await expect(question.locator("xpath=ancestor::article")).toHaveClass(/assistant-message--question/);
  await expect(page.locator(".answer-list--replies .answer-button--reply").first()).toBeVisible();
  await page.getByRole("button", { name: "My employment has ended" }).click();
  await expect(page.locator(".user-message--answer")).toHaveText("My employment has ended");
  await expect(page.getByText("Your plan changed.")).toBeVisible();
  await expect(page.getByRole("button", { name: /Open details for/i }).first()).toBeVisible();
});

test("keeps the active question visible and surfaces newly added validated route tasks", async ({ page }) => {
  await enterWorkspace(page, "I lost my job");
  await page.getByRole("button", { name: "My employment has ended" }).click();
  await page.getByRole("textbox", { name: /date your employment ended/i }).fill("2026-07-17");
  await page.locator(".answer-list--typed-reply").getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Salaried" }).click();
  await page.getByRole("button", { name: "No, not yet" }).click();

  const currentQuestion = page.getByRole("heading", { name: /written confirmation of how and when employment ended/i });
  await expect(currentQuestion).toBeInViewport();
  expect(await page.locator(".conversation-thread").evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  await expect(page.getByRole("button", { name: "Open details for Review Employment Service registration" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Open details for Review the official unemployment-claim route" })).toBeVisible();
});

test("uses only the assistant welcome and catalog-provided human confirmation copy", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Skip intro" }).click();
  await expect(page.getByRole("heading", { name: "Tell us what changed." })).toHaveCount(0);
  await expect(page.getByText("Tell me what changed. I’ll help you organize the next steps and what can wait.")).toHaveCount(1);
  await page.getByLabel("What happened?").fill("I lost my job");
  await page.locator(".conversation-composer").getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByText("It sounds like you lost your job. I can help organize the immediate steps and what can wait. Is that right?")).toBeVisible();
  await expect(page.getByText(/reviewed event pack|catalog|runtime|deterministic/i)).toHaveCount(0);
  await page.getByRole("button", { name: "Choose a different event" }).click();
  await page.getByLabel("What happened?").fill("I’m expecting a child");
  await page.locator(".conversation-composer").getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByText("It sounds like you’re expecting a child. I can help organize what may be ahead and what can wait. Is that right?")).toBeVisible();
});

test("renders typed answers as a compact inline reply composer", async ({ page }) => {
  await enterWorkspace(page, "I lost my job");
  await page.getByRole("button", { name: "My employment has ended" }).click();
  const typedReply = page.locator(".answer-list--typed-reply");
  await expect(typedReply).toBeVisible();
  await expect(typedReply.locator("input")).toBeVisible();
  await expect(page.getByText("Why are we asking this?")).toBeVisible();
});

test("opens route detail with reviewed source metadata and returns focus on Escape", async ({ page }) => {
  await enterWorkspace(page, "I lost my job");
  await page.getByRole("button", { name: "My employment has ended" }).click();
  const routeItem = page.getByRole("button", { name: /Open details for/i }).first();
  await routeItem.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByText("Planning support, not an eligibility determination.")).toBeVisible();
  await expect(page.getByRole("dialog").getByText("When ready")).toBeVisible();
  await expect(page.getByRole("dialog")).not.toContainText(/job_loss\.timing\./);
  const source = page.getByRole("dialog").getByRole("link", { name: /Open source/i }).first();
  await expect(source).toHaveAttribute("target", "_blank");
  await expect(page.getByRole("dialog").getByText(/reviewed \d{4}-\d{2}-\d{2}/).first()).toBeVisible();
  await page.getByRole("button", { name: /Local status: not started/i }).click();
  await expect(page.getByRole("button", { name: /Local status: reviewed/i })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(routeItem).toBeFocused();
});

test("keeps the approved expecting-child route generic and supports its after-birth transition", async ({ page }) => {
  await enterWorkspace(page, "We’re having a baby");
  await page.getByRole("button", { name: "Not yet" }).click();
  await expect(page.getByRole("button", { name: /Open details for/i }).first()).toBeVisible();
  await page.getByRole("button", { name: /The child has now been born/i }).click();
  await expect(page.getByRole("button", { name: "Yes, in Israel" })).toBeVisible();
});

test("does not let model-returned facts skip a decision-changing question", async ({ page }) => {
  await page.route("**/api/ai/extract-event", async (route) => {
    await route.fulfill({ contentType: "application/json", status: 200, body: JSON.stringify({ kind: "classified", classification: { eventId: "expecting_child", facts: [{ factId: "event_stage", value: "birth_occurred" }] } }) });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Skip intro" }).click();
  await page.getByLabel("What happened?").fill("We’re having a baby!");
  await page.locator(".conversation-composer").getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Yes, that’s right" }).click();
  await expect(page.getByRole("heading", { name: "Has the child already been born?" })).toBeVisible();
});

test("keeps conversation first on mobile with a route jump for the single-column layout", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Skip intro" }).click();
  await expect(page.getByText("Tell me what changed. I’ll help you organize the next steps and what can wait.")).toBeVisible();
  await page.getByRole("link", { name: "View your route" }).click();
  await expect(page.getByRole("heading", { name: "Your plan will take shape here." })).toBeInViewport();
});

test("shows a neutral clarification when live classification cannot support the statement", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Skip intro" }).click();
  await page.getByLabel("What happened?").fill("I need help with something else");
  await page.locator(".conversation-composer").getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.locator(".conversation-composer").getByRole("alert")).toContainText("I’m not yet sure which supported event this is");
  await expect(page.getByRole("heading", { name: "Your plan will take shape here." })).toBeVisible();
});

test("the seeded demo query still uses the live classification route", async ({ page }) => {
  const classifier = await mockLiveClassifier(page);
  await page.goto("/?demo=seeded");
  await page.getByLabel("What happened?").fill("I lost my job");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByText("Is that right?")).toBeVisible();
  expect(classifier.calls).toEqual(["I lost my job"]);
});
