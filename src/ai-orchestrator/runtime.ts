import "server-only";
import { InMemoryAiRateGuard, LifeNavigatorAi, NoopTelemetry, createHttpSharedAiRateGuard, createResponsesApiTransport, type AiRateGuard, type EventCandidate } from "@/ai-orchestrator";

const localGuard = new InMemoryAiRateGuard();

/** No reviewed packs exist yet. Routes fail closed until a future approved registry supplies candidates. */
export function getReviewedAiCandidates(): readonly EventCandidate[] { return []; }

export function getServerAi(): LifeNavigatorAi {
  const apiKey = process.env.OPENAI_API_KEY;
  const deployed = Boolean(process.env.VERCEL_ENV);
  const sharedGuardUrl = process.env.AI_SHARED_GUARD_URL;
  const sharedGuardToken = process.env.AI_SHARED_GUARD_TOKEN;
  const guard: AiRateGuard = deployed && sharedGuardUrl && sharedGuardToken ? createHttpSharedAiRateGuard(sharedGuardUrl, sharedGuardToken) : localGuard;
  // A deployed live call is fail-closed unless a trusted shared guard is configured.
  const allowLiveCalls = !deployed || Boolean(sharedGuardUrl && sharedGuardToken);
  return new LifeNavigatorAi(apiKey && allowLiveCalls ? createResponsesApiTransport(apiKey, process.env.OPENAI_MODEL ?? "gpt-5.6") : undefined, guard, NoopTelemetry);
}
