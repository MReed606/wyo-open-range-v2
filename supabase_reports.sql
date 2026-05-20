create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete cascade,
  reporter_id uuid references public.profiles(id) on delete cascade,
  reason text not null,
  created_at timestamp with time zone default now()
);

alter table public.reports enable row level security;

create policy "Users can create reports"
on public.reports
for insert
to authenticated
with check (auth.uid() = reporter_id);

create policy "Users can view their reports"
on public.reports
for select
using (auth.uid() = reporter_id);
