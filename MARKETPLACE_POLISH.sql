create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),

  user_id uuid,

  listing_id uuid,

  created_at timestamptz default now()
);

alter table public.listings
add column if not exists views integer default 0;
