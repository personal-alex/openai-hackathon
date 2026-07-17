import "server-only";
import { NextResponse } from "next/server";
import { getActiveEventPack } from "@/event-packs/registry";

/** The live selector remains bounded to catalog question IDs; UI seeded mode remains network-free. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => undefined) as { eventId?: string } | undefined;
  const pack = body?.eventId === "expecting_child" ? getActiveEventPack("expecting_child") : undefined;
  return NextResponse.json({ kind: "fallback", data: { questionId: pack?.questions[0]?.id ?? null }, reason: "seeded_demo" });
}
