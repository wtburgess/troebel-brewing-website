import { createPocketBase, getFileUrl } from '../pocketbase';
import {
  Beer,
  BeerVariant,
  PocketBaseBeer,
  PocketBaseVariant,
  hasAvailableVariants,
} from '@/types/beer';

// Fallback to static data if PocketBase is unavailable
import { beers as staticBeers } from '@/data/beers';

/**
 * Transform PocketBase variant record to our BeerVariant type
 */
function transformVariant(record: PocketBaseVariant, beerId: string): BeerVariant {
  return {
    id: record.id,
    beerId: beerId,
    type: record.type,
    size: record.size,
    label: record.label,
    price: record.price,
    stock: record.stock,
    volumeMl: record.volumeMl,
    isAvailable: record.isAvailable && record.stock > 0,
    sortOrder: record.sortOrder || 0,
  };
}

/**
 * Transform PocketBase beer record to our Beer type
 */
function transformBeer(record: PocketBaseBeer): Beer {
  // Get variants from expanded relation
  const rawVariants = record.expand?.['beer_variants(beer)'] || [];
  const variants = rawVariants
    .map((v) => transformVariant(v, record.id))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Parse comma-separated strings to arrays
  const tastingNotes = record.tastingNotes
    ? record.tastingNotes.split(',').map((s) => s.trim()).filter(Boolean)
    : undefined;

  const foodPairings = record.foodPairings
    ? record.foodPairings.split(',').map((s) => s.trim()).filter(Boolean)
    : undefined;

  // Build image URL from PocketBase
  const imageUrl = record.image
    ? getFileUrl(record.collectionId, record.id, record.image)
    : '/placeholder-beer.png';

  return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    style: record.style,
    category: record.category,
    description: record.description,
    longDescription: record.longDescription,
    abv: record.abv,
    ibu: record.ibu,
    rating: record.rating,
    ratingCount: record.ratingCount,
    image: imageUrl,
    tastingNotes,
    foodPairings,
    isNew: record.isNew,
    isLimited: record.isLimited,
    isFeatured: record.isFeatured,
    sortOrder: record.sortOrder,
    variants,
  };
}

/**
 * Add default variant to static beer data for backwards compatibility
 */
function addDefaultVariant(staticBeer: typeof staticBeers[0]): Beer {
  const defaultVariant: BeerVariant = {
    id: `${staticBeer.id}-bottle`,
    beerId: staticBeer.id,
    type: 'bottle',
    size: '33cl',
    label: 'Flesje 33cl',
    price: staticBeer.price,
    stock: staticBeer.isAvailable ? 100 : 0,
    volumeMl: 330,
    isAvailable: staticBeer.isAvailable,
    sortOrder: 0,
  };

  return {
    ...staticBeer,
    variants: [defaultVariant],
  };
}

/**
 * Fetch all beers with their variants
 */
export async function getAllBeers(): Promise<Beer[]> {
  try {
    const pb = createPocketBase();
    console.log('[API] Fetching all beers from:', pb.baseUrl);
    const records = await pb.collection('beers').getFullList<PocketBaseBeer>({
      expand: 'beer_variants(beer)',
      sort: 'sortOrder,name',
      requestKey: null, // Disable auto-cancel to prevent race conditions
    });
    console.log('[API] Got', records.length, 'beers from PocketBase');
    return records.map(transformBeer);
  } catch (error) {
    console.error('[API] PocketBase error:', error instanceof Error ? error.message : error);
    // Fallback to static data with default variants
    return staticBeers.map(addDefaultVariant);
  }
}

/**
 * Fetch a single beer by slug
 */
