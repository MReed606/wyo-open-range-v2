create table if not exists forum_comments (
  id uuid primary key default gen_random_uuid(),

  post_id uuid,

  user_id uuid,

  username text,

  content text,

  created_at timestamptz default now()
);
