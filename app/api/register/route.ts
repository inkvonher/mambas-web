import { NextResponse } from "next/server";
import { supabaseServer } from "../../lib/supabase-server";

export const runtime = "nodejs";

// --- Lightweight in-memory rate limiter (per instance) -----------------------
// Durable, cross-instance protection is enforced by DB CHECK constraints and RLS.
// This stops casual bursts. For production-grade limits use Upstash/Redis.
const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 5; // per IP per window
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}

// Opportunistic cleanup so the map can't grow unbounded.
function sweep() {
  const now = Date.now();
  for (const [ip, entry] of hits) {
    if (now > entry.resetAt) hits.delete(ip);
  }
}

// --- Validation --------------------------------------------------------------
const PHONE_RE = /^[\d+\-\s()]{7,25}$/;
const ALLOWED_INTERESTS = new Set(["barber", "tattoo"]);

type Payload = {
  name: string;
  phone: string;
  birthday: string | null;
  service: string;
  status: string;
};

function validate(body: Record<string, unknown>):
  | { ok: true; data: Payload }
  | { ok: false; error: string } {
  // Honeypot: real users never fill the hidden "company" field.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return { ok: false, error: "spam" };
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const birthdayRaw =
    typeof body.birthday === "string" ? body.birthday.trim() : "";
  const interest =
    typeof body.interest === "string" ? body.interest.trim() : "";

  if (name.length < 2 || name.length > 80) {
    return { ok: false, error: "name" };
  }
  if (!PHONE_RE.test(phone)) {
    return { ok: false, error: "phone" };
  }
  if (!ALLOWED_INTERESTS.has(interest)) {
    return { ok: false, error: "interest" };
  }
  let birthday: string | null = null;
  if (birthdayRaw) {
    const d = new Date(birthdayRaw);
    if (Number.isNaN(d.getTime())) {
      return { ok: false, error: "birthday" };
    }
    birthday = birthdayRaw;
  }

  return {
    ok: true,
    data: { name, phone, birthday, service: interest, status: "Nuevo" },
  };
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  sweep();
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Inténtalo en un minuto." },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const result = validate(body);
  if (!result.ok) {
    // Honeypot triggers a fake-success so bots don't learn they were caught.
    if (result.error === "spam") {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json(
      { error: "Datos inválidos. Revisa el formulario." },
      { status: 422 },
    );
  }

  const { error } = await supabaseServer.from("clients").insert([result.data]);

  if (error) {
    console.error("register insert failed", error.message);
    return NextResponse.json(
      { error: "No se pudo guardar el registro. Inténtalo de nuevo." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
