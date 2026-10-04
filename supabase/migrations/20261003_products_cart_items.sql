-- ============================================================
-- Velvet & Crumb — products + cart_items tables
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- Safe to re-run: every statement is guarded (if not exists / drop policy if exists).
-- ============================================================

-- 1. products table (seeded manually via the Supabase Table Editor)
create table if not exists public.products (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  slug            text not null unique,
  description     text not null,
  category        text not null
                    check (category in ('Cheesecakes','Fruit Tarts','Chocolate Tarts','Mini Bites','Vegan / GF')),
  base_price      numeric(10,2) not null check (base_price >= 0),
  image_url       text not null default '',
  rating          numeric(2,1) not null default 0 check (rating >= 0 and rating <= 5),
  review_count    int not null default 0 check (review_count >= 0),
  badge           text,
  allergens       text,
  ingredients     text,
  portion_sizes   jsonb not null default '[{"label":"Single Slice","priceModifier":1}]'::jsonb,
  is_available    boolean not null default true,
  is_bestseller   boolean not null default false,
  created_at      timestamptz not null default now()
);

-- 2. cart_items — per-user cart, shared by web + mobile through the same table
create table if not exists public.cart_items (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  product_id      uuid not null references public.products(id) on delete cascade,
  portion_label   text not null,
  price_modifier  numeric(4,2) not null default 1,
  quantity        int not null check (quantity > 0),
  updated_at      timestamptz not null default now(),
  -- matches the client upsert onConflict target: "user_id,product_id,portion_label"
  constraint cart_items_user_product_portion_unique unique (user_id, product_id, portion_label)
);

-- 3. Row-Level Security
alter table public.products enable row level security;
alter table public.cart_items enable row level security;

-- products: publicly readable catalog; writes happen in the Table Editor
-- (service role bypasses RLS), so no write policies are needed.
drop policy if exists "Products are publicly readable" on public.products;
create policy "Products are publicly readable"
  on public.products for select
  using (true);

-- cart_items: owner-only access for every operation
drop policy if exists "Users can read own cart items" on public.cart_items;
create policy "Users can read own cart items"
  on public.cart_items for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own cart items" on public.cart_items;
create policy "Users can insert own cart items"
  on public.cart_items for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own cart items" on public.cart_items;
create policy "Users can update own cart items"
  on public.cart_items for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own cart items" on public.cart_items;
create policy "Users can delete own cart items"
  on public.cart_items for delete
  using (auth.uid() = user_id);

-- 4. Indexes for the queries the app runs
-- (cart load orders by updated_at; product list orders by created_at desc)
create index if not exists cart_items_user_id_updated_at_idx
  on public.cart_items (user_id, updated_at);

create index if not exists products_created_at_idx
  on public.products (created_at desc);

-- 5. Realtime — both apps subscribe to postgres_changes on cart_items,
--    which is what powers web <-> mobile cart synchronization.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'cart_items'
  ) then
    alter publication supabase_realtime add table public.cart_items;
  end if;
end $$;
