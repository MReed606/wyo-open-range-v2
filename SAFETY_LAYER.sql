
-- =====================================================
-- PROFILE FLAGS
-- =====================================================

alter table public.profiles
add column if not exists suspicious boolean default false;

alter table public.profiles
add column if not exists muted_until timestamptz;

-- =====================================================
-- LISTING FLAGS
-- =====================================================

alter table public.listings
add column if not exists hidden_by_system boolean default false;

alter table public.listings
add column if not exists moderation_score integer default 0;

