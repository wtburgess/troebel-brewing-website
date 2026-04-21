-- FK indexes + wrap auth.jwt() in a subselect so the auth lookup runs once per
-- query instead of once per row. Applied via MCP on 2026-04-21.

create index if not exists beer_variants_beer_id_idx on beer_variants (beer_id);
create index if not exists order_items_order_id_idx  on order_items  (order_id);

drop policy if exists "Admin insert beers"         on beers;
drop policy if exists "Admin update beers"         on beers;
drop policy if exists "Admin delete beers"         on beers;
drop policy if exists "Admin insert beer_variants" on beer_variants;
drop policy if exists "Admin update beer_variants" on beer_variants;
drop policy if exists "Admin delete beer_variants" on beer_variants;
drop policy if exists "Admin select orders"        on orders;
drop policy if exists "Admin select order_items"   on order_items;
drop policy if exists "Admin select page_views"    on page_views;
drop policy if exists "Admin insert beer-images"   on storage.objects;
drop policy if exists "Admin update beer-images"   on storage.objects;
drop policy if exists "Admin delete beer-images"   on storage.objects;

create policy "Admin insert beers"         on beers         for insert to authenticated with check (((select auth.jwt()) ->> 'email') = 'admin@troebel.be');
create policy "Admin update beers"         on beers         for update to authenticated using (((select auth.jwt()) ->> 'email') = 'admin@troebel.be') with check (((select auth.jwt()) ->> 'email') = 'admin@troebel.be');
create policy "Admin delete beers"         on beers         for delete to authenticated using (((select auth.jwt()) ->> 'email') = 'admin@troebel.be');
create policy "Admin insert beer_variants" on beer_variants for insert to authenticated with check (((select auth.jwt()) ->> 'email') = 'admin@troebel.be');
create policy "Admin update beer_variants" on beer_variants for update to authenticated using (((select auth.jwt()) ->> 'email') = 'admin@troebel.be') with check (((select auth.jwt()) ->> 'email') = 'admin@troebel.be');
create policy "Admin delete beer_variants" on beer_variants for delete to authenticated using (((select auth.jwt()) ->> 'email') = 'admin@troebel.be');
create policy "Admin select orders"        on orders        for select to authenticated using (((select auth.jwt()) ->> 'email') = 'admin@troebel.be');
create policy "Admin select order_items"   on order_items   for select to authenticated using (((select auth.jwt()) ->> 'email') = 'admin@troebel.be');
create policy "Admin select page_views"    on page_views    for select to authenticated using (((select auth.jwt()) ->> 'email') = 'admin@troebel.be');
create policy "Admin insert beer-images"   on storage.objects for insert to authenticated with check (bucket_id = 'beer-images' and ((select auth.jwt()) ->> 'email') = 'admin@troebel.be');
create policy "Admin update beer-images"   on storage.objects for update to authenticated using (bucket_id = 'beer-images' and ((select auth.jwt()) ->> 'email') = 'admin@troebel.be') with check (bucket_id = 'beer-images' and ((select auth.jwt()) ->> 'email') = 'admin@troebel.be');
create policy "Admin delete beer-images"   on storage.objects for delete to authenticated using (bucket_id = 'beer-images' and ((select auth.jwt()) ->> 'email') = 'admin@troebel.be');
