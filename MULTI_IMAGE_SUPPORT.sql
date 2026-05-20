alter table public.listings
add column if not exists images text[];

alter table public.profiles
add column if not exists avatar_url text;
