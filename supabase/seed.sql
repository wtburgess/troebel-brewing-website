-- Troebel Brewing — seed data (3 flagship beers + variants)
-- Runs automatically on `supabase db reset`.

insert into beers (slug, name, style, category, description, abv, ibu, image_url, is_featured, sort_order)
values ('renbier', 'RENBIER', 'Dubbel', 'tripel',
        'Sinaasappelzeste, diepe kruiden en een tikkeltje rebellie.',
        7, 25, '/Renbier_mockup.jpeg', true, 1)
on conflict (slug) do update set
  name = excluded.name, style = excluded.style, category = excluded.category,
  description = excluded.description, abv = excluded.abv, ibu = excluded.ibu,
  image_url = excluded.image_url, is_featured = excluded.is_featured, sort_order = excluded.sort_order;

insert into beers (slug, name, style, category, description, abv, ibu, image_url, is_featured, sort_order)
values ('frambo', 'FRAMBO', 'Raspberry Gose', 'seasonal',
        'Een beetje sour, een tikkeltje salty, maar verrassend zacht en fruitig van binnen.',
        4.8, 15, '/Frambo_mockup.png', true, 2)
on conflict (slug) do update set
  name = excluded.name, style = excluded.style, category = excluded.category,
  description = excluded.description, abv = excluded.abv, ibu = excluded.ibu,
  image_url = excluded.image_url, is_featured = excluded.is_featured, sort_order = excluded.sort_order;

insert into beers (slug, name, style, category, description, abv, ibu, image_url, is_featured, sort_order)
values ('brews-almighty', 'BREWS ALMIGHTY', 'Blond', 'blond',
        'Lichtblond met een machtige smaak. Hemelse citrusaccenten door whirlpoolhoppen.',
        6.5, 30, '/brews-almighty-mockup.png', true, 3)
on conflict (slug) do update set
  name = excluded.name, style = excluded.style, category = excluded.category,
  description = excluded.description, abv = excluded.abv, ibu = excluded.ibu,
  image_url = excluded.image_url, is_featured = excluded.is_featured, sort_order = excluded.sort_order;

-- Reset variants for idempotent re-runs
delete from beer_variants
 where beer_id in (select id from beers where slug in ('renbier', 'frambo', 'brews-almighty'));

-- Renbier
insert into beer_variants (beer_id, type, size, label, price, stock, volume_ml, is_available, sort_order)
select id, 'bottle', '33cl', 'Flesje 33cl', 3.50, 100, 330, true, 1 from beers where slug = 'renbier';
insert into beer_variants (beer_id, type, size, label, price, stock, volume_ml, is_available, sort_order)
select id, 'crate',  '24x33cl', 'Bak (24 x 33cl)', 75.00, 20, 7920, true, 2 from beers where slug = 'renbier';

-- Frambo
insert into beer_variants (beer_id, type, size, label, price, stock, volume_ml, is_available, sort_order)
select id, 'bottle', '33cl', 'Flesje 33cl', 3.80, 100, 330, true, 1 from beers where slug = 'frambo';

-- Brews Almighty
insert into beer_variants (beer_id, type, size, label, price, stock, volume_ml, is_available, sort_order)
select id, 'bottle', '33cl', 'Flesje 33cl', 3.20, 100, 330, true, 1 from beers where slug = 'brews-almighty';
insert into beer_variants (beer_id, type, size, label, price, stock, volume_ml, is_available, sort_order)
select id, 'keg',    '20L',  'Vat 20L',      110.00, 5, 20000, true, 2 from beers where slug = 'brews-almighty';
