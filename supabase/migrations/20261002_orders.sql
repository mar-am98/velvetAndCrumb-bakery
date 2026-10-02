-- ============================================================
-- Velvet & Crumb — orders + order_items tables
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- 1. orders table
create table if not exists public.orders (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  status              text not null default 'confirmed'
                        check (status in ('pending','confirmed','preparing','delivered','cancelled')),
  full_name           text not null,
  email               text not null,
  street_address      text not null,
  delivery_date       date not null,
  delivery_time_window text not null,
  bakery_note         text,
  subtotal            numeric(10,2) not null,
  shipping_cost       numeric(10,2) not null default 0,
  total               numeric(10,2) not null,
  created_at          timestamptz not null default now()
);

-- 2. order_items table  (snapshot of product data at time of purchase)
create table if not exists public.order_items (
  id                uuid primary key default gen_random_uuid(),
  order_id          uuid not null references public.orders(id) on delete cascade,
  product_id        uuid not null,
  product_name      text not null,
  product_image_url text not null default '',
  portion_label     text not null,
  unit_price        numeric(10,2) not null,
  quantity          int  not null check (quantity > 0),
  line_total        numeric(10,2) not null
);

-- 3. Row-Level Security — users see only their own orders
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- orders: owner can insert + select
create policy "Users can insert own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Users can select own orders"
  on public.orders for select
  using (auth.uid() = user_id);

-- order_items: accessible if the parent order belongs to the user
create policy "Users can insert own order items"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

create policy "Users can select own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

-- 4. Helpful index
create index if not exists orders_user_id_created_at_idx
  on public.orders (user_id, created_at desc);
