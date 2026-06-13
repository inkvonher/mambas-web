import { createClient } from "@supabase/supabase-js";

// Server-only Supabase client. Prefers the service-role key when present (so the
// public `clients` INSERT policy can be locked down to service_role only), and
// falls back to the anon key otherwise. NEVER import this from a Client Component.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serverKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabaseServer = createClient(supabaseUrl, serverKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
