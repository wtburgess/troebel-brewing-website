-- RLS policies: allow anon key full access for admin + checkout
-- Beers: full CRUD (admin)
CREATE POLICY "Allow insert beers" ON beers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update beers" ON beers FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete beers" ON beers FOR DELETE USING (true);

-- Beer variants: full CRUD (admin)
CREATE POLICY "Allow insert beer_variants" ON beer_variants FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update beer_variants" ON beer_variants FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete beer_variants" ON beer_variants FOR DELETE USING (true);

-- Orders: insert (checkout), select + update (admin)
CREATE POLICY "Allow insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow update orders" ON orders FOR UPDATE USING (true) WITH CHECK (true);

-- Order items: insert (checkout) + select (admin)
CREATE POLICY "Allow insert order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select order_items" ON order_items FOR SELECT USING (true);

-- Order sequences (needed for next_order_seq RPC)
CREATE POLICY "Allow all order_sequences" ON order_sequences FOR ALL USING (true) WITH CHECK (true);
