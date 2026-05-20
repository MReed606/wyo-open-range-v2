create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),

  title text,

  message text,

  created_at timestamptz default now()
);

alter table public.profiles
add column if not exists premium_seller boolean default false;

alter table public.profiles
add column if not exists followers_count integer default 0;
