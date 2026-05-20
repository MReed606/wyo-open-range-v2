alter table public.profiles
add column if not exists email_notifications boolean default true;

alter table public.profiles
add column if not exists sms_notifications boolean default false;

alter table public.profiles
add column if not exists message_notifications boolean default true;

alter table public.profiles
add column if not exists forum_notifications boolean default true;

alter table public.profiles
add column if not exists listing_notifications boolean default true;
