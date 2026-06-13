-- Mambas — endurecimiento de la base de datos
-- Ejecuta este script en el SQL editor de Supabase DESPUÉS de los otros dos.
-- Es idempotente: se puede correr varias veces sin romper nada.

-- 1) Límites de longitud en `clients` -----------------------------------------
-- Evita que un atacante inserte payloads enormes o basura, incluso si lograra
-- saltarse la API. Los CHECK aplican a TODA inserción, venga de donde venga.
alter table public.clients
  drop constraint if exists clients_name_len_chk;
alter table public.clients
  add constraint clients_name_len_chk
  check (char_length(name) between 1 and 80);

alter table public.clients
  drop constraint if exists clients_phone_len_chk;
alter table public.clients
  add constraint clients_phone_len_chk
  check (char_length(phone) between 7 and 25);

alter table public.clients
  drop constraint if exists clients_service_chk;
alter table public.clients
  add constraint clients_service_chk
  check (service is null or service in ('barber', 'tattoo'));

-- 2) Límites de longitud en `appointments` ------------------------------------
alter table public.appointments
  drop constraint if exists appointments_name_len_chk;
alter table public.appointments
  add constraint appointments_name_len_chk
  check (char_length(client_name) between 1 and 80);

alter table public.appointments
  drop constraint if exists appointments_phone_len_chk;
alter table public.appointments
  add constraint appointments_phone_len_chk
  check (char_length(client_phone) between 7 and 25);

alter table public.appointments
  drop constraint if exists appointments_notes_len_chk;
alter table public.appointments
  add constraint appointments_notes_len_chk
  check (notes is null or char_length(notes) <= 2000);

-- 3) OPCIONAL pero RECOMENDADO -------------------------------------------------
-- Cierra por completo la inserción anónima directa a `clients`.
-- El sitio sigue funcionando porque /api/register inserta del lado del servidor
-- usando la SERVICE_ROLE_KEY (que ignora RLS). Para activarlo:
--   a) En Vercel, añade la variable de entorno SUPABASE_SERVICE_ROLE_KEY
--      (Supabase > Project Settings > API > service_role secret).
--   b) Descomenta las dos líneas de abajo y vuelve a correr este script.
--
-- drop policy if exists "Anyone can create clients" on public.clients;
-- (sin política de INSERT para anon, las inserciones directas con la anon key
--  quedan bloqueadas; solo el servidor con service_role puede insertar)
