-- Scope every mutation/admin-read in the catalog + storage to the admin email
-- (auth.jwt() ->> 'email' = 'admin@troebel.be'). If customer accounts are ever
-- added later, they can't inherit admin privileges.
-- Applied via MCP on 2026-04-21.

drop policy if exists "Authed insert beers"         on beers;
drop policy if exists "Authed update beers"         on beers;
drop policy if exists "Authed delete beers"         on beers;
drop policy if exists "Authed insert beer_variants" on beer_variants;
drop policy if exists "Authed update beer_variants" on beer_variants;
drop policy if exists "Authed delete beer_variants" on beer_variants;

create policy "Admin insert beers"         on beers         for insert to authenticated with check ((auth.jwt() ->> 'email') = 'admin@troebel.be');
create policy "Admin update beers"         on beers         for update to authenticated using ((auth.jwt() ->> 'email') = 'admin@troebel.be') with check ((auth.jwt() ->> 'email') = 'admin@troebel.be');
create policy "Admin delete beers"         on beers         for delete to authenticated using ((auth.jwt() ->> 'email') = 'admin@troebel.be');
create policy "Admin insert beer_variants" on beer_variants for insert to authenticated with check ((auth.jwt() ->> 'email') = 'admin@troebel.be');
create policy "Admin update beer_variants" on beer_variants for update to authenticated using ((auth.jwt() ->> 'email') = 'admin@troebel.be') with check ((auth.jwt() ->> 'email') = 'admin@troebel.be');
create policy "Admin delete beer_variants" on beer_variants for delete to authenticated using ((auth.jwt() ->> 'email') = 'admin@troebel.be');

drop policy if exists "Authed select orders"      on orders;
drop policy if exists "Authed select order_items" on order_items;
create policy "Admin select orders"      on orders      for select to authenticated using ((auth.jwt() ->> 'email') = 'admin@troebel.be');
create policy "Admin select order_items" on order_items for select to authenticated using ((auth.jwt() ->> 'email') = 'admin@troebel.be');

drop policy if exists "Anon insert page_views" on page_views;
drop policy if exists "Anon select page_views" on page_views;
create policy "Admin select page_views" on page_views for select to authenticated using ((auth.jwt() ->> 'email') = 'admin@troebel.be');

drop policy if exists "beer-images anon insert" on storage.objects;
drop policy if exists "beer-images anon update" on storage.objects;
drop policy if exists "beer-images anon delete" on storage.objects;
create policy "Admin insert beer-images" on storage.objects for insert to authenticated with check (bucket_id = 'beer-images' and (auth.jwt() ->> 'email') = 'admin@troebel.be');
create policy "Admin update beer-images" on storage.objects for update to authenticated using (bucket_id = 'beer-images' and (auth.jwt() ->> 'email') = 'admin@troebel.be') with check (bucket_id = 'beer-images' and (auth.jwt() ->> 'email') = 'admin@troebel.be');
create policy "Admin delete beer-images" on storage.objects for delete to authenticated using (bucket_id = 'beer-images' and (auth.jwt() ->> 'email') = 'admin@troebel.be');
