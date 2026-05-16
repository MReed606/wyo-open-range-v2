create table if not exists public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  image_url text not null,
  created_at timestamp with time zone default now()
);

alter table public.listing_images enable row level security;

create policy "Listing images are public"
on public.listing_images
for select
using (true);

create policy "Authenticated users can insert listing images"
on public.listing_images
for insert
to authenticated
with check (true);

create policy "Authenticated users can delete listing images"
on public.listing_images
for delete
to authenticated
using (true);
