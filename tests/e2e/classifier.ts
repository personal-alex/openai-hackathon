import type { Page } from "@playwright/test";

export async function mockLiveClassifier(page: Page): Promise<{ calls: string[] }> {
  const calls: string[] = [];
  await page.route("**/api/ai/extract-event", async (route) => {
    const body = route.request().postDataJSON() as { story?: unknown };
    const story = typeof body.story === "string" ? body.story : "";
    calls.push(story);
    const normalized = story.toLowerCase();
    const eventId = /expecting|pregnan|having.*baby|baby.*having/.test(normalized)
      ? "expecting_child"
      : /lost.*job|job.*lost|employment.*ended/.test(normalized)
        ? "job_loss"
        : /relocat.*(israel|america|u\.s\.|us|california)|moving.*(america|california)|offer.*states.*move|fianc.?.*american.*moving|long-term move.*united states/.test(normalized)
          ? "relocate_il_us"
          : null;
    await route.fulfill({ contentType: "application/json", status: 200, body: JSON.stringify(eventId ? { kind: "classified", classification: { eventId, facts: [] } } : { kind: "clarification", reason: "unsupported" }) });
  });
  return { calls };
}
