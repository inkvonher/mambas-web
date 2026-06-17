import { NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabase-server";
import { syncAuthError } from "../../../lib/sync-auth";

export const runtime = "nodejs";

type Body = {
  gcal_event_id?: string;
  client_name?: string;
  client_phone?: string;
  service?: string;
  category?: string;
  appointment_date?: string;
  appointment_time?: string;
  notes?: string;
};

// Creates an appointment in the admin DB from a new Google Calendar booking.
// Deduped by gcal_event_id so it never inserts the same booking twice.
export async function POST(request: Request) {
  const err = syncAuthError(request);
  if (err) {
    return NextResponse.json(
      { error: err },
      { status: err === "unauthorized" ? 401 : 500 },
    );
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  if (!body.gcal_event_id || !body.appointment_date || !body.appointment_time) {
    return NextResponse.json({ error: "missing fields" }, { status: 422 });
  }

  // Skip if this Google event was already imported.
  const { data: existing } = await supabaseServer
    .from("appointments")
    .select("id")
    .eq("gcal_event_id", body.gcal_event_id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ ok: true, skipped: true, id: existing.id });
  }

  const name = (body.client_name || "Reserva Google").trim().slice(0, 80);
  const phone = (body.client_phone || "").trim().slice(0, 25);

  const payload = {
    client_name: name || "Reserva Google",
    client_phone: phone, // may be empty (constraint allows it)
    service: (body.service || "").slice(0, 120) || null,
    category: body.category === "tattoo" ? "tattoo" : "barber",
    appointment_date: body.appointment_date,
    appointment_time: body.appointment_time,
    status: "confirmed",
    notes: (body.notes || "").slice(0, 2000) || null,
    deposit_amount: 0,
    gcal_event_id: body.gcal_event_id,
    source: "google",
  };

  const { data, error } = await supabaseServer
    .from("appointments")
    .insert([payload])
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, id: data.id });
}
