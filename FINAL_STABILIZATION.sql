-- =====================================================
-- CATEGORY
-- =====================================================

alter table public.listings
add column if not exists category text;

-- =====================================================
-- PROFILE EXPANSION
-- =====================================================

alter table public.profiles
add column if not exists verified boolean default false;

alter table public.profiles
add column if not exists verification_status text default 'pending';

alter table public.profiles
add column if not exists role text default 'user';

alter table public.profiles
add column if not exists badge text;

alter table public.profiles
add column if not exists review_score numeric default 0;

alter table public.profiles
add column if not exists review_count integer default 0;

-- =====================================================
-- MODERATION
-- =====================================================

create table if not exists moderation_actions (
  id uuid primary key default gen_random_uuid(),

  target_user_id uuid,
  admin_user_id uuid,

  action_type text,
  admin_note text,
  public_reason text,

  created_at timestamptz default now()
);

create table if not exists reporter_metrics (
  reporter_id uuid primary key,

  total_reports integer default 0,
  valid_reports integer default 0,
  false_reports integer default 0
);

-- =====================================================
-- REVIEWS
-- =====================================================

create table if not exists user_reviews (
  id uuid primary key default gen_random_uuid(),

  reviewer_id uuid,
  reviewed_user_id uuid,

  rating integer,
  review text,

  created_at timestamptz default now()
);

-- =====================================================
-- CONTACT ADMIN
-- =====================================================

create table if not exists admin_messages (
  id uuid primary key default gen_random_uuid(),

  user_id uuid,
  subject text,
  message text,

  resolved boolean default false,

  created_at timestamptz default now()
);

-- =====================================================
-- NOTIFICATION SETTINGS
-- =====================================================

create table if not exists notification_settings (
  user_id uuid primary key,

  email_notifications boolean default true,
  sms_notifications boolean default false
);
