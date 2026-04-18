-- Troebel Brewing — Supabase Schema
-- Run this in the Supabase SQL editor to set up all tables.

-- ============================================================
-- BEERS
-- ============================================================
create table if not exists beers (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  style         text,
  category      text,
  description   text,
  long_description text,
  abv           numeric,
  ibu           integer,
  rating        numeric,
  rating_count  integer,
  image_url     text,          -- Supabase Storage URL or public URL
  tasting_notes text,          -- comma-separated
  food_pairings text,          -- comma-separated
  is_new        boolean default false,
  is_limited    boolean default false,
  is_featured   boolean default false,
  sort_order    integer default 0,
  created_at    timestamptz default now()
);

-- ============================================================
-- BEER VARIANTS
-- ============================================================
create table if not exists beer_variants (
  id           uuid primary key default gen_random_uuid(),
  beer_id      uuid references beers(id) on delete cascade,
  type         text,               -- bottle / crate / keg / custom
  size         text,
  label        text,
  price        numeric not null,
  stock        integer default 0,
  volume_ml    integer,
  is_available boolean default true,
  sort_order   integer default 0
);

-- ============================================================
-- ORDERS
-- ============================================================
create table if not exists orders (
  id               uuid primary key default gen_random_uuid(),
  order_number     text unique not null,   -- TB-2026-0001
  customer_name    text not null,
  customer_email   text not null,
  customer_phone   text,
  customer_type    text default 'particulier',  -- particulier / bedrijf
  fulfillment      text default 'pickup',
  status           text default 'pending',
  is_processed     boolean default false,
  total_excl_vat   numeric not null,
  vat_amount       numeric not null,
  total_incl_vat   numeric not null,
  notes            text,
  created_at       timestamptz default now()
);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
create table if not exists order_items (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid references orders(id) on delete cascade,
  beer_name       text not null,
  variant_label   text not null,
  quantity        integer not null,
  unit_price      numeric not null,
  total_excl_vat  numeric not null,
  vat_amount      numeric not null,
  total_incl_vat  numeric not null
);

-- ============================================================
-- ORDER NUMBER SEQUENCE HELPER
-- ============================================================
-- Stores the last used sequence number for generating TB-YYYY-NNNN
create table if not exists order_sequences (
  year    integer primary key,
  last_seq integer default 0
);

-- ============================================================
-- ORDER SEQUENCE FUNCTION
-- Called by the API to get the next order number for a given year.
-- ============================================================
create or replace function next_order_seq(p_year integer)
returns integer
language plpgsql
as $$
declare
  v_seq integer;
begin
  insert into order_sequences (year, last_seq) values (p_year, 1)
  on conflict (year) do update
    set last_seq = order_sequences.last_seq + 1
  returning last_seq into v_seq;
  return v_seq;
end;
$$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
-- Beers and variants are publicly readable
alter table beers enable row level security;
alter table beer_variants enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table order_sequences enable row level security;

-- Public read for beers/variants (shop visitors)
create policy "Public read beers" on beers for select using (true);
create policy "Public read beer_variants" on beer_variants for select using (true);

-- Orders: only service role can read/write (no public access)
-- The app uses the service role key server-side, so no additional policies needed.
-- If you want to allow authenticated users to read their own orders, add policies here.
