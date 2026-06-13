import { createBrowserClient } from "@supabase/ssr";

// Browser client for Client Components (admin login + dashboard).
// Unlike the old localStorage client, @supabase/ssr stores the session in
// cookies, so the Next.js middleware can read it and protect /admin on the
// server BEFORE any admin UI is sent to the browser.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
