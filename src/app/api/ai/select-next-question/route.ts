import "server-only";
import { NextResponse } from "next/server";
import { EventIdSchema } from "@/domain-contracts";
import { getActiveEventPack } from "@/event-packs/registry";

/** The live selector remains bounded to catalog question IDs; UI seeded mode remains network-free. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => undefined) as { eventId?: string } | undefined;
  const eventId = EventIdSchema.safeParse(body?.eventId);
  const pack = eventId.success ? getActiveEventPack(eventId.data) : undefined;
  return NextResponse.json({ kind: "fallback", data: { questionId: pack?.questions[0]?.id ?? null }, reason: "seeded_demo" });
}
