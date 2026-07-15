import "server-only";
import { InMemoryAiRateGuard, LifeNavigatorAi, NoopTelemetry, createResponsesApiTransport, type EventCandidate } from "@/ai-orchestrator";

const localGuard = new InMemoryAiRateGuard();

/** No reviewed packs exist yet. Routes fail closed until a future approved registry supplies candidates. */
export function getReviewedAiCandidates(): readonly EventCandidate[] { return []; }

export function getServerAi(): LifeNavigatorAi {
  const apiKey = process.env.OPENAI_API_KEY;
  // Deployed live calls remain disabled until a shared server-side guard adapter is configured.
  const allowLocalLiveCalls = !process.env.VERCEL_ENV;
  return new LifeNavigatorAi(apiKey && allowLocalLiveCalls ? createResponsesApiTransport(apiKey, process.env.OPENAI_MODEL ?? "gpt-5.6") : undefined, localGuard, NoopTelemetry);
}
