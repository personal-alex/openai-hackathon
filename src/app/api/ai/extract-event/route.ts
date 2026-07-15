import "server-only";
import { NextResponse } from "next/server";
import { getReviewedAiCandidates, getServerAi } from "@/ai-orchestrator/runtime";
import { isOpaqueSessionId } from "@/ai-orchestrator";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { story?: unknown; sessionId?: unknown } | null;
  if (!body || typeof body.story !== "string" || body.story.trim().length === 0 || body.story.length > 2_000 || typeof body.sessionId !== "string" || !isOpaqueSessionId(body.sessionId)) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  const trustedHeader = process.env.VERCEL_ENV ? process.env.LIFE_NAVIGATOR_TRUSTED_IP_HEADER : undefined;
  const clientIp = trustedHeader ? request.headers.get(trustedHeader) ?? undefined : undefined;
  const result = await getServerAi().extractEvent({ story: body.story, sessionId: body.sessionId, clientIp, candidates: getReviewedAiCandidates() });
  const status = result.kind === "fallback" && result.reason === "rate_limited" ? 429 : result.kind === "fallback" && result.reason === "catalog_unavailable" ? 503 : 200;
  return NextResponse.json(result, { status, headers: result.kind === "fallback" && result.retryAfterSeconds ? { "Retry-After": String(result.retryAfterSeconds) } : {} });
}
