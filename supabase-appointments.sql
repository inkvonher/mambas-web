create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  client_name text not null,
  client_phone text not null,
  category text not null check (category in ('tattoo', 'barber')),
  appointment_date date not null,
  appointment_time time not null,
  status text not null default 'pending' check (
    status in ('pending', 'confirmed', 'completed', 'cancelled')
  ),
  notes text,
  deposit_amount numeric(10, 2) not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists appointments_date_time_idx
  on public.appointments (appointment_date, appointment_time);

alter table public.appointments enable row level security;

create policy "Authenticated users can read appointments"
  on public.appointments
  for select
  to authenticated
  using (true);

create policy "Authenticated users can create appointments"
  on public.appointments
  for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update appointments"
  on public.appointments
  for update
  to authenticated
  using (true)
  with check (true);
