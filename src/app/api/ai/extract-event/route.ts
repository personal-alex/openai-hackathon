import "server-only";
import { NextResponse } from "next/server";
import { isOpaqueSessionId } from "@/ai-orchestrator";
import { getClassificationCandidates, getClassificationGateway } from "@/lib/ai/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { story?: unknown; sessionId?: unknown } | null;
  if (!body || typeof body.story !== "string" || body.story.trim().length === 0 || body.story.length > 2_000 || typeof body.sessionId !== "string" || !isOpaqueSessionId(body.sessionId)) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  const result = await getClassificationGateway().classifyEvent({ text: body.story, requestId: crypto.randomUUID(), candidates: getClassificationCandidates() });
  const status = result.kind === "clarification" && result.reason === "rate_limited" ? 429 : result.kind === "clarification" && result.reason === "unavailable" ? 503 : 200;
  return NextResponse.json(result, { status, headers: result.kind === "clarification" && result.retryAfterSeconds ? { "Retry-After": String(result.retryAfterSeconds) } : {} });
}
