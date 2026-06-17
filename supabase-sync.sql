-- Mambas — sincronización con Google Calendar (Fase 1)
-- Ejecuta en el SQL editor de Supabase DESPUÉS de los otros scripts.

-- Columnas para enlazar cada cita con su evento de Google y saber su origen.
alter table public.appointments
  add column if not exists gcal_event_id text;

alter table public.appointments
  add column if not exists source text not null default 'admin';

create index if not exists appointments_gcal_event_id_idx
  on public.appointments (gcal_event_id);

-- Las reservas de Google pueden no traer teléfono; permitimos vacío.
alter table public.appointments
  drop constraint if exists appointments_phone_len_chk;
alter table public.appointments
  add constraint appointments_phone_len_chk
  check (client_phone = '' or char_length(client_phone) between 7 and 25);
