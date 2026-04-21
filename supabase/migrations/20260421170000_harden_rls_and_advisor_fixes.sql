-- Collapse legacy "anon can do anything" policies onto the `authenticated` role,
-- drop the unneeded public-bucket SELECT policy, and pin the order-sequence
-- function's search_path. Applied via MCP on 2026-04-21.

drop policy if exists "Anon insert beers"          on beers;
drop policy if exists "Anon update beers"          on beers;
drop policy if exists "Anon delete beers"          on beers;
drop policy if exists "Anon insert beer_variants"  on beer_variants;
drop policy if exists "Anon update beer_variants"  on beer_variants;
drop policy if exists "Anon delete beer_variants"  on beer_variants;
drop policy if exists "Allow insert beers"         on beers;
drop policy if exists "Allow update beers"         on beers;
drop policy if exists "Allow delete beers"         on beers;
drop policy if exists "Allow insert beer_variants" on beer_variants;
drop policy if exists "Allow update beer_variants" on beer_variants;
drop policy if exists "Allow delete beer_variants" on beer_variants;

drop policy if exists "Anon insert orders"       on orders;
drop policy if exists "Anon select orders"       on orders;
drop policy if exists "Anon update orders"       on orders;
drop policy if exists "Anon insert order_items"  on order_items;
drop policy if exists "Anon select order_items"  on order_items;
drop policy if exists "Anon all order_sequences" on order_sequences;
drop policy if exists "Allow insert orders"      on orders;
drop policy if exists "Allow select orders"      on orders;
drop policy if exists "Allow update orders"      on orders;
drop policy if exists "Allow insert order_items" on order_items;
drop policy if exists "Allow select order_items" on order_items;
drop policy if exists "Allow all order_sequences" on order_sequences;

drop policy if exists "beer-images anon read" on storage.objects;

create or replace function next_order_seq(p_year integer)
returns integer
language plpgsql
set search_path = public, pg_temp
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
