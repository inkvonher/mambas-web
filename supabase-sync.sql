-- Mambas — sincronización con Google Calendar (Fase 1)
-- Ejecuta en el SQL editor de Supabase. Es seguro e idempotente.

-- 1) Alinear el nombre de la columna del teléfono con lo que espera el panel
--    admin (client_phone). Renombra solo si hace falta y conserva los datos.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'appointments' and column_name = 'phone'
  ) and not exists (
    select 1 from information_schema.columns
    where table_name = 'appointments' and column_name = 'client_phone'
  ) then
    alter table public.appointments rename column phone to client_phone;
  end if;
end $$;

-- 2) Columnas para enlazar cada cita con su evento de Google y su origen.
alter table public.appointments
  add column if not exists gcal_event_id text;

alter table public.appointments
  add column if not exists source text not null default 'admin';

create index if not exists appointments_gcal_event_id_idx
  on public.appointments (gcal_event_id);
