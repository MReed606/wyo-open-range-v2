create table if not exists followers (
  id uuid primary key default gen_random_uuid(),

  follower_id uuid,

  following_id uuid,

  created_at timestamptz default now()
);

alter table public.profiles
add column if not exists last_active timestamptz;

alter table public.profiles
add column if not exists response_rate integer default 100;

alter table public.profiles
add column if not exists response_time text default 'Fast';

alter table public.listings
add column if not exists featured boolean default false;
