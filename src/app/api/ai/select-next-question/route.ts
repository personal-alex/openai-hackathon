import "server-only";
import { NextResponse } from "next/server";

/** Question selection intentionally remains unavailable until an approved server-side pack registry exists. */
export async function POST() {
  return NextResponse.json({ kind: "fallback", data: { questionId: null }, reason: "catalog_unavailable" }, { status: 503 });
}
