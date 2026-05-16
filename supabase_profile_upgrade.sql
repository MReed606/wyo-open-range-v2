alter table public.profiles
add column if not exists bio text;

alter table public.profiles
add column if not exists avatar_url text;

alter table public.profiles
add column if not exists joined_at timestamp with time zone default now();
