import "server-only";
import { NextResponse } from "next/server";

/** No reviewed server-side catalog exists yet, so no task can be allowlisted for a live explanation. */
export async function POST() {
  return NextResponse.json({ kind: "fallback", data: { message: null }, reason: "catalog_unavailable" }, { status: 503 });
}
