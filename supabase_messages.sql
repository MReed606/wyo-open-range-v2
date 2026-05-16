create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete cascade,
  buyer_id uuid references public.profiles(id) on delete cascade,
  seller_id uuid references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete cascade,
  message text not null,
  created_at timestamp with time zone default now()
);

alter table public.conversations enable row level security;
alter table public.messages enable row level security;

create policy "Users can view own conversations"
on public.conversations
for select
using (
  auth.uid() = buyer_id
  or auth.uid() = seller_id
);

create policy "Users can create conversations"
on public.conversations
for insert
to authenticated
with check (auth.uid() = buyer_id);

create policy "Users can view messages"
on public.messages
for select
using (
  exists (
    select 1
    from public.conversations
    where conversations.id = conversation_id
    and (
      conversations.buyer_id = auth.uid()
      or conversations.seller_id = auth.uid()
    )
  )
);

create policy "Users can send messages"
on public.messages
for insert
to authenticated
with check (
  auth.uid() = sender_id
);
