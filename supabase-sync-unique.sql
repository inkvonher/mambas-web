-- Mambas — evita citas duplicadas con el mismo evento de Google.
-- Ejecuta en el SQL editor de Supabase DESPUÉS de borrar manualmente los
-- duplicados que ya existan (si no, la creación del índice fallará).

-- 1) (Opcional) Ver si hay duplicados por gcal_event_id:
--    select gcal_event_id, count(*) from public.appointments
--    where gcal_event_id is not null
--    group by gcal_event_id having count(*) > 1;

-- 2) Candado: no permite dos citas con el mismo evento de Google.
create unique index if not exists appointments_gcal_event_id_unique
  on public.appointments (gcal_event_id)
  where gcal_event_id is not null;
