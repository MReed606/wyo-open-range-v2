-- =========================================
-- REALTIME CHAT
-- =========================================

alter table public.messages
add column if not exists read boolean default false;

alter table public.messages
add column if not exists typing boolean default false;

-- =========================================
-- MONETIZATION
-- =========================================

alter table public.listings
add column if not exists premium boolean default false;

alter table public.listings
add column if not exists promoted boolean default false;

alter table public.profiles
add column if not exists subscription_tier text default 'free';

-- =========================================
-- GEO DISCOVERY
-- =========================================

alter table public.listings
add column if not exists city text;

alter table public.listings
add column if not exists state text;

alter table public.listings
add column if not exists zipcode text;

alter table public.listings
add column if not exists latitude numeric;

alter table public.listings
add column if not exists longitude numeric;

-- =========================================
-- SMART SYSTEMS
-- =========================================

alter table public.profiles
add column if not exists trust_score integer default 100;

alter table public.listings
add column if not exists fraud_score integer default 0;

alter table public.listings
add column if not exists spam_score integer default 0;
