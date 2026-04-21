import { createClient } from '../supabase/client';
import {
  Beer,
  BeerVariant,
  BeerCategory,
  VariantType,
} from '@/types/beer';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------
export interface CreateBeerData {
  slug: string;
  name: string;
  style: string;
  category: BeerCategory;
  description: string;
  longDescription?: string;
  abv: number;
  ibu?: number;
  rating?: number;
  ratingCount?: number;
  tastingNotes?: string;
  foodPairings?: string;
  isNew?: boolean;
  isLimited?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
}

export interface UpdateBeerData extends Partial<CreateBeerData> {
  id: string;
}

export interface CreateVariantData {
  beer: string; // Beer ID
  type: VariantType;
  size: string;
  label: string;
  price: number;
  isAvailable: boolean;
  sortOrder?: number;
}

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------
function toSnake(data: Partial<CreateBeerData>) {
  return {
    ...(data.slug !== undefined && { slug: data.slug }),
    ...(data.name !== undefined && { name: data.name }),
    ...(data.style !== undefined && { style: data.style }),
    ...(data.category !== undefined && { category: data.category }),
    ...(data.description !== undefined && { description: data.description }),
    ...(data.longDescription !== undefined && { long_description: data.longDescription }),
    ...(data.abv !== undefined && { abv: data.abv }),
    ...(data.ibu !== undefined && { ibu: data.ibu }),
    ...(data.rating !== undefined && { rating: data.rating }),
    ...(data.ratingCount !== undefined && { rating_count: data.ratingCount }),
    ...(data.tastingNotes !== undefined && { tasting_notes: data.tastingNotes }),
    ...(data.foodPairings !== undefined && { food_pairings: data.foodPairings }),
    ...(data.isNew !== undefined && { is_new: data.isNew }),
    ...(data.isLimited !== undefined && { is_limited: data.isLimited }),
    ...(data.isFeatured !== undefined && { is_featured: data.isFeatured }),
    ...(data.sortOrder !== undefined && { sort_order: data.sortOrder }),
  };
}

function rowToBeer(row: Record<string, unknown>): Beer {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    style: (row.style as string) ?? '',
    category: (row.category as BeerCategory) ?? 'blond',
    description: (row.description as string) ?? '',
    longDescription: (row.long_description as string) ?? undefined,
    abv: (row.abv as number) ?? 0,
    ibu: (row.ibu as number) ?? undefined,
    rating: (row.rating as number) ?? undefined,
    ratingCount: (row.rating_count as number) ?? undefined,
    image: (row.image_url as string) ?? '/placeholder-beer.png',
    tastingNotes: row.tasting_notes
      ? (row.tasting_notes as string).split(',').map((s) => s.trim()).filter(Boolean)
      : undefined,
    foodPairings: row.food_pairings
      ? (row.food_pairings as string).split(',').map((s) => s.trim()).filter(Boolean)
      : undefined,
    isNew: (row.is_new as boolean) ?? false,
    isLimited: (row.is_limited as boolean) ?? false,
    isFeatured: (row.is_featured as boolean) ?? false,
    sortOrder: (row.sort_order as number) ?? 0,
    variants: [],
  };
}

function rowToVariant(row: Record<string, unknown>): BeerVariant {
  return {
    id: row.id as string,
    beerId: row.beer_id as string,
    type: row.type as VariantType,
    size: (row.size as string) ?? '',
    label: row.label as string,
    price: row.price as number,
    volumeMl: (row.volume_ml as number) ?? 0,
    isAvailable: row.is_available as boolean,
    sortOrder: (row.sort_order as number) ?? 0,
  };
}

// ----------------------------------------------------------------
// Beer CRUD
// ----------------------------------------------------------------

/**
 * Upload an image to Supabase Storage and return its public URL.
 * Uses the browser client (anon key) so it works from client components.
 * Requires the beer-images bucket to have public read access and
 * insert/update permissions for the desired role.
 */
async function uploadImageFile(file: File, beerId: string): Promise<string | undefined> {
  try {
    const supabase = createClient();
    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `beers/${beerId}.${ext}`;
    const { error } = await supabase.storage
      .from('beer-images')
      .upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from('beer-images').getPublicUrl(path);
    return data.publicUrl;
  } catch (err) {
    console.error('[admin] Image upload failed:', err);
    return undefined;
  }
}

