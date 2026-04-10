import { createPocketBase, getFileUrl, getAuthenticatedPocketBase } from '../pocketbase';
import {
  Beer,
  BeerVariant,
  BeerCategory,
  VariantType,
  PocketBaseBeer,
  PocketBaseVariant,
} from '@/types/beer';

/**
 * Helper to get authenticated PocketBase or throw
 */
async function requireAuth() {
  const pb = await getAuthenticatedPocketBase();
  if (!pb) {
    throw new Error('Authentication required. Please log in again.');
  }
  return pb;
}

// =============================================================================
// BEER CRUD OPERATIONS
// =============================================================================

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

/**
 * Create a new beer with image
 */
export async function createBeer(
  data: CreateBeerData,
  imageFile?: File
): Promise<{ success: boolean; beer?: Beer; error?: string }> {
  try {
    const pb = await requireAuth();

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    if (imageFile) {
      formData.append('image', imageFile);
    }

    const record = await pb.collection('beers').create<PocketBaseBeer>(formData);

    // Transform to Beer type (without variants initially)
    const beer: Beer = {
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
      image: record.image
        ? getFileUrl(record.collectionId, record.id, record.image)
        : '/placeholder-beer.png',
      tastingNotes: record.tastingNotes?.split(',').map((s) => s.trim()).filter(Boolean),
      foodPairings: record.foodPairings?.split(',').map((s) => s.trim()).filter(Boolean),
      isNew: record.isNew,
      isLimited: record.isLimited,
      isFeatured: record.isFeatured,
      sortOrder: record.sortOrder,
      variants: [],
    };

    return { success: true, beer };
  } catch (error) {
    console.error('Failed to create beer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create beer',
    };
  }
}

/**
 * Update an existing beer
 */
export async function updateBeer(
  id: string,
  data: Partial<CreateBeerData>,
  imageFile?: File
): Promise<{ success: boolean; beer?: Beer; error?: string }> {
  try {
    const pb = await requireAuth();

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    if (imageFile) {
      formData.append('image', imageFile);
    }

    const record = await pb.collection('beers').update<PocketBaseBeer>(id, formData);

    const beer: Beer = {
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
      image: record.image
        ? getFileUrl(record.collectionId, record.id, record.image)
        : '/placeholder-beer.png',
      tastingNotes: record.tastingNotes?.split(',').map((s) => s.trim()).filter(Boolean),
      foodPairings: record.foodPairings?.split(',').map((s) => s.trim()).filter(Boolean),
      isNew: record.isNew,
      isLimited: record.isLimited,
      isFeatured: record.isFeatured,
      sortOrder: record.sortOrder,
      variants: [],
    };

    return { success: true, beer };
  } catch (error) {
    console.error('Failed to update beer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update beer',
    };
  }
}

/**
 * Delete a beer and all its variants
 */
export async function deleteBeer(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const pb = await requireAuth();

    // First, delete all variants for this beer
    const variants = await pb.collection('beer_variants').getFullList<PocketBaseVariant>({
      filter: `beer="${id}"`,
      requestKey: null, // Disable auto-cancel to prevent race conditions
    });

    for (const variant of variants) {
      await pb.collection('beer_variants').delete(variant.id);
    }

    // Then delete the beer
    await pb.collection('beers').delete(id);

    return { success: true };
  } catch (error) {
    console.error('Failed to delete beer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete beer',
    };
  }
}

// =============================================================================
// VARIANT CRUD OPERATIONS
// =============================================================================

export interface CreateVariantData {
  beer: string; // Beer ID
  type: VariantType;
  size: string;
  label: string;
  price: number;
  stock: number;
  isAvailable: boolean;
  sortOrder?: number;
}

export interface UpdateVariantData extends Partial<Omit<CreateVariantData, 'beer'>> {
  id: string;
}

/**
 * Create a new variant for a beer
 */
