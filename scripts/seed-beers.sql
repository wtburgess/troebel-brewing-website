-- Seed data: 3 beers + variants for Troebel Brewing Co.
-- Run with: npx supabase db query --linked -f scripts/seed-beers.sql

-- Renbier
INSERT INTO beers (slug, name, style, category, description, abv, ibu, image_url, is_featured, sort_order)
VALUES ('renbier', 'RENBIER', 'Dubbel', 'tripel',
        'Sinaasappelzeste, diepe kruiden en een tikkeltje rebellie.',
        7, 25, '/Renbier_mockup.jpeg', true, 1)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, style = EXCLUDED.style, category = EXCLUDED.category,
  description = EXCLUDED.description, abv = EXCLUDED.abv, ibu = EXCLUDED.ibu,
  image_url = EXCLUDED.image_url, is_featured = EXCLUDED.is_featured, sort_order = EXCLUDED.sort_order;

-- Frambo
INSERT INTO beers (slug, name, style, category, description, abv, ibu, image_url, is_featured, sort_order)
VALUES ('frambo', 'FRAMBO', 'Raspberry Gose', 'seasonal',
        'Een beetje sour, een tikkeltje salty, maar verrassend zacht en fruitig van binnen.',
        4.8, 15, '/Frambo_mockup.png', true, 2)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, style = EXCLUDED.style, category = EXCLUDED.category,
  description = EXCLUDED.description, abv = EXCLUDED.abv, ibu = EXCLUDED.ibu,
  image_url = EXCLUDED.image_url, is_featured = EXCLUDED.is_featured, sort_order = EXCLUDED.sort_order;

-- Brews Almighty
INSERT INTO beers (slug, name, style, category, description, abv, ibu, image_url, is_featured, sort_order)
VALUES ('brews-almighty', 'BREWS ALMIGHTY', 'Blond', 'blond',
        'Lichtblond met een machtige smaak. Hemelse citrusaccenten door whirlpoolhoppen.',
        6.5, 30, '/brews-almighty-mockup.png', true, 3)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, style = EXCLUDED.style, category = EXCLUDED.category,
  description = EXCLUDED.description, abv = EXCLUDED.abv, ibu = EXCLUDED.ibu,
  image_url = EXCLUDED.image_url, is_featured = EXCLUDED.is_featured, sort_order = EXCLUDED.sort_order;

-- Variants: first delete existing ones (idempotent re-run)
DELETE FROM beer_variants WHERE beer_id IN (SELECT id FROM beers WHERE slug IN ('renbier', 'frambo', 'brews-almighty'));

-- Renbier variants
INSERT INTO beer_variants (beer_id, type, size, label, price, stock, volume_ml, is_available, sort_order)
SELECT id, 'bottle', '33cl', 'Flesje 33cl', 3.50, 100, 330, true, 1 FROM beers WHERE slug = 'renbier';

INSERT INTO beer_variants (beer_id, type, size, label, price, stock, volume_ml, is_available, sort_order)
SELECT id, 'crate', '24x33cl', 'Bak (24 x 33cl)', 75.00, 20, 7920, true, 2 FROM beers WHERE slug = 'renbier';

-- Frambo variants
INSERT INTO beer_variants (beer_id, type, size, label, price, stock, volume_ml, is_available, sort_order)
SELECT id, 'bottle', '33cl', 'Flesje 33cl', 3.80, 100, 330, true, 1 FROM beers WHERE slug = 'frambo';

-- Brews Almighty variants
INSERT INTO beer_variants (beer_id, type, size, label, price, stock, volume_ml, is_available, sort_order)
SELECT id, 'bottle', '33cl', 'Flesje 33cl', 3.20, 100, 330, true, 1 FROM beers WHERE slug = 'brews-almighty';

INSERT INTO beer_variants (beer_id, type, size, label, price, stock, volume_ml, is_available, sort_order)
SELECT id, 'keg', '20L', 'Vat 20L', 110.00, 5, 20000, true, 2 FROM beers WHERE slug = 'brews-almighty';
