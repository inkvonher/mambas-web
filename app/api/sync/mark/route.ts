import { NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabase-server";
import { syncAuthError } from "../../../lib/sync-auth";

export const runtime = "nodejs";

// The bridge reports back the Google event id for an admin appointment it
// just created, so we won't push it again.
export async function POST(request: Request) {
  const err = syncAuthError(request);
  if (err) {
    return NextResponse.json(
      { error: err },
      { status: err === "unauthorized" ? 401 : 500 },
    );
  }

  let body: { id?: string; gcal_event_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  if (!body.id || !body.gcal_event_id) {
    return NextResponse.json({ error: "missing id/gcal_event_id" }, {
      status: 422,
    });
  }

  const { error } = await supabaseServer
    .from("appointments")
    .update({ gcal_event_id: body.gcal_event_id })
    .eq("id", body.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
