// Shared guard for the calendar-sync endpoints. The Apps Script bridge sends
// "Authorization: Bearer <SYNC_SECRET>". These endpoints also require the
// Supabase service-role key (they bypass RLS to read/write appointments).
export function syncAuthError(request: Request): string | null {
  const secret = process.env.SYNC_SECRET;
  if (!secret) return "SYNC_SECRET no configurado en el servidor.";
  const header = request.headers.get("authorization") || "";
  if (header !== `Bearer ${secret}`) return "unauthorized";
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return "SUPABASE_SERVICE_ROLE_KEY no configurado en el servidor.";
  }
  return null;
}
