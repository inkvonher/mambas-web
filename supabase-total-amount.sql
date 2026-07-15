-- Mambas — añade columna total_amount para ingresos reales
-- Ejecuta esto en el SQL editor de Supabase.
alter table public.appointments
  add column if not exists total_amount numeric(10, 2) default null;
