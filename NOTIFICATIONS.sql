
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),

  user_id uuid,

  type text,
  title text,
  message text,

  read boolean default false,

  created_at timestamptz default now()
);

