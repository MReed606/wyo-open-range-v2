alter table public.profiles
add column if not exists public_phone boolean default false;

alter table public.profiles
add column if not exists public_email boolean default false;
