alter table public.clients enable row level security;

drop policy if exists "Authenticated users can read clients"
  on public.clients;

create policy "Authenticated users can read clients"
  on public.clients
  for select
  to authenticated
  using (true);

drop policy if exists "Anyone can create clients"
  on public.clients;

create policy "Anyone can create clients"
  on public.clients
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Authenticated users can update clients"
  on public.clients;

create policy "Authenticated users can update clients"
  on public.clients
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users can delete clients"
  on public.clients;

create policy "Authenticated users can delete clients"
  on public.clients
  for delete
  to authenticated
  using (true);
