import { NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabase-server";
import { syncAuthError } from "../../../lib/sync-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Returns admin-created appointments that aren't in Google Calendar yet.
export async function GET(request: Request) {
  const err = syncAuthError(request);
  if (err) {
    return NextResponse.json(
      { error: err },
      { status: err === "unauthorized" ? 401 : 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const categoryParam = searchParams.get("category");

  let query = supabaseServer
    .from("appointments")
    .select(
      "id, client_name, client_phone, service, category, appointment_date, appointment_time, notes, status",
    )
    .eq("source", "admin")
    .is("gcal_event_id", null)
    .neq("status", "cancelled");

  if (categoryParam === "tattoo" || categoryParam === "barber") {
    query = query.eq("category", categoryParam);
  }

  const { data, error } = await query
    .order("appointment_date", { ascending: true })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ appointments: data || [] });
}
