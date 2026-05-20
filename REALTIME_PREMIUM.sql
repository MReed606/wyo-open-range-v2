alter table public.notifications
add column if not exists link text;

alter table public.notifications
add column if not exists type_color text default 'blue';

alter table public.listings
add column if not exists favorites_count integer default 0;

alter table public.listings
add column if not exists message_count integer default 0;

alter table public.listings
add column if not exists boost_score integer default 0;
