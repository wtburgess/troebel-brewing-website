import { createClient } from '../supabase/client';
import { createAnonClient } from '../supabase/server';
import {
  Beer,
  BeerVariant,
  hasAvailableVariants,
} from '@/types/beer';

// Fallback to static data if Supabase is unavailable
import { beers as staticBeers } from '@/data/beers';

// ----------------------------------------------------------------
// Raw Supabase row types
// ----------------------------------------------------------------
interface SupabaseBeer {
  id: string;
  slug: string;
  name: string;
  style: string | null;
  category: string | null;
  description: string | null;
  long_description: string | null;
  abv: number | null;
  ibu: number | null;
  rating: number | null;
  rating_count: number | null;
  image_url: string | null;
  tasting_notes: string | null;
  food_pairings: string | null;
  is_new: boolean;
  is_limited: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  beer_variants?: SupabaseVariant[];
}

interface SupabaseVariant {
  id: string;
  beer_id: string;
  type: string;
  size: string | null;
  label: string;
  price: number;
  volume_ml: number | null;
  is_available: boolean;
  sort_order: number;
}

// ----------------------------------------------------------------
// Transforms
// ----------------------------------------------------------------
function transformVariant(row: SupabaseVariant): BeerVariant {
  return {
    id: row.id,
    beerId: row.beer_id,
    type: row.type as BeerVariant['type'],
    size: row.size ?? '',
    label: row.label,
    price: row.price,
    volumeMl: row.volume_ml ?? 0,
    isAvailable: row.is_available,
    sortOrder: row.sort_order,
  };
}

function transformBeer(row: SupabaseBeer): Beer {
  const variants = (row.beer_variants ?? [])
    .map(transformVariant)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const tastingNotes = row.tasting_notes
    ? row.tasting_notes.split(',').map((s) => s.trim()).filter(Boolean)
    : undefined;

  const foodPairings = row.food_pairings
    ? row.food_pairings.split(',').map((s) => s.trim()).filter(Boolean)
    : undefined;

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    style: row.style ?? '',
    category: (row.category ?? 'blond') as Beer['category'],
    description: row.description ?? '',
    longDescription: row.long_description ?? undefined,
    abv: row.abv ?? 0,
    ibu: row.ibu ?? undefined,
    rating: row.rating ?? undefined,
    ratingCount: row.rating_count ?? undefined,
    image: row.image_url ?? '/placeholder-beer.png',
    tastingNotes,
    foodPairings,
    isNew: row.is_new,
    isLimited: row.is_limited,
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
    variants,
  };
}

function addDefaultVariant(staticBeer: (typeof staticBeers)[0]): Beer {
  const defaultVariant: BeerVariant = {
    id: `${staticBeer.id}-bottle`,
    beerId: staticBeer.id,
    type: 'bottle',
    size: '33cl',
    label: 'Flesje 33cl',
    price: staticBeer.price,
    volumeMl: 330,
    isAvailable: staticBeer.isAvailable,
    sortOrder: 0,
  };
  return { ...staticBeer, variants: [defaultVariant] };
}

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------
function getSupabaseClient() {
  if (typeof window === 'undefined') {
    return createAnonClient();
  }
  return createClient();
}

const SELECT_BEERS = '*, beer_variants(*)';

// ----------------------------------------------------------------
// Public API
// ----------------------------------------------------------------

export async function getAllBeers(): Promise<Beer[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('beers')
      .select(SELECT_BEERS)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;
    return (data as SupabaseBeer[]).map(transformBeer);
  } catch (error) {
    console.error('[API] Supabase error:', error instanceof Error ? error.message : error);
    return staticBeers.map(addDefaultVariant);
  }
}

export async function getBeerBySlug(slug: string): Promise<Beer | null> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('beers')
      .select(SELECT_BEERS)
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return transformBeer(data as SupabaseBeer);
  } catch (error) {
    console.warn(`Beer ${slug} not found in Supabase, using static data:`, error);
    const staticBeer = staticBeers.find((b) => b.slug === slug);
    return staticBeer ? addDefaultVariant(staticBeer) : null;
  }
}

export async function getBeersByCategory(category: string): Promise<Beer[]> {
  if (category === 'all') return getAllBeers();

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('beers')
      .select(SELECT_BEERS)
      .eq('category', category)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;
    return (data as SupabaseBeer[]).map(transformBeer);
  } catch (error) {
    console.warn('Supabase unavailable, using static data:', error);
    const filtered = staticBeers.filter((b) => b.category === category);
    return filtered.map(addDefaultVariant);
  }
}

export async function getFeaturedBeers(): Promise<Beer[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('beers')
      .select(SELECT_BEERS)
      .eq('is_featured', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return (data as SupabaseBeer[]).map(transformBeer);
  } catch (error) {
    console.error('[API] Supabase error for featured:', error instanceof Error ? error.message : error);
    return staticBeers.slice(0, 3).map(addDefaultVariant);
  }
}

export async function getAvailableBeers(): Promise<Beer[]> {
  const allBeers = await getAllBeers();
  return allBeers.filter(hasAvailableVariants);
}

export async function getAllBeerSlugs(): Promise<string[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('beers')
      .select('slug');

    if (error) throw error;
    return (data as { slug: string }[]).map((r) => r.slug);
  } catch (error) {
    console.warn('Supabase unavailable, using static data:', error);
    return staticBeers.map((b) => b.slug);
  }
}

