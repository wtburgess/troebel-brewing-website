-- RLS: public read for catalog, service role handles the rest
-- The app uses service_role key server-side, which bypasses RLS.
-- Anon policies below keep browser-side reads working for beers/variants.

alter table beers           enable row level security;
alter table beer_variants   enable row level security;
alter table orders          enable row level security;
alter table order_items     enable row level security;
alter table order_sequences enable row level security;

create policy "Public read beers"          on beers          for select using (true);
create policy "Public read beer_variants"  on beer_variants  for select using (true);

-- TODO: tighten these — currently permissive for anon writes (legacy from pre-service-role setup).
-- Once all writes route through service_role in src/lib/supabase/server.ts, drop these.
create policy "Anon insert beers"          on beers          for insert with check (true);
create policy "Anon update beers"          on beers          for update using (true) with check (true);
create policy "Anon delete beers"          on beers          for delete using (true);

create policy "Anon insert beer_variants"  on beer_variants  for insert with check (true);
create policy "Anon update beer_variants"  on beer_variants  for update using (true) with check (true);
create policy "Anon delete beer_variants"  on beer_variants  for delete using (true);

create policy "Anon insert orders"         on orders         for insert with check (true);
create policy "Anon select orders"         on orders         for select using (true);
create policy "Anon update orders"         on orders         for update using (true) with check (true);

create policy "Anon insert order_items"    on order_items    for insert with check (true);
create policy "Anon select order_items"    on order_items    for select using (true);

create policy "Anon all order_sequences"   on order_sequences for all using (true) with check (true);
