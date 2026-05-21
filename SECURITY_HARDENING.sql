
-- =====================================================
-- ENABLE RLS
-- =====================================================

alter table public.profiles
enable row level security;

alter table public.listings
enable row level security;

alter table public.messages
enable row level security;

alter table public.favorites
enable row level security;

alter table public.forum_posts
enable row level security;

alter table public.forum_comments
enable row level security;

-- =====================================================
-- DROP OLD POLICIES
-- =====================================================

drop policy if exists "profiles_select" on public.profiles;
drop policy if exists "profiles_update" on public.profiles;

drop policy if exists "listings_select" on public.listings;
drop policy if exists "listings_insert" on public.listings;
drop policy if exists "listings_update" on public.listings;
drop policy if exists "listings_delete" on public.listings;

drop policy if exists "messages_select" on public.messages;
drop policy if exists "messages_insert" on public.messages;

drop policy if exists "favorites_all" on public.favorites;

drop policy if exists "forum_posts_all" on public.forum_posts;

drop policy if exists "forum_comments_all" on public.forum_comments;

-- =====================================================
-- PROFILES
-- =====================================================

create policy "profiles_select"
on public.profiles
for select
using (true);

create policy "profiles_update"
on public.profiles
for update
using (
  auth.uid() = id
);

-- =====================================================
-- LISTINGS
-- =====================================================

create policy "listings_select"
on public.listings
for select
using (true);

create policy "listings_insert"
on public.listings
for insert
with check (
  auth.uid() = owner_id
);

create policy "listings_update"
on public.listings
for update
using (
  auth.uid() = owner_id
);

create policy "listings_delete"
on public.listings
for delete
using (
  auth.uid() = owner_id
);

-- =====================================================
-- MESSAGES
-- =====================================================

create policy "messages_select"
on public.messages
for select
using (
  auth.uid() = sender_id
  OR
  auth.uid() = receiver_id
);

create policy "messages_insert"
on public.messages
for insert
with check (
  auth.uid() = sender_id
);

-- =====================================================
-- FAVORITES
-- =====================================================

create policy "favorites_all"
on public.favorites
for all
using (
  auth.uid() = user_id
);

-- =====================================================
-- FORUM POSTS
-- =====================================================

create policy "forum_posts_all"
on public.forum_posts
for all
using (
  auth.uid() = user_id
);

-- =====================================================
-- FORUM COMMENTS
-- =====================================================

create policy "forum_comments_all"
on public.forum_comments
for all
using (
  auth.uid() = user_id
);

