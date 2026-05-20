
-- =====================================================
-- PROFILE HARDENING
-- =====================================================

alter table public.profiles
add column if not exists avatar_url text;

alter table public.profiles
add column if not exists email_verified boolean default false;

alter table public.profiles
add column if not exists phone_verified boolean default false;

alter table public.profiles
add column if not exists onboarding_complete boolean default false;

-- =====================================================
-- REVIEW ABUSE PREVENTION
-- =====================================================

create unique index if not exists one_review_per_user
on public.user_reviews (
  reviewer_id,
  reviewed_user_id
);

-- =====================================================
-- MODERATION HISTORY
-- =====================================================

alter table public.moderation_actions
add column if not exists moderator_role text;

-- =====================================================
-- SAVED SELLERS
-- =====================================================

create table if not exists favorite_sellers (
  id uuid primary key default gen_random_uuid(),

  user_id uuid,
  seller_id uuid,

  created_at timestamptz default now()
);

-- =====================================================
-- SAVED SEARCHES
-- =====================================================

create table if not exists saved_searches (
  id uuid primary key default gen_random_uuid(),

  user_id uuid,

  search_query text,
  category text,
  region text,

  created_at timestamptz default now()
);