export async function createBeer(
  data: CreateBeerData,
  imageFile?: File
): Promise<{ success: boolean; beer?: Beer; error?: string }> {
  try {
    const supabase = createClient();

    // Insert the beer first to get the ID, then upload image if provided
    const { data: row, error } = await supabase
      .from('beers')
      .insert(toSnake(data))
      .select()
      .single();

    if (error) throw error;

    const newId = (row as Record<string, unknown>).id as string;
    let imageUrl: string | undefined;

    if (imageFile) {
      imageUrl = await uploadImageFile(imageFile, newId);
      if (imageUrl) {
        await supabase.from('beers').update({ image_url: imageUrl }).eq('id', newId);
        (row as Record<string, unknown>).image_url = imageUrl;
      }
    }

    return { success: true, beer: rowToBeer(row as Record<string, unknown>) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create beer' };
  }
}

export async function updateBeer(
  id: string,
  data: Partial<CreateBeerData>,
  imageFile?: File
): Promise<{ success: boolean; beer?: Beer; error?: string }> {
  try {
    const supabase = createClient();

    let imageUrl: string | undefined;
    if (imageFile) {
      imageUrl = await uploadImageFile(imageFile, id);
    }

    const update = { ...toSnake(data), ...(imageUrl && { image_url: imageUrl }) };
    const { data: row, error } = await supabase
      .from('beers')
      .update(update)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, beer: rowToBeer(row as Record<string, unknown>) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update beer' };
  }
}

export async function deleteBeer(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    // Variants are deleted via ON DELETE CASCADE
    const { error } = await supabase.from('beers').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete beer' };
  }
}

// ----------------------------------------------------------------
// Variant CRUD
// ----------------------------------------------------------------

export async function createVariant(
  data: CreateVariantData
): Promise<{ success: boolean; variant?: BeerVariant; error?: string }> {
  try {
    const supabase = createClient();
    const { data: row, error } = await supabase
      .from('beer_variants')
      .insert({
        beer_id: data.beer,
        type: data.type,
        size: data.size,
        label: data.label,
        price: data.price,
        is_available: data.isAvailable,
        sort_order: data.sortOrder ?? 0,
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, variant: rowToVariant(row as Record<string, unknown>) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create variant' };
  }
}

export async function updateVariant(
  id: string,
  data: Partial<Omit<CreateVariantData, 'beer'>>
): Promise<{ success: boolean; variant?: BeerVariant; error?: string }> {
  try {
    const supabase = createClient();
    const update: Record<string, unknown> = {};
    if (data.type !== undefined) update.type = data.type;
    if (data.size !== undefined) update.size = data.size;
    if (data.label !== undefined) update.label = data.label;
    if (data.price !== undefined) update.price = data.price;
    if (data.isAvailable !== undefined) update.is_available = data.isAvailable;
    if (data.sortOrder !== undefined) update.sort_order = data.sortOrder;

    const { data: row, error } = await supabase
      .from('beer_variants')
      .update(update)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, variant: rowToVariant(row as Record<string, unknown>) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update variant' };
  }
}

export async function deleteVariant(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from('beer_variants').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete variant' };
  }
}


export async function toggleAvailability(
  variantId: string
): Promise<{ success: boolean; isAvailable?: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { data: row, error: fetchError } = await supabase
      .from('beer_variants')
      .select('is_available')
      .eq('id', variantId)
      .single();

    if (fetchError) throw fetchError;

    const newAvailable = !(row.is_available as boolean);
    const { error: updateError } = await supabase
      .from('beer_variants')
      .update({ is_available: newAvailable })
      .eq('id', variantId);

    if (updateError) throw updateError;
    return { success: true, isAvailable: newAvailable };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to toggle availability' };
  }
}

export async function toggleFeatured(
  beerId: string
): Promise<{ success: boolean; isFeatured?: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { data: row, error: fetchError } = await supabase
      .from('beers')
      .select('is_featured')
      .eq('id', beerId)
      .single();

    if (fetchError) throw fetchError;

    const newFeatured = !(row.is_featured as boolean);
    const { error: updateError } = await supabase
      .from('beers')
      .update({ is_featured: newFeatured })
      .eq('id', beerId);

    if (updateError) throw updateError;
    return { success: true, isFeatured: newFeatured };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to toggle featured' };
  }
}

// ----------------------------------------------------------------
// Bulk helpers
// ----------------------------------------------------------------

export async function createDefaultVariants(
  beerId: string,
  bottlePrice: number
): Promise<{ success: boolean; variants?: BeerVariant[]; error?: string }> {
  const defaults: Omit<CreateVariantData, 'beer'>[] = [
    { type: 'bottle', size: '33cl', label: 'Flesje 33cl', price: bottlePrice, isAvailable: true, sortOrder: 0 },
    { type: 'crate', size: '24x33cl', label: 'Bak 24 stuks', price: Math.round(bottlePrice * 24 * 0.9 * 100) / 100, isAvailable: true, sortOrder: 1 },
    { type: 'keg', size: '20L', label: 'Vat 20L', price: Math.round(bottlePrice * 60 * 0.85 * 100) / 100, isAvailable: true, sortOrder: 2 },
  ];

  const created: BeerVariant[] = [];
  for (const v of defaults) {
    const result = await createVariant({ ...v, beer: beerId });
    if (result.success && result.variant) {
      created.push(result.variant);
    } else {
      for (const cv of created) await deleteVariant(cv.id);
      return { success: false, error: result.error ?? 'Failed to create default variants' };
    }
  }
  return { success: true, variants: created };
}

// ----------------------------------------------------------------
// Slug / validation helpers (kept from original)
// ----------------------------------------------------------------

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024;
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Ongeldig bestandstype. Gebruik JPG, PNG of WebP.' };
  }
  if (file.size > maxSize) {
    return { valid: false, error: 'Bestand te groot. Maximum 5MB.' };
  }
  return { valid: true };
}