export async function getBeerBySlug(slug: string): Promise<Beer | null> {
  try {
    const pb = createPocketBase();
    const record = await pb
      .collection('beers')
      .getFirstListItem<PocketBaseBeer>(`slug="${slug}"`, {
        expand: 'beer_variants(beer)',
        requestKey: null, // Disable auto-cancel to prevent race conditions
      });

    return transformBeer(record);
  } catch (error) {
    console.warn(`Beer ${slug} not found in PocketBase, using static data:`, error);
    // Fallback to static data
    const staticBeer = staticBeers.find((b) => b.slug === slug);
    return staticBeer ? addDefaultVariant(staticBeer) : null;
  }
}

/**
 * Fetch beers by category
 */
export async function getBeersByCategory(category: string): Promise<Beer[]> {
  try {
    if (category === 'all') {
      return getAllBeers();
    }

    const pb = createPocketBase();
    const records = await pb.collection('beers').getFullList<PocketBaseBeer>({
      filter: `category="${category}"`,
      expand: 'beer_variants(beer)',
      sort: 'sortOrder,name',
      requestKey: null, // Disable auto-cancel to prevent race conditions
    });

    return records.map(transformBeer);
  } catch (error) {
    console.warn('PocketBase unavailable, using static data:', error);
    const filtered =
      category === 'all'
        ? staticBeers
        : staticBeers.filter((b) => b.category === category);
    return filtered.map(addDefaultVariant);
  }
}

/**
 * Fetch featured beers (isFeatured=true) for landing page
 */
export async function getFeaturedBeers(): Promise<Beer[]> {
  try {
    const pb = createPocketBase();
    console.log('[API] Fetching featured beers from:', pb.baseUrl);
    const records = await pb.collection('beers').getFullList<PocketBaseBeer>({
      filter: 'isFeatured=true',
      expand: 'beer_variants(beer)',
      sort: 'sortOrder,name',
      requestKey: null, // Disable auto-cancel to prevent race conditions
    });
    console.log('[API] Got', records.length, 'featured beers:', records.map(r => r.name).join(', '));

    return records.map(transformBeer);
  } catch (error) {
    console.error('[API] PocketBase error for featured:', error instanceof Error ? error.message : error);
    // Fallback: return first 3 beers from static data
    const featured = staticBeers.slice(0, 3);
    return featured.map(addDefaultVariant);
  }
}

/**
 * Fetch only beers with available variants
 */
export async function getAvailableBeers(): Promise<Beer[]> {
  const allBeers = await getAllBeers();
  return allBeers.filter(hasAvailableVariants);
}

/**
 * Get all beer slugs (for static path generation)
 */
export async function getAllBeerSlugs(): Promise<string[]> {
  try {
    const pb = createPocketBase();
    const records = await pb.collection('beers').getFullList<PocketBaseBeer>({
      fields: 'slug',
      requestKey: null, // Disable auto-cancel to prevent race conditions
    });

    return records.map((r) => r.slug);
  } catch (error) {
    console.warn('PocketBase unavailable, using static data:', error);
    return staticBeers.map((b) => b.slug);
  }
}

/**
 * Update beer variant stock (for admin/order processing)
 */
export async function updateVariantStock(
  variantId: string,
  newStock: number
): Promise<boolean> {
  try {
    const pb = createPocketBase();
    await pb.collection('beer_variants').update(variantId, {
      stock: newStock,
      isAvailable: newStock > 0,
    });
    return true;
  } catch (error) {
    console.error('Failed to update variant stock:', error);
    return false;
  }
}

/**
 * Decrement stock for ordered items
 */
export async function decrementStock(
  items: Array<{ variantId: string; quantity: number }>
): Promise<boolean> {
  try {
    const pb = createPocketBase();

    for (const item of items) {
      const variant = await pb
        .collection('beer_variants')
        .getOne<PocketBaseVariant>(item.variantId, {
          requestKey: null, // Disable auto-cancel to prevent race conditions
        });

      const newStock = Math.max(0, variant.stock - item.quantity);
      await pb.collection('beer_variants').update(item.variantId, {
        stock: newStock,
        isAvailable: newStock > 0,
      });
    }

    return true;
  } catch (error) {
    console.error('Failed to decrement stock:', error);
    return false;
  }
}
