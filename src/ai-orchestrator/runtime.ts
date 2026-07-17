import "server-only";
import { InMemoryAiRateGuard, LifeNavigatorAi, NoopTelemetry, createHttpSharedAiRateGuard, createResponsesApiTransport, type AiRateGuard, type EventCandidate } from "@/ai-orchestrator";
import { activeEventPacks } from "@/event-packs/registry";

const localGuard = new InMemoryAiRateGuard();

/** Only facts from runtime-validated packs may be offered to the model boundary. */
export function getReviewedAiCandidates(): readonly EventCandidate[] {
  return activeEventPacks.flatMap((pack) =>
    pack.id === "expecting_child" || pack.id === "job_loss" ? [{ id: pack.id, facts: pack.facts }] : []
  );
}

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
