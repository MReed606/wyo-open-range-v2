alter table public.profiles
add column if not exists badge text;

alter table public.profiles
add column if not exists suspended boolean default false;

create table if not exists forum_posts (
  id uuid primary key default gen_random_uuid(),

  title text,

  content text,

  category text,

  user_id uuid,

  created_at timestamptz default now()
);
