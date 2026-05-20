
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),

  listing_id uuid,

  buyer_id uuid,
  seller_id uuid,

  created_at timestamptz default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),

  conversation_id uuid,

  sender_id uuid,

  message text,

  read boolean default false,

  created_at timestamptz default now()
);