export async function createVariant(
  data: CreateVariantData
): Promise<{ success: boolean; variant?: BeerVariant; error?: string }> {
  try {
    const pb = await requireAuth();

    console.log('[Admin API] Creating variant with data:', JSON.stringify(data, null, 2));
    const record = await pb.collection('beer_variants').create<PocketBaseVariant>(data);

    const variant: BeerVariant = {
      id: record.id,
      beerId: record.beer,
      type: record.type,
      size: record.size,
      label: record.label,
      price: record.price,
      stock: record.stock,
      isAvailable: record.isAvailable && record.stock > 0,
      sortOrder: record.sortOrder || 0,
    };

    return { success: true, variant };
  } catch (error: unknown) {
    console.error('Failed to create variant:', error);

    // Extract detailed error from PocketBase ClientResponseError
    let errorMessage = 'Failed to create variant';
    if (error && typeof error === 'object') {
      const pbError = error as { data?: Record<string, { message: string }>; message?: string };
      if (pbError.data && typeof pbError.data === 'object') {
        // Get field-specific errors
        const fieldErrors = Object.entries(pbError.data)
          .map(([field, err]) => `${field}: ${err?.message || 'invalid'}`)
          .join(', ');
        if (fieldErrors) {
          errorMessage = `Validation failed - ${fieldErrors}`;
        }
      } else if (pbError.message) {
        errorMessage = pbError.message;
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Update an existing variant
 */
export async function updateVariant(
  id: string,
  data: Partial<Omit<CreateVariantData, 'beer'>>
): Promise<{ success: boolean; variant?: BeerVariant; error?: string }> {
  try {
    const pb = await requireAuth();

    const record = await pb.collection('beer_variants').update<PocketBaseVariant>(id, data);

    const variant: BeerVariant = {
      id: record.id,
      beerId: record.beer,
      type: record.type,
      size: record.size,
      label: record.label,
      price: record.price,
      stock: record.stock,
      isAvailable: record.isAvailable && record.stock > 0,
      sortOrder: record.sortOrder || 0,
    };

    return { success: true, variant };
  } catch (error) {
    console.error('Failed to update variant:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update variant',
    };
  }
}

/**
 * Delete a variant
 */
export async function deleteVariant(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const pb = await requireAuth();
    await pb.collection('beer_variants').delete(id);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete variant:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete variant',
    };
  }
}

/**
 * Update variant stock (quick update for +/- buttons)
 */
export async function adjustStock(
  variantId: string,
  adjustment: number
): Promise<{ success: boolean; newStock?: number; error?: string }> {
  try {
    const pb = await requireAuth();

    // Get current variant
    const variant = await pb.collection('beer_variants').getOne<PocketBaseVariant>(variantId, {
      requestKey: null, // Disable auto-cancel to prevent race conditions
    });
    const newStock = Math.max(0, variant.stock + adjustment);

    // Update with new stock
    await pb.collection('beer_variants').update(variantId, {
      stock: newStock,
      isAvailable: variant.isAvailable && newStock > 0,
    });

    return { success: true, newStock };
  } catch (error) {
    console.error('Failed to adjust stock:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to adjust stock',
    };
  }
}

/**
 * Toggle variant availability
 */
export async function toggleAvailability(
  variantId: string
): Promise<{ success: boolean; isAvailable?: boolean; error?: string }> {
  try {
    const pb = await requireAuth();

    // Get current variant
    const variant = await pb.collection('beer_variants').getOne<PocketBaseVariant>(variantId, {
      requestKey: null, // Disable auto-cancel to prevent race conditions
    });
    const newAvailable = !variant.isAvailable;

    // Update availability
    await pb.collection('beer_variants').update(variantId, {
      isAvailable: newAvailable,
    });

    return { success: true, isAvailable: newAvailable };
  } catch (error) {
    console.error('Failed to toggle availability:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to toggle availability',
    };
  }
}

/**
 * Toggle beer featured status (for homepage lineup)
 */
export async function toggleFeatured(
  beerId: string
): Promise<{ success: boolean; isFeatured?: boolean; error?: string }> {
  try {
    const pb = await requireAuth();

    // Get current beer
    const beer = await pb.collection('beers').getOne<PocketBaseBeer>(beerId, {
      requestKey: null, // Disable auto-cancel to prevent race conditions
    });
    const newFeatured = !beer.isFeatured;

    // Update featured status
    await pb.collection('beers').update(beerId, {
      isFeatured: newFeatured,
    });

    return { success: true, isFeatured: newFeatured };
  } catch (error) {
    console.error('Failed to toggle featured:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to toggle featured',
    };
  }
}

// =============================================================================
// BULK OPERATIONS
// =============================================================================

/**
 * Create default variants for a beer
 */
export async function createDefaultVariants(
  beerId: string,
  bottlePrice: number
): Promise<{ success: boolean; variants?: BeerVariant[]; error?: string }> {
  const defaultVariants: Omit<CreateVariantData, 'beer'>[] = [
    {
      type: 'bottle',
      size: '33cl',
      label: 'Flesje 33cl',
      price: bottlePrice,
      stock: 100,
      isAvailable: true,
      sortOrder: 0,
    },
    {
      type: 'crate',
      size: '24x33cl',
      label: 'Bak 24 stuks',
      price: Math.round(bottlePrice * 24 * 0.9 * 100) / 100, // 10% discount
      stock: 5,
      isAvailable: true,
      sortOrder: 1,
    },
    {
      type: 'keg',
      size: '20L',
      label: 'Vat 20L',
      price: Math.round(bottlePrice * 60 * 0.85 * 100) / 100, // ~60 bottles, 15% discount
      stock: 2,
      isAvailable: true,
      sortOrder: 2,
    },
  ];

  const createdVariants: BeerVariant[] = [];

  for (const variantData of defaultVariants) {
    const result = await createVariant({ ...variantData, beer: beerId });
    if (result.success && result.variant) {
      createdVariants.push(result.variant);
    } else {
      // Rollback: delete already created variants
      for (const v of createdVariants) {
        await deleteVariant(v.id);
      }
      return {
        success: false,
        error: result.error || 'Failed to create default variants',
      };
    }
  }

  return { success: true, variants: createdVariants };
}

// =============================================================================
// IMAGE HELPERS
// =============================================================================

/**
 * Generate slug from beer name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-')     // Replace non-alphanumeric with dashes
    .replace(/(^-|-$)/g, '');        // Remove leading/trailing dashes
}

/**
 * Validate image file
 */
export function validateImageFile(
  file: File
): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Ongeldig bestandstype. Gebruik JPG, PNG of WebP.' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'Bestand te groot. Maximum 5MB.' };
  }

  return { valid: true };
}
