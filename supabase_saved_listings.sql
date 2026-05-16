create table if not exists public.saved_listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(user_id, listing_id)
);

alter table public.saved_listings enable row level security;

create policy "Users can view their saved listings"
on public.saved_listings
for select
using (auth.uid() = user_id);

create policy "Users can save listings"
on public.saved_listings
for insert
with check (auth.uid() = user_id);

create policy "Users can remove their saved listings"
on public.saved_listings
for delete
using (auth.uid() = user_id);
